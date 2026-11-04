'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import { heatmapAreas, heatmapDepartments } from '@/lib/homeHeatmap'
import Reveal from '@/components/Reveal'

// Startsidan under heron, enligt skissen Screndo_hemsida_skiss.html.
// Mått, färger och avstånd ligger i globals.css under "Startsidan under
// heron" (klasserna home-*). Texterna ligger i LanguageContext (home*).
// Scrollanimationerna går via Reveal (en gång per element, när det kommer
// in i bild); rubriken först, brödtexten strax efter.

const STAT_SOURCES = {
  recognition:
    'https://www.businesswire.com/news/home/20240918942631/en/New-Workhuman-and-Gallup-Research-Finds-Recognition-in-the-Workplace-Could-Prevent-45-of-Voluntary-Turnover',
  silence: 'https://explore.psychsafety.com/n/milliken-morrison-hewlin-2003/',
}

// Ljusare ruta = högre värde. Skalan spänner över exempeldatans hela
// omfång (inte en fast 45–85 som i skissen), så skillnaden mellan ljusa
// och mörka rutor blir tydligare. Bara skissens ljusblå mot den mörkblå
// bakgrunden, inga andra kulörer.
const allValues = heatmapDepartments.flatMap((d) => d.values)
const minValue = Math.min(...allValues)
const maxValue = Math.max(...allValues)
const cellAlpha = (v: number) => 0.1 + ((v - minValue) / (maxValue - minValue)) * 0.9
const sky = (alpha: number) => `rgba(185, 209, 236, ${Math.min(1, alpha).toFixed(2)})`

// Vågen genom rutnätet: nedersta raden först, sedan rad för rad uppåt,
// med en liten förskjutning per kolumn. Varje ruta passerar en något
// ljusare nyans och landar i sin slutliga färg. Hela vågen ~1,5 s.
const WAVE_ROW_MS = 150
const WAVE_COL_MS = 25

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

export default function HomeSections() {
  const { t, lang } = useLanguage()

  const facts = [
    [t.homeTrust1Title, t.homeTrust1Text],
    [t.homeTrust2Title, t.homeTrust2Text],
    [t.homeTrust3Title, t.homeTrust3Text],
    [t.homeTrust4Title, t.homeTrust4Text],
  ]
  const rows = heatmapDepartments.length

  return (
    <div className="home">
      {/* Utan JavaScript ska allt synas direkt. */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              '[data-reveal]{opacity:1!important;transform:none!important}.home-heat-x{animation:none!important;background-color:var(--heat-final)!important}',
          }}
        />
      </noscript>

      {/* 1. Viktig feedback går förlorad: rubrik och text i vänster spalt,
          kvadratisk bild till höger, linjerade upptill */}
      <section className="home-section home-statement-section">
        <div className="home-wrap home-statement">
          <div>
            <Reveal as="h2" className="home-big">{t.homeLossHeadline}</Reveal>
            <Reveal as="p" className="home-lede" delay={140}>{t.homeLossPara1}</Reveal>
            <Reveal as="p" className="home-lede" delay={220}>{t.homeLossPara2}</Reveal>
          </div>
          <div className="home-statement-photo">
            <Image
              src="/brandim1.jpg"
              alt={t.homeLossImageAlt}
              fill
              sizes="(max-width: 900px) calc(100vw - 2 * clamp(16px, 5vw, 72px)), 40vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* 2. Rekrytering är dyrt */}
      <section className="home-section home-cost" style={{ background: 'var(--home-mist)' }}>
        <div className="home-wrap">
          <Reveal as="h2" className="home-big">
            {t.homeCostHeadline1}
            <br />
            <span>{t.homeCostHeadline2}</span>
          </Reveal>
          <div className="home-stats">
            {[
              { value: t.homeStat1Value, text: t.homeStat1Text, source: t.homeStat1Source, href: STAT_SOURCES.recognition },
              { value: t.homeStat2Value, text: t.homeStat2Text, source: t.homeStat2Source, href: STAT_SOURCES.silence },
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

      {/* 3. Mindre administration: texten tonar in, laptopen glider in från höger.
          Vit bakgrund, så att laptopen inte ser urklippt ut. */}
      <section className="home-section">
        <div className="home-wrap home-split">
          <div>
            <Reveal as="h2" className="home-big" variant="fade" duration={900}>{t.homeAdminHeadline}</Reveal>
            <Reveal as="p" className="home-lede" variant="fade" duration={900} delay={140} style={{ marginTop: '24px' }}>
              {t.homeAdminBody}
            </Reveal>
          </div>
          <Reveal className="home-shot" variant="right" duration={1100} delay={120} role="img" aria-label={t.homeMockLabel}>
            {/* Laptopen, beskuren till sina egna pixlar, med Hem inlagt på
                skärmytan (positionen uppmätt i bilden, se .home-screen). */}
            <div className="home-laptop">
              <Image
                src="/laptop_realistic.jpg"
                alt=""
                width={8000}
                height={8000}
                sizes="(max-width: 900px) 110vw, 52vw"
                className="home-laptop-img"
              />
              <div className="home-screen">
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
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. Läget över hela organisationen: en våg av nyanser genom rutnätet */}
      <section className="home-section">
        <div className="home-wrap">
          <Reveal as="h2" className="home-big" style={{ maxWidth: '820px' }}>{t.homeMapHeadline}</Reveal>
          <Reveal className="home-map" variant="none" threshold={0.5}>
            <strong className="home-map-title">{t.homeMapTitle}</strong>
            <div className="home-scroll-x" data-lenis-prevent-horizontal>
              <div className="home-heat" role="img" aria-label={t.homeMapLabel}>
                <div />
                {heatmapAreas[lang].map((area) => (
                  <div key={area} className="home-heat-h">{area}</div>
                ))}
                {heatmapDepartments.map((dep, row) => [
                  <div key={dep.sv} className="home-heat-d">{dep[lang]}</div>,
                  ...dep.values.map((v, col) => {
                    const alpha = cellAlpha(v)
                    return (
                      <div
                        key={`${dep.sv}-${col}`}
                        className="home-heat-x"
                        style={
                          {
                            '--heat-final': sky(alpha),
                            '--heat-peak': sky(alpha + 0.18),
                            '--heat-d': `${(rows - 1 - row) * WAVE_ROW_MS + col * WAVE_COL_MS}ms`,
                          } as React.CSSProperties
                        }
                      />
                    )
                  }),
                ])}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. Forskning: bilden glider in från vänster, texten tonar in */}
      <section className="home-section" style={{ paddingTop: 0 }}>
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

      {/* 6. Integritet: raderna tonar in en i taget */}
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

      {/* 7. Avslutande uppmaning */}
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
