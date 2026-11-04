'use client'

import { useLanguage } from '@/lib/LanguageContext'
import AutoSection from '@/components/AutoSection'
import HeroCarousel from '@/components/HeroCarousel'
import EmployeeView from '@/components/EmployeeView'
import Reveal from '@/components/Reveal'

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

      <AutoSection />

      <EmployeeView />

      {/* Svagt grå bakgrund från och med bildens underkant i EmployeeView
          (som saknar egen bottenpadding nu) genom hela why-matters-section,
          fram till ai-cta-section som är vit igen. Ingen marginal mellan
          delarna så färgen blir sammanhängande, ingen hård kant mot bilden. */}
      <div style={{ background: '#FAFAF9', paddingTop: '80px' }}>
      {/* Why it matters: rubrik + tre siffror, asymmetrisk komposition
          (samma bild-plus-text-mönster som founded-section nedan), inte
          ett symmetriskt kortrutnät. */}
      <section className="why-matters-section" style={{ padding: '120px 24px', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <Reveal variant="up">
            <h2 className="font-heading" style={{
              fontSize: 'clamp(28px, 4.5vw, 48px)',
              margin: '0 0 64px 0',
              color: '#0A0A0A',
              textAlign: 'left',
            }}>
              {t.whyMattersHeadline}
            </h2>
          </Reveal>

          <div className="why-matters-row" style={{ display: 'flex', gap: '6%', alignItems: 'stretch' }}>
            <Reveal variant="left" style={{ flex: '0 0 32%' }}>
              <img
                src="/grass-screndo.JPG"
                alt=""
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 25%',
                  borderRadius: '22px',
                }}
              />
            </Reveal>

            {/* Kortet: samma hörnradie och höjd som bilden bredvid (höjden
                styrs av kortets innehåll — bilden har ingen egen fast
                bildkvot längre utan sträcker sig (align-items: stretch) för
                att alltid matcha kortets höjd, så de två alltid bildar ett
                par oavsett textmängd. */}
            <div style={{
              flex: 1,
              minWidth: 0,
              background: '#FFFFFF',
              borderRadius: '22px',
              padding: '44px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <Reveal variant="up" style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '15px', fontWeight: 400, lineHeight: 1.75, color: '#3D3D3D', maxWidth: '460px', margin: 0 }}>
                  {t.whyMattersPara1}
                </p>
              </Reveal>

              <Reveal variant="up" delay={100} style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '15px', fontWeight: 400, lineHeight: 1.75, color: '#3D3D3D', maxWidth: '460px', margin: 0 }}>
                  {t.whyMattersPara2}
                </p>
              </Reveal>

              <Reveal variant="up" delay={200} style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '15px', fontWeight: 400, lineHeight: 1.75, color: '#3D3D3D', maxWidth: '460px', margin: 0 }}>
                  {t.whyMattersPara3}
                </p>
              </Reveal>

              <Reveal variant="up" delay={300}>
                <p style={{ fontSize: '15px', fontWeight: 400, lineHeight: 1.75, color: '#3D3D3D', maxWidth: '460px', margin: 0 }}>
                  {t.whyMattersPara4}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* AI-native CTA section */}
      <section className="ai-cta-section" style={{ background: '#fff', padding: '120px 24px 40px', textAlign: 'center' }}>
        <Reveal variant="up">
          <h2 className="font-heading" style={{
            fontSize: 'clamp(28px, 5vw, 52px)',
            margin: '0 auto 36px',
            maxWidth: '820px',
            color: '#0A0A0A',
          }}>
            {t.aiNativeHeadline}
          </h2>
        </Reveal>
        <Reveal variant="up" delay={80}>
          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            fontWeight: 400,
            lineHeight: 1.6,
            color: '#3D3D3D',
            margin: '0 auto 16px',
            maxWidth: '620px',
          }}>
            {t.aiNativeSubline}
          </p>
        </Reveal>
        <Reveal variant="up" delay={120}>
          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            fontWeight: 400,
            lineHeight: 1.6,
            color: '#3D3D3D',
            margin: '0 auto 36px',
            maxWidth: '620px',
          }}>
            {t.aiNativeExtra}
          </p>
        </Reveal>
      </section>

      {/* Standalone product screenshot: MacBook på böcker, foto i fullbredd
          utan marginaler, beskuret i underkant (uppmätt mot macscrendo43.jpg,
          3258x4093) så datorn dominerar och bara en liten bit bord syns kvar. */}
      <div className="product-shot-wrap" style={{ paddingTop: '40px' }}>
        <Reveal variant="scale" style={{ width: '100%', lineHeight: 0 }}>
          <img
            src="/macscrendo43.jpg"
            alt="Screndo"
            className="product-shot-img"
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              aspectRatio: '0.894',
              objectFit: 'cover',
              objectPosition: 'center top',
            }}
          />
        </Reveal>
      </div>

      {/* Founded section: text left, university image right */}
      <section className="founded-section" style={{ background: '#fff', padding: '120px 24px', overflow: 'hidden' }}>
        <div
          className="hero-two-col"
          style={{ display: 'flex', gap: '6%', alignItems: 'center', maxWidth: '1160px', margin: '0 auto' }}
        >
          <Reveal variant="left" style={{ flex: '0 0 42%' }}>
            <h2 className="font-heading" style={{
              fontSize: 'clamp(22px, 3.5vw, 42px)',
              margin: '0 0 20px 0',
              color: '#0A0A0A',
              textAlign: 'left',
            }}>
              {t.foundedHeadline}
            </h2>
            <p style={{
              fontSize: '15px',
              fontWeight: 400,
              lineHeight: 1.75,
              color: '#3D3D3D',
              margin: 0,
              textAlign: 'left',
            }}>
              {t.foundedBody}
            </p>
          </Reveal>

          <Reveal variant="right" style={{ flex: 1 }}>
            <img
              src="/hskolan.jpg"
              alt={t.foundedImageAlt}
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                borderRadius: '22px',
              }}
            />
          </Reveal>
        </div>
      </section>
    </>
  )
}
