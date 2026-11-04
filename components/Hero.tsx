'use client'

import { useLanguage } from '@/lib/LanguageContext'
import HeroCarousel from '@/components/HeroCarousel'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <>
      {/* Hero: kort rubrik i Inter Tight (bara här, se .hero-h1 i
          globals.css), en rad undertext, en knapp, och under det den
          ändlösa bildraden som går ut till sidans vänsterkant. */}
      <section className="hero-section">
        <div className="hero-text">
          <h1 className="hero-h1">{t.headline1}</h1>
          <p className="hero-subline">{t.subline}</p>
          <a href="/book-intro" className="hero-cta">
            {t.bookIntro}
          </a>
        </div>

        <HeroCarousel />
      </section>
    </>
  )
}
