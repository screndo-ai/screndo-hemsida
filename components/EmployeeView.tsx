'use client'

import { useLanguage } from '@/lib/LanguageContext'
import Reveal from '@/components/Reveal'
import SvarMockup from '@/components/SvarMockup'

export default function EmployeeView() {
  const { t } = useLanguage()

  return (
    <section id="employee-view" className="employee-view-section" style={{ background: '#fff', padding: '80px 0 0' }}>
      <div className="ev-wrap" style={{ position: 'relative', maxWidth: '1800px', margin: '0 auto' }}>
        {/* Text: överlagrad på bildens tomma vänstra del på skrivbord,
            normalt flöde ovanför bilden på mobil (se .ev-text-overlay). */}
        <div className="ev-text-overlay">
          <h2 style={{
            fontSize: 'clamp(22px, 3.5vw, 42px)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
            margin: '0 0 24px 0',
            color: '#0A0A0A',
            textAlign: 'left',
          }}>
            {t.employeeViewHeadline}
          </h2>
          <p style={{
            fontSize: '15px',
            fontWeight: 400,
            lineHeight: 1.75,
            color: '#3D3D3D',
            margin: 0,
            maxWidth: '420px',
            textAlign: 'left',
          }}>
            {t.employeeViewBody}
          </p>
        </div>

        {/* Bilden: hand + iPhone med tom skärm. Bubblornas position (i procent
            av bildens egna box) sätts i CSS (.ev-bubbles-overlay), uppmätta mot
            foto3iphone.png (1536x1024): skärmytan är x 56.1–76.2%, y 11.5–78.1%
            i bildens fulla komposition. På mobil beskärs bilden (object-fit:
            cover, höger-ankrad) för att ge skärmytan fler faktiska pixlar att
            jobba med, och överlagringens procentvärden byts då ut i CSS:n. */}
        <div className="ev-image-container" style={{ position: 'relative', width: '100%', lineHeight: 0 }}>
          <img
            src="/foto3iphone.png"
            alt=""
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />

          <div
            className="ev-bubbles-overlay"
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0 0.7em 1.4em',
              fontSize: 'clamp(7.5px, 1.05vw, 12.5px)',
            }}
          >
            {/* Svarssidan (/svar): speglar plattformens faktiska svarsflöde
                (dashboard-v2, app/svar/[token]) som en lugn, loopande
                sekvens istället för en enda stillbild — se SvarMockup.tsx
                för hela sekvensen och källan till varje mått/färg/text.
                Centreras som grupp i utrymmet ovanför logotypen (flex:1 +
                center på wrappern). Screndos logotyp (samma fil som
                navbaren) står för sig, centrerad och fast längst ner. */}
            <div style={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <SvarMockup />
            </div>

            <Reveal variant="up" delay={400} style={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
              <img src="/logo2.png" alt="Screndo" style={{ height: '2.3em', width: 'auto', display: 'block' }} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
