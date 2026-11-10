'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import Reveal from '@/components/Reveal'

// Startsidan under heron. Ordningen berättar vad Screndo gör: problemet,
// en övergång, funktionerna (de nio korten), hur frågorna når alla, och
// sist forskningen, integriteten och uppmaningen.
// Mått, färger och avstånd ligger i globals.css (klasserna home-*). Texterna
// ligger i LanguageContext (home*). Scrollanimationerna går via Reveal (en
// gång per element, när det kommer in i bild).

const STAT_SOURCES = {
  recognition: 'https://www.gallup.com/workplace/650174/employee-recognition-quality-drives-retention.aspx',
  engagement: 'https://www.gallup.com/workplace/321725/gallup-q12-meta-analysis-2024.aspx',
}

// Funktionskorten i visningsordning (nio lika stora, kvadratiska kort).
const FEATURES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'] as const
type FeatureKey = (typeof FEATURES)[number]

// Enkla linjeikoner för frågekanalerna (24x24, 1.5 px linje).
const CHANNEL_ICONS = {
  sms: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6.5" y="2.75" width="11" height="18.5" rx="2.5" />
      <path d="M10.5 18h3" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5.25" width="18" height="13.5" rx="2" />
      <path d="M3.5 6.5l8.5 6.25 8.5-6.25" />
    </svg>
  ),
  qr: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1" />
      <rect x="14" y="3.5" width="6.5" height="6.5" rx="1" />
      <rect x="3.5" y="14" width="6.5" height="6.5" rx="1" />
      <path d="M14 14h2.5v2.5H14zM18.5 14h2M14 18.5h2M18 18v2.5h2.5" />
    </svg>
  ),
}

// Räknar lugnt upp från 0 till värdet när siffran kommer in i bild.
// "45 %" blir 0 % → 45 %; allt efter siffran (mellanslag, %) står kvar.
// Servern renderar slutvärdet; uppräkningen skriver bara om texten.
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    const match = value.match(/^(\d+)(.*)$/)
    if (!el || !match || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const target = Number(match[1])
    const suffix = match[2]
    let raf = 0
    el.textContent = `0${suffix}`
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const DURATION = 1400
        const frame = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION)
          el.textContent = `${Math.round(target * (1 - Math.pow(1 - t, 3)))}${suffix}`
          if (t < 1) raf = requestAnimationFrame(frame)
        }
        raf = requestAnimationFrame(frame)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value])

  // key: nytt span (och ny textnod) när värdet byts, t.ex. vid språkbyte.
  return <span ref={ref} key={value}>{value}</span>
}

// Kvadratiska funktionskort. I vila visas bildytan och rubriken; när kortet
// öppnas (hover, tangentbordsfokus eller tryck på pekskärm) växer det till
// ungefär två kort brett och visar hela texten. Det växer åt det håll där
// det finns plats: kortet längst till höger växer åt vänster, och ett kort
// i nedersta raden växer uppåt om det behöver bli högre. Kortet ligger över
// grannkorten, så rutnätet flyttar sig inte.
function FeatureGrid() {
  const { t } = useLanguage()
  const gridRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<FeatureKey | null>(null)
  const [dir, setDir] = useState<{ x: 'left' | 'right'; y: 'up' | 'down' }>({ x: 'right', y: 'down' })

  const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function openCard(key: FeatureKey, cell: HTMLElement) {
    if (reduced()) return
    const grid = gridRef.current
    if (!grid) return
    const gap = parseFloat(getComputedStyle(grid).columnGap) || 0
    const w = cell.offsetWidth + gap
    const h = cell.offsetHeight + gap
    const cols = Math.max(1, Math.round((grid.clientWidth + gap) / w))
    const col = Math.round(cell.offsetLeft / w)
    const row = Math.round(cell.offsetTop / h)
    const rows = Math.ceil(FEATURES.length / cols)
    // Uppåt i nedersta raden, eller när det utfällda kortet inte får plats
    // nedåt i fönstret men gör det uppåt. Texten har fast bredd, så dess
    // höjd går att mäta redan innan kortet öppnas.
    const text = cell.querySelector('.home-feat-more p') as HTMLElement | null
    const openH = Math.max(cell.offsetHeight, text?.offsetHeight ?? 0)
    const r = cell.getBoundingClientRect()
    const fitsDown = r.top + openH <= window.innerHeight - 8
    const fitsUp = r.bottom - openH >= 8
    const up = rows > 1 && (row >= rows - 1 || (!fitsDown && fitsUp))
    setDir({ x: col >= cols - 1 ? 'left' : 'right', y: up ? 'up' : 'down' })
    setOpen(key)
  }

  // På pekskärm stängs ett öppet kort när man trycker utanför det.
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!gridRef.current?.contains(e.target as Node)) setOpen(null)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  return (
    <div className="home-feat-grid" ref={gridRef}>
      {FEATURES.map((key, i) => {
        const isOpen = open === key
        return (
          <Reveal key={key} className="home-feat-cell" delay={(i % 3) * 80} duration={800}>
            <article
              className={`home-feat${isOpen ? ' is-open' : ''}`}
              data-x={isOpen ? dir.x : undefined}
              data-y={isOpen ? dir.y : undefined}
              tabIndex={0}
              role="button"
              aria-expanded={isOpen}
              onMouseEnter={(e) => canHover() && openCard(key, e.currentTarget.parentElement as HTMLElement)}
              onMouseLeave={() => canHover() && setOpen((k) => (k === key ? null : k))}
              onFocus={(e) => {
                if (e.currentTarget.matches(':focus-visible')) openCard(key, e.currentTarget.parentElement as HTMLElement)
              }}
              onBlur={() => setOpen((k) => (k === key ? null : k))}
              onClick={(e) => {
                if (canHover()) return
                if (isOpen) setOpen(null)
                else openCard(key, e.currentTarget.parentElement as HTMLElement)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setOpen(null)
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  if (isOpen) setOpen(null)
                  else openCard(key, e.currentTarget.parentElement as HTMLElement)
                }
              }}
            >
              <div className="home-feat-main">
                <div className="home-feat-media" aria-hidden="true" style={{ '--glow-delay': `${-i * 2.3}s` } as React.CSSProperties} />
                <h3>{t[`homeFeat${key}Head`]}</h3>
              </div>
              <div className="home-feat-more">
                <p>{t[`homeFeat${key}Text`]}</p>
              </div>
            </article>
          </Reveal>
        )
      })}
    </div>
  )
}

export default function HomeSections() {
  const { t } = useLanguage()

  const facts = [
    [t.homeTrust1Title, t.homeTrust1Text],
    [t.homeTrust2Title, t.homeTrust2Text],
    [t.homeTrust3Title, t.homeTrust3Text],
    [t.homeTrust4Title, t.homeTrust4Text],
    [t.homeTrust5Title, t.homeTrust5Text],
  ]
  const channels = [
    { key: 'sms', head: t.homeChannelSmsHead, text: t.homeChannelSmsText },
    { key: 'mail', head: t.homeChannelMailHead, text: t.homeChannelMailText },
    { key: 'qr', head: t.homeChannelQrHead, text: t.homeChannelQrText },
  ] as const

  return (
    <div className="home">
      {/* Utan JavaScript ska allt synas direkt. */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: '[data-reveal]{opacity:1!important;transform:none!important}',
          }}
        />
      </noscript>

      {/* 2. Problemet: smal textsektion med Gallup-siffrorna, ljusblå */}
      <section className="home-section home-cost home-problem" style={{ background: 'var(--home-mist)' }}>
        <div className="home-wrap">
          <Reveal as="h2" className="home-big">
            {t.homeProblemHeadline1}
            <br />
            <span>{t.homeProblemHeadline2}</span>
          </Reveal>
          <div className="home-problem-text">
            <Reveal as="p" className="home-lede" delay={140}>{t.homeProblemPara1}</Reveal>
            <Reveal as="p" className="home-lede" delay={220}>{t.homeProblemPara2}</Reveal>
          </div>
          <div className="home-stats">
            {[
              { value: t.homeStat1Value, text: t.homeStat1Text, source: t.homeStat1Source, href: STAT_SOURCES.recognition },
              { value: t.homeStat2Value, text: t.homeStat2Text, source: t.homeStat2Source, href: STAT_SOURCES.engagement },
            ].map((stat, i) => (
              <div className="home-stat" key={stat.href}>
                <Reveal className="home-stat-n" variant="fade" duration={1000} delay={i * 120}>
                  <CountUp value={stat.value} />
                </Reveal>
                <Reveal as="p" delay={140 + i * 120}>{stat.text}</Reveal>
                <Reveal variant="fade" delay={260 + i * 120}>
                  <a className="home-source" href={stat.href} target="_blank" rel="noopener noreferrer">
                    {stat.source}
                  </a>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Övergång: rubrik och text till vänster, bild till höger (på mobil
          text först, bild under). */}
      <section className="home-section home-transition">
        <div className="home-wrap home-transition-grid">
          <div>
            <Reveal as="h2" className="home-big">{t.homeTransitionHeadline}</Reveal>
            <Reveal as="p" className="home-lede" delay={140}>{t.homeTransitionBody}</Reveal>
          </div>
          <Reveal className="home-transition-photo" variant="fade" duration={1100} delay={120}>
            <Image
              src="/wallpaperblur.jpg"
              alt={t.homeTransitionImageAlt}
              fill
              sizes="(max-width: 900px) calc(100vw - 2 * clamp(16px, 5vw, 72px)), 46vw"
              style={{ objectFit: 'cover', objectPosition: '50% 40%' }}
            />
          </Reveal>
        </div>
      </section>

      {/* 4. Vad Screndo gör: nio kvadratiska kort som växer ut och visar hela
          texten. Bildytan fylls med en långsam blå gradient tills riktiga
          bilder finns. */}
      <section className="home-section home-features" style={{ paddingTop: 0 }}>
        <div className="home-wrap">
          <Reveal as="h2" className="home-big">{t.homeFeaturesHeadline}</Reveal>
          <Reveal as="p" className="home-lede" delay={140} style={{ marginTop: '24px' }}>{t.homeFeaturesIntro}</Reveal>
          <FeatureGrid />
        </div>
      </section>

      {/* 5. Frågekanaler: tre kanaler i rad, enkla linjeikoner */}
      <section className="home-section home-channels-section" style={{ background: 'var(--home-mist)' }}>
        <div className="home-wrap">
          <Reveal as="h2" className="home-big" style={{ maxWidth: '900px' }}>{t.homeChannelsHeadline}</Reveal>
          <Reveal as="p" className="home-lede" delay={140} style={{ marginTop: '24px' }}>{t.homeChannelsBody}</Reveal>
          <ul className="home-channels">
            {channels.map(({ key, head, text }, i) => (
              <Reveal as="li" key={key} delay={i * 110} duration={800}>
                <span className="home-channel-icon">{CHANNEL_ICONS[key]}</span>
                <h3>{head}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Forskning: bilden glider in från vänster, texten tonar in. Full
          marginal ovanför, eftersom den nu följer den ljusblå kanalsektionen. */}
      <section className="home-section">
        <div className="home-wrap home-research">
          {/* Lugn rörelse: kort sträcka, 1,3 s, mjuk utgång (ease-out cubic) */}
          <Reveal className="home-photo" variant="left" distance={24} duration={1300} easing="cubic-bezier(0.33, 1, 0.68, 1)">
            <Image
              src="/hskolan.jpg"
              alt={t.homeResearchImageAlt}
              fill
              sizes="(max-width: 900px) calc(100vw - 2 * clamp(16px, 5vw, 72px)), min(665px, 46vw)"
              style={{ objectFit: 'cover', objectPosition: '50% 50%' }}
            />
          </Reveal>
          <div>
            <Reveal as="h2" className="home-big" variant="fade" duration={900} delay={120}>{t.homeResearchHeadline}</Reveal>
            <Reveal as="p" className="home-lede" variant="fade" duration={900} delay={260} style={{ marginTop: '24px' }}>
              {t.homeResearchBody}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 7. Integritet: raderna tonar in en i taget */}
      <section className="home-section">
        <div className="home-wrap">
          <Reveal as="h2" className="home-big" style={{ maxWidth: '900px' }}>{t.homeTrustHeadline}</Reveal>
          <ul className="home-facts">
            {facts.map(([title, text], i) => (
              <Reveal as="li" key={title} variant="fade" duration={700} delay={i * 110}>
                <b>{title}</b>
                <span>{text}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. Avslutande uppmaning */}
      <section className="home-section home-cta" style={{ paddingTop: 0 }}>
        <div className="home-wrap">
          <Reveal as="h2" className="home-big">{t.homeCtaHeadline}</Reveal>
          <Reveal as="p" className="home-lede" delay={140}>{t.homeCtaBody}</Reveal>
          <Reveal delay={240}>
            <a href="/book-intro" className="hero-cta">
              {t.bookIntro}
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
