'use client'

import { useLanguage } from '@/lib/LanguageContext'
import AutoSection from '@/components/AutoSection'
import EmployeeView from '@/components/EmployeeView'
import Reveal from '@/components/Reveal'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <>
      <section
        className="hero-section"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          paddingTop: 0,
          paddingBottom: '64px',
          paddingLeft: '24px',
          paddingRight: '24px',
          background: '#FAFAF9',
        }}
      >
        {/* Rubriken står i en egen "slot" med fast höjd (se .hero-h1-slot i
            globals.css) och centreras vertikalt i den, så avståndet ovanför
            och under rubriken blir lika stort utan att underrubriken under
            flyttar sig. De två delarna ligger i varsin white-space:nowrap-
            span: de får plats på en rad tillsammans från och med 1024px
            (fontstorleken är beräknad för det), och när de inte får plats
            bryter det mellan spannen — aldrig mitt i "på autopilot". */}
        <div className="hero-h1-slot">
          <h1 className="hero-h1" style={{ maxWidth: '1220px', width: '100%' }}>
            <span style={{ whiteSpace: 'nowrap' }}>{t.headline1}</span>{' '}
            <span style={{ whiteSpace: 'nowrap' }}>{t.headline2}</span>
          </h1>
        </div>

        <div style={{ maxWidth: '860px', width: '100%' }}>
          <p
            className="hero-subline"
            style={{
              color: '#3D3D3D',
              fontSize: '15px',
              fontWeight: 300,
              margin: '0 auto 40px',
              lineHeight: 1.6,
              maxWidth: '600px',
            }}
          >
            {t.subline}
          </p>

          <div className="hero-buttons">
            <a
              href="/book-intro"
              className="hero-btn-primary"
              style={{
                background: '#2563EB',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 600,
                borderRadius: '100px',
                padding: '14px 28px',
                display: 'inline-block',
              }}
            >
              {t.bookIntro}
            </a>
            <a
              href="#video-demo"
              className="hero-btn-secondary"
              style={{
                background: '#fff',
                color: '#000',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 500,
                borderRadius: '100px',
                padding: '14px 28px',
                border: '1.5px solid #000',
                display: 'inline-block',
              }}
            >
              {t.seeHow}
            </a>
          </div>
        </div>
      </section>

      <div style={{ width: '100%', lineHeight: 0 }}>
        <img
          src="/screndohero1.jpg"
          alt=""
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
      </div>

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
            <h2 style={{
              fontSize: 'clamp(28px, 4.5vw, 48px)',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              lineHeight: 1.05,
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

              <Reveal variant="up" delay={200}>
                <p style={{ fontSize: '15px', fontWeight: 400, lineHeight: 1.75, color: '#3D3D3D', maxWidth: '460px', margin: 0 }}>
                  {t.whyMattersPara3}
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
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 52px)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
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
            margin: '0 auto 36px',
            maxWidth: '620px',
          }}>
            {t.aiNativeSubline}
          </p>
        </Reveal>
        <Reveal variant="up" delay={150} style={{ display: 'inline-block' }}>
          <a
            href="#video-demo"
            className="hero-btn-primary"
            style={{
              background: '#2563EB',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 600,
              borderRadius: '100px',
              padding: '14px 28px',
              display: 'inline-block',
            }}
          >
            {t.watchDemo}
          </a>
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
            <h2 style={{
              fontSize: 'clamp(22px, 3.5vw, 42px)',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              lineHeight: 1.05,
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
