'use client'

import Image from 'next/image'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { heroCards } from '@/lib/heroCards'
import { useLanguage } from '@/lib/LanguageContext'

// Ändlös bildrad under heron. Korten ligger i tre identiska kopior i en
// vanlig horisontell scroll-container (så svep, trackpad och tangentbord
// fungerar nativt). Positionen hålls alltid i mittenkopian: när raden har
// glidit in i en yttre kopia hoppar scrollLeft tyst ±en hel kopia, där
// innehållet är pixel-identiskt, så loopen syns aldrig hoppa. Aktivt kort
// jämförs modulo antalet kort, så att tvillingen i den andra kopian redan
// är tänd i samma ögonblick som hoppet sker.

const N = heroCards.length
const COPIES = 3
const SLOTS = Array.from({ length: N * COPIES }, (_, i) => i)
const INTERVAL_MS = 3000
const SLIDE_MS = 900

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export default function HeroCarousel() {
  const { lang } = useLanguage()
  const trackRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(N) // index (i hela listan) för kortet längst till vänster
  const animRef = useRef<number | null>(null)
  const settleRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [active, setActive] = useState(0) // kortnummer 0..N-1
  const [hovered, setHovered] = useState<number | null>(null)
  const [focused, setFocused] = useState<number | null>(null)
  const [rowHover, setRowHover] = useState(false)
  const [touching, setTouching] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const highlighted = hovered ?? focused ?? active
  const paused = rowHover || focused !== null || touching || reducedMotion

  // Avstånd mellan två kortstarter, med decimaler (offsetLeft avrundar
  // till heltal, och felet skulle synas som ett ryck vid varje loop).
  const step = useCallback(() => {
    const el = trackRef.current
    if (!el || el.children.length < 2) return 0
    return (
      el.children[1].getBoundingClientRect().left -
      el.children[0].getBoundingClientRect().left
    )
  }, [])

  // Sätter scrollLeft utan att scroll-snap eller mjuk scroll lägger sig i.
  const setScroll = useCallback((left: number) => {
    const el = trackRef.current
    if (!el) return
    el.style.scrollSnapType = 'none'
    el.scrollLeft = left
    void el.offsetWidth
    el.style.scrollSnapType = ''
  }, [])

  // Flyttar tillbaka positionen till mittenkopian om den har hamnat utanför.
  const normalize = useCallback(() => {
    const el = trackRef.current
    const s = step()
    if (!el || !s) return
    let pos = Math.round(el.scrollLeft / s)
    let shift = 0
    if (pos >= 2 * N) shift = -N
    else if (pos < N) shift = N
    if (shift) {
      setScroll(el.scrollLeft + shift * s)
      pos += shift
      // Tangentbordsfokus följer med till tvillingen, som nu står på samma plats.
      const focusedEl = document.activeElement
      const idx = Array.prototype.indexOf.call(el.children, focusedEl)
      if (idx !== -1) {
        const twin = el.children[(idx % N) + N] as HTMLElement | undefined
        twin?.focus({ preventScroll: true })
      }
    }
    posRef.current = pos
    setActive(((pos % N) + N) % N)
  }, [setScroll, step])

  const slideTo = useCallback(
    (pos: number, animate: boolean) => {
      const el = trackRef.current
      const s = step()
      if (!el || !s) return
      if (animRef.current) cancelAnimationFrame(animRef.current)
      const from = el.scrollLeft
      const to = pos * s
      posRef.current = pos
      setActive(((pos % N) + N) % N)
      if (!animate) {
        setScroll(to)
        normalize()
        return
      }
      el.style.scrollSnapType = 'none'
      const start = performance.now()
      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / SLIDE_MS)
        el.scrollLeft = from + (to - from) * easeInOutCubic(t)
        if (t < 1) {
          animRef.current = requestAnimationFrame(frame)
        } else {
          animRef.current = null
          el.style.scrollSnapType = ''
          normalize()
        }
      }
      animRef.current = requestAnimationFrame(frame)
    },
    [normalize, setScroll, step],
  )

  // Startposition: mittenkopian. Innehållet i första kopian är identiskt,
  // så den server-renderade vyn och vyn efter hydrering ser likadana ut.
  useLayoutEffect(() => {
    const s = step()
    if (s) setScroll(N * s)
  }, [setScroll, step])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Håll samma kort längst till vänster när fönsterbredden ändras.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      if (animRef.current) return
      setScroll(posRef.current * step())
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [setScroll, step])

  // Automatisk förflyttning, ett kort var tredje sekund. Startas om (och
  // väntar alltså en hel intervall) varje gång pausen släpps.
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      if (document.hidden) return
      slideTo(posRef.current + 1, true)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [paused, slideTo])

  useEffect(
    () => () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      if (settleRef.current) clearTimeout(settleRef.current)
    },
    [],
  )

  // Användaren tar över mitt i en glidning: släpp animationen direkt så
  // att svepet inte slåss med den, och låt scroll-snap ta vid.
  const cancelSlide = () => {
    if (!animRef.current) return
    cancelAnimationFrame(animRef.current)
    animRef.current = null
    if (trackRef.current) trackRef.current.style.scrollSnapType = ''
  }

  // Manuell scroll (svep, trackpad): uppdatera aktivt kort och normalisera
  // när scrollen har stannat.
  const onScroll = () => {
    if (animRef.current) return
    if (settleRef.current) clearTimeout(settleRef.current)
    settleRef.current = setTimeout(normalize, 140)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    const el = trackRef.current
    if (!el) return
    const idx = Array.prototype.indexOf.call(el.children, document.activeElement)
    if (idx === -1) return
    e.preventDefault()
    const next = idx + (e.key === 'ArrowRight' ? 1 : -1)
    const target = el.children[next] as HTMLElement | undefined
    if (!target) return
    target.focus({ preventScroll: true })
    setFocused(next % N)
    slideTo(next, !reducedMotion)
  }

  return (
    <div
      ref={trackRef}
      className="hero-cards-track"
      data-lenis-prevent-horizontal
      role="group"
      aria-roledescription="karusell"
      aria-label={lang === 'sv' ? 'Medarbetarperspektiv' : 'Employee perspectives'}
      onScroll={onScroll}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setRowHover(true)}
      onMouseLeave={() => {
        setRowHover(false)
        setHovered(null)
      }}
      onWheel={(e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) cancelSlide()
      }}
      onTouchStart={() => {
        cancelSlide()
        setTouching(true)
      }}
      onTouchEnd={() => setTouching(false)}
      onTouchCancel={() => setTouching(false)}
    >
      {SLOTS.map((slot) => {
        const n = slot % N
        const card = heroCards[n]
        const text = card[lang]
        const isClone = slot < N || slot >= 2 * N
        const isLit = n === highlighted
        return (
          <figure
            key={slot}
            className={`hero-card${isLit ? ' is-lit' : ''}`}
            tabIndex={isClone ? -1 : 0}
            aria-hidden={isClone || undefined}
            onMouseEnter={() => setHovered(n)}
            onFocus={(e) => {
              if (!e.currentTarget.matches(':focus-visible')) return
              setFocused(n)
              // Fokus mitt i en glidning, eller på ett kort som bara delvis
              // syns: stanna och lägg kortet längst till vänster.
              const track = trackRef.current
              if (!track) return
              const r = e.currentTarget.getBoundingClientRect()
              const tr = track.getBoundingClientRect()
              const fullyVisible = r.left >= tr.left - 1 && r.right <= tr.right + 1
              if (animRef.current || !fullyVisible) slideTo(slot, !reducedMotion)
            }}
            onBlur={() => setFocused(null)}
          >
            <Image
              src={card.src}
              alt={isClone ? '' : text.alt}
              fill
              sizes="(max-width: 640px) 64vw, (max-width: 1024px) 40vw, 24vw"
              preload={slot < 4}
              loading={n < 4 ? 'eager' : 'lazy'}
              className="hero-card-img"
            />
            <figcaption className="hero-card-caption">
              <strong>{text.role}</strong>
              <span>{text.perspective}</span>
            </figcaption>
          </figure>
        )
      })}
    </div>
  )
}
