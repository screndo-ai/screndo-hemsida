'use client'

import Image from 'next/image'
import { useLanguage } from '@/lib/LanguageContext'
import { heatmapAreas, heatmapDepartments } from '@/lib/homeHeatmap'

// Startsidan under heron, enligt skissen Screndo_hemsida_skiss.html.
// Mått, färger och avstånd ligger i globals.css under "Startsidan under
// heron" (klasserna home-*). Texterna ligger i LanguageContext (home*).

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
const cellColor = (v: number) => {
  const t = (v - minValue) / (maxValue - minValue)
  return `rgba(185, 209, 236, ${(0.1 + t * 0.9).toFixed(2)})`
}

export default function HomeSections() {
  const { t, lang } = useLanguage()

  const facts = [
    [t.homeTrust1Title, t.homeTrust1Text],
    [t.homeTrust2Title, t.homeTrust2Text],
    [t.homeTrust3Title, t.homeTrust3Text],
    [t.homeTrust4Title, t.homeTrust4Text],
  ]

  return (
    <div className="home">
      {/* 1. Viktig feedback går förlorad */}
      <section className="home-section home-statement-section">
        <div className="home-wrap home-statement">
          <h2 className="home-big">{t.homeLossHeadline}</h2>
          <div>
            <p className="home-lede">{t.homeLossPara1}</p>
            <p className="home-lede">{t.homeLossPara2}</p>
          </div>
        </div>
      </section>

      {/* 2. Rekrytering är dyrt */}
      <section className="home-section home-cost" style={{ paddingTop: 0 }}>
        <div className="home-wrap">
          <h2 className="home-big">
            {t.homeCostHeadline1}
            <br />
            <span>{t.homeCostHeadline2}</span>
          </h2>
          <div className="home-stats">
            <div className="home-stat">
              <div className="home-stat-n">{t.homeStat1Value}</div>
              <p>{t.homeStat1Text}</p>
              <a className="home-source" href={STAT_SOURCES.recognition} target="_blank" rel="noopener noreferrer">
                {t.homeStat1Source}
              </a>
            </div>
            <div className="home-stat">
              <div className="home-stat-n">{t.homeStat2Value}</div>
              <p>{t.homeStat2Text}</p>
              <a className="home-source" href={STAT_SOURCES.silence} target="_blank" rel="noopener noreferrer">
                {t.homeStat2Source}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mindre administration */}
      <section className="home-section" style={{ background: 'var(--home-mist)' }}>
        <div className="home-wrap home-split">
          <div>
            <h2 className="home-big">{t.homeAdminHeadline}</h2>
            <p className="home-lede" style={{ marginTop: '24px' }}>{t.homeAdminBody}</p>
          </div>
          <div className="home-shot" role="img" aria-label={t.homeMockLabel}>
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
      </section>

      {/* 4. Läget över hela organisationen */}
      <section className="home-section">
        <div className="home-wrap">
          <h2 className="home-big" style={{ maxWidth: '820px' }}>{t.homeMapHeadline}</h2>
          <div className="home-map">
            <strong className="home-map-title">{t.homeMapTitle}</strong>
            <div className="home-scroll-x" data-lenis-prevent-horizontal>
              <div className="home-heat" role="img" aria-label={t.homeMapLabel}>
                <div />
                {heatmapAreas[lang].map((area) => (
                  <div key={area} className="home-heat-h">{area}</div>
                ))}
                {heatmapDepartments.map((dep) => [
                  <div key={dep.sv} className="home-heat-d">{dep[lang]}</div>,
                  ...dep.values.map((v, i) => (
                    <div key={`${dep.sv}-${i}`} className="home-heat-x" style={{ background: cellColor(v) }} />
                  )),
                ])}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Forskning */}
      <section className="home-section" style={{ paddingTop: 0 }}>
        <div className="home-wrap home-research">
          <div className="home-photo">
            <Image
              src="/hskolan.jpg"
              alt={t.homeResearchImageAlt}
              fill
              sizes="(max-width: 900px) calc(100vw - 2 * clamp(16px, 5vw, 72px)), min(665px, 46vw)"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div>
            <h2 className="home-big">{t.homeResearchHeadline}</h2>
            <p className="home-lede" style={{ marginTop: '24px' }}>{t.homeResearchBody}</p>
          </div>
        </div>
      </section>

      {/* 6. Integritet */}
      <section className="home-section home-trust">
        <div className="home-wrap">
          <h2 className="home-big" style={{ maxWidth: '900px' }}>{t.homeTrustHeadline}</h2>
          <ul className="home-facts">
            {facts.map(([title, text]) => (
              <li key={title}>
                <b>{title}</b>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. Avslutande uppmaning */}
      <section className="home-section home-cta" style={{ paddingTop: 0 }}>
        <div className="home-wrap">
          <h2 className="home-big">{t.homeCtaHeadline}</h2>
          <p className="home-lede">{t.homeCtaBody}</p>
          <a href="/book-intro" className="hero-cta">
            {t.bookIntro}
          </a>
        </div>
      </section>
    </div>
  )
}
