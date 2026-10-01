'use client'

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { useLanguage } from "@/lib/LanguageContext";

// Filmen visar det gamla SMS-svarsflödet, inte hur appen faktiskt
// fungerar idag. Sektionen döljs tills det finns en ny film, men koden
// står kvar oförändrad så den bara är att slå på igen (SHOW_DEMO_VIDEO
// = true) den dagen. Inget på sidan länkar till #video-demo längre.
const SHOW_DEMO_VIDEO = false

export default function Home() {
  const { t } = useLanguage()
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <Navbar />
      <Hero />

      {/* Video section */}
      {SHOW_DEMO_VIDEO && <section
        id="video-demo"
        style={{
          background: '#fff',
          padding: '64px 24px 120px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(16px, 3.5vw, 40px)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.05,
            color: '#0A0A0A',
            margin: '0 0 48px 0',
          }}>
            {t.videoHeadline}
          </h2>
          <div
            style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              borderRadius: '22px',
              overflow: 'hidden',
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/kpi51gp1KC4"
              title={t.videoHeadline}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          </div>
        </div>
      </section>}

      {/* Final CTA */}
      <section
        className="final-cta-section"
        style={{
          background: '#fff',
          padding: '64px 24px 120px',
          textAlign: 'center',
        }}
      >
        <Reveal variant="up">
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 40px)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
            margin: '0 auto 12px',
            maxWidth: '720px',
            color: '#0A0A0A',
          }}>
            {t.finalCtaHeadline}
          </h2>
          <p style={{
            fontSize: '14px',
            fontWeight: 400,
            color: '#6B6B6B',
            lineHeight: 1.5,
            margin: '0 auto 32px',
            maxWidth: '480px',
          }}>
            {t.finalCtaSubline}
          </p>
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
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
