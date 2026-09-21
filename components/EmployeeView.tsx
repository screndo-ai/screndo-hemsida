'use client'

import { useLanguage } from '@/lib/LanguageContext'
import Reveal from '@/components/Reveal'

const SCALE_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const SELECTED_VALUE = 4

export default function EmployeeView() {
  const { t } = useLanguage()

  return (
    <section className="employee-view-section" style={{ background: '#fff', padding: '80px 0 0' }}>
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
            {/* Svarssidan (/svar): återger plattformens faktiska svarsformulär
                istället för en påhittad SMS-konversation. Innehållet
                (företagsnamn, fråga, 1–10-skala, anonymitetsrad) centreras
                som grupp i utrymmet ovanför logotypen — både horisontellt
                (symmetrisk sidopadding) och vertikalt (flex:1 + center på
                den egna wrappern). Screndos logotyp (samma fil som
                navbaren) står för sig, centrerad och fast längst ner. */}
            <div style={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Reveal variant="up" delay={0}>
                <div style={{ fontSize: '0.85em', color: '#9A9A9A', textAlign: 'left' }}>
                  {t.svarCompanyName}
                </div>
              </Reveal>

              <Reveal variant="up" delay={100} style={{ marginTop: '1.6em' }}>
                <div style={{ fontSize: '1.15em', fontWeight: 600, color: '#0A0A0A', textAlign: 'left', lineHeight: 1.35 }}>
                  {t.svarQuestion}
                </div>
              </Reveal>

              <Reveal variant="up" delay={200} style={{ marginTop: '2em' }}>
                <div style={{ display: 'flex', gap: '0.22em' }}>
                  {SCALE_VALUES.map((n) => (
                    <div
                      key={n}
                      style={{
                        flex: 1,
                        aspectRatio: '1 / 1',
                        boxSizing: 'border-box',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8em',
                        fontWeight: 600,
                        color: '#0A0A0A',
                        borderRadius: '0.35em',
                        border: n === SELECTED_VALUE ? '1.5px solid #0A0A0A' : '1px solid #E4E3DF',
                      }}
                    >
                      {n}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.6em', fontSize: '0.65em', color: '#9A9A9A' }}>
                  <span>{t.svarNeverLabel}</span>
                  <span>{t.svarAlwaysLabel}</span>
                </div>
              </Reveal>

              {/* Ett lågt svar (4) följt av en konkret, ifylld fritextförklaring
                  — visar att formuläret fångar upp något som faktiskt kräver
                  eftertanke från chefen, inte bara en siffra. */}
              <Reveal variant="up" delay={300} style={{ marginTop: '1.2em' }}>
                <div style={{
                  fontSize: '0.78em',
                  color: '#3D3D3D',
                  lineHeight: 1.5,
                  textAlign: 'left',
                  background: '#F8F7F4',
                  borderRadius: '0.5em',
                  padding: '0.65em 0.8em',
                }}>
                  {t.svarFollowUpAnswer}
                </div>
              </Reveal>

              <Reveal variant="up" delay={400} style={{ marginTop: '1.2em' }}>
                <p style={{ fontSize: '0.72em', color: '#B0B0B0', lineHeight: 1.5, textAlign: 'left', margin: 0 }}>
                  {t.svarDisclaimer}
                </p>
              </Reveal>
            </div>

            <Reveal variant="up" delay={500} style={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
              <img src="/logo2.png" alt="Screndo" style={{ height: '2.3em', width: 'auto', display: 'block' }} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
