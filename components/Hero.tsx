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
          paddingTop: '96px',
          paddingBottom: '64px',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
      >
        {/* Rubriken får en egen, bredare container så den ryms på en rad
            på skrivbordsbredd (naturlig bredd ~1186px vid 58px). Underrubrik
            och knappar behåller sin smalare 860px-kolumn för läsbarheten. */}
        <h1 className="hero-h1" style={{ maxWidth: '1220px', width: '100%' }}>
          {t.headline}
        </h1>

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

          <div className="why-matters-row" style={{ display: 'flex', gap: '6%', alignItems: 'flex-start' }}>
            <Reveal variant="left" style={{ flex: '0 0 32%' }}>
              <img
                src="/grass-screndo.JPG"
                alt=""
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '4 / 5',
                  objectFit: 'cover',
                  objectPosition: 'center 25%',
                  borderRadius: '22px',
                }}
              />
            </Reveal>

            <div style={{ flex: 1, minWidth: 0 }}>
              <Reveal variant="up" style={{ marginBottom: '56px' }}>
                <div style={{
                  fontSize: 'clamp(52px, 7vw, 88px)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  color: '#0A0A0A',
                  marginBottom: '14px',
                }}>
                  {t.whyMattersStat1Value}
                </div>
                <p style={{ fontSize: '16px', color: '#3D3D3D', lineHeight: 1.6, maxWidth: '380px', margin: 0 }}>
                  {t.whyMattersStat1Label}
                </p>
              </Reveal>

              <Reveal variant="up" delay={100} className="why-matters-stat" style={{ marginBottom: '56px', marginLeft: '10%' }}>
                <div style={{
                  fontSize: 'clamp(44px, 5.6vw, 72px)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  color: '#0A0A0A',
                  marginBottom: '14px',
                }}>
                  {t.whyMattersStat2Value}
                </div>
                <p style={{ fontSize: '16px', color: '#3D3D3D', lineHeight: 1.6, maxWidth: '380px', margin: 0 }}>
                  {t.whyMattersStat2Label}
                </p>
              </Reveal>

              <Reveal variant="up" delay={200} className="why-matters-stat" style={{ marginLeft: '4%' }}>
                <div style={{
                  fontSize: 'clamp(40px, 5vw, 64px)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  color: '#0A0A0A',
                  marginBottom: '14px',
                }}>
                  {t.whyMattersStat3Value}
                </div>
                <p style={{ fontSize: '16px', color: '#3D3D3D', lineHeight: 1.6, maxWidth: '380px', margin: 0 }}>
                  {t.whyMattersStat3Label}
                </p>
              </Reveal>

              <Reveal variant="up" delay={300} style={{ marginTop: '40px' }}>
                <p style={{ fontSize: '17px', color: '#3D3D3D', fontWeight: 400, lineHeight: 1.65, maxWidth: '460px', margin: 0 }}>
                  {t.whyMattersBridge}
                </p>
              </Reveal>

              <p style={{ fontSize: '13px', color: '#6B6B6B', marginTop: '24px', marginBottom: 0 }}>
                {t.whyMattersSource}
              </p>
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

      {/* Standalone product screenshot */}
      <div className="product-shot-wrap" style={{ display: 'flex', justifyContent: 'center', padding: '24px 24px 80px' }}>
        <Reveal variant="scale" style={{ width: '100%', maxWidth: '1500px' }}>
          <img
            src="/screndomacv3.png"
            alt="Screndo"
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
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

      {/* Brand photo section — full-bleed, static */}
      <div style={{ width: '100%', lineHeight: 0 }}>
        <img
          src="/macscrendo2.jpg"
          alt="Screndo"
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
      </div>
    </>
  )
}
