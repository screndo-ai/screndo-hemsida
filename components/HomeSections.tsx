'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import Reveal from '@/components/Reveal'

// Startsidan under heron. Ordningen berättar vad Screndo gör: problemet,
// en övergång, funktionerna (bento-korten), översikten i laptopen, hur
// frågorna når alla, och sist forskningen, integriteten och uppmaningen.
// Mått, färger och avstånd ligger i globals.css (klasserna home-*). Texterna
// ligger i LanguageContext (home*). Scrollanimationerna går via Reveal (en
// gång per element, när det kommer in i bild).

const STAT_SOURCES = {
  recognition: 'https://www.gallup.com/workplace/650174/employee-recognition-quality-drives-retention.aspx',
  engagement: 'https://www.gallup.com/workplace/321725/gallup-q12-meta-analysis-2024.aspx',
}

// Funktionskorten i visningsordning. size styr storleken i bento-rutnätet
// (se .home-card--* i globals.css); på mobil står de i en kolumn i samma
// ordning.
const FEATURES = [
  { key: 'A', size: 'lg' },
  { key: 'B', size: 'sm' },
  { key: 'C', size: 'sm' },
  { key: 'D', size: 'lg' },
  { key: 'F', size: 'lg' },
  { key: 'E', size: 'sm' },
  { key: 'G', size: 'md' },
  { key: 'H', size: 'md' },
] as const

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

// Skärmen i macci1.png är en lätt trapets: bredare nedtill. Hörnen,
// uppmätta i bilden, som andel av .home-screen (skärmens omslutande ruta):
// övre vänster, övre höger, nedre höger, nedre vänster.
const SCREEN_QUAD: [number, number][] = [
  [0.00625, 0],
  [0.99282, 0],
  [1, 1],
  [0, 1],
]

// Perspektivtransform (homografi) som lägger en rektangel w x h på
// fyrhörningen ovan. matrix3d är i pixlar och beror därför på storleken;
// den räknas om när skärmen ändrar storlek.
function quadMatrix3d(w: number, h: number) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = SCREEN_QUAD.map(([u, v]) => [u * w, v * h])
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3
  const den = dx1 * dy2 - dx2 * dy1
  const g = (dx3 * dy2 - dx2 * dy3) / den
  const k = (dx1 * dy3 - dx3 * dy1) / den
  const a = x1 - x0 + g * x1, b = x3 - x0 + k * x3, c = x0
  const d = y1 - y0 + g * y1, e = y3 - y0 + k * y3, f = y0
  // Från enhetskvadrat till pixlar i elementet: dela kolumnerna med w och h.
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, k / h, 0, 0, 1, 0, c, f, 0, 1]
  return `matrix3d(${m.map((n) => +n.toFixed(8)).join(',')})`
}

function LaptopScreen({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const apply = () => {
      const w = el.offsetWidth, h = el.offsetHeight
      if (w && h) el.style.transform = quadMatrix3d(w, h)
    }
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div className="home-screen" ref={ref}>
      {children}
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

      {/* 3. Övergång: stor, luftig rubrik och lite text, ingen bild */}
      <section className="home-section home-transition">
        <div className="home-wrap">
          <Reveal as="h2" className="home-big home-transition-title" duration={1000}>{t.homeTransitionHeadline}</Reveal>
          <Reveal as="p" className="home-lede" delay={180} duration={1000}>{t.homeTransitionBody}</Reveal>
        </div>
      </section>

      {/* 4. Vad Screndo gör: bento-kort i olika storlekar. Bildytan fylls med
          en långsam blå gradient tills riktiga bilder finns. */}
      <section className="home-section home-features" style={{ paddingTop: 0 }}>
        <div className="home-wrap">
          <Reveal as="h2" className="home-big">{t.homeFeaturesHeadline}</Reveal>
          <Reveal as="p" className="home-lede" delay={140} style={{ marginTop: '24px' }}>{t.homeFeaturesIntro}</Reveal>
          <div className="home-bento">
            {FEATURES.map(({ key, size }, i) => (
              <Reveal
                as="article"
                key={key}
                className={`home-card home-card--${size} home-card--${key.toLowerCase()}`}
                delay={(i % 2) * 90}
                duration={900}
              >
                <div className="home-card-media" aria-hidden="true" style={{ '--glow-delay': `${-i * 2.3}s` } as React.CSSProperties} />
                <div className="home-card-body">
                  <h3>{t[`homeFeat${key}Head`]}</h3>
                  <p>{t[`homeFeat${key}Text`]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Se läget över hela er organisation: texten tonar in, laptopen glider
          in från höger. Vit bakgrund, så att laptopen inte ser urklippt ut. */}
      <section className="home-section">
        <div className="home-wrap home-split">
          <div>
            <Reveal as="h2" className="home-big" variant="fade" duration={900}>{t.homeAdminHeadline}</Reveal>
            <Reveal as="p" className="home-lede" variant="fade" duration={900} delay={140} style={{ marginTop: '24px' }}>
              {t.homeAdminBody}
            </Reveal>
          </div>
          <Reveal className="home-shot" variant="right" duration={1100} delay={120} role="img" aria-label={t.homeMockLabel}>
            {/* Laptopen, beskuren till sina egna pixlar, med Hem som HTML på
                skärmytan (uppmätt i bilden, se .home-screen och SCREEN_QUAD).
                Laptop och skärminnehåll glider in tillsammans. */}
            <div className="home-laptop">
              <Image
                src="/macci1.png"
                alt=""
                width={1536}
                height={1024}
                sizes="(max-width: 900px) 140vw, 66vw"
                className="home-laptop-img"
              />
              <LaptopScreen>
                <div className="home-ui" aria-hidden="true">
                  <h4>
                    {t.homeMockGreeting}
                    <span>{t.homeMockQuestion}</span>
                  </h4>
                  <div className="home-ui-cards">
                    <div className="home-ui-c home-ui-c1">{t.homeMockCard1}<strong>50</strong></div>
                    <div className="home-ui-c home-ui-c2">{t.homeMockCard2}<strong>79</strong></div>
                    <div className="home-ui-c home-ui-c3">{t.homeMockCard3}<strong>+32</strong></div>
                  </div>
                  <div className="home-ui-ask">
                    {t.homeMockAsk}
                    {/* Samma uppåtpil som skickaknappen i plattformens chattfält
                        (app/dashboard/layout.tsx), vit på svart rund knapp. */}
                    <span className="home-ui-send">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 10V2M6 2L2.5 5.5M6 2L9.5 5.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </LaptopScreen>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. Frågekanaler: tre kanaler i rad, enkla linjeikoner */}
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

      {/* 7. Forskning: bilden glider in från vänster, texten tonar in. Full
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

      {/* 8. Integritet: raderna tonar in en i taget */}
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

      {/* 9. Avslutande uppmaning */}
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
