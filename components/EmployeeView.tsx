'use client'

import { useLanguage } from '@/lib/LanguageContext'
import Reveal from '@/components/Reveal'

function IncomingBubble({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <Reveal variant="up" delay={delay} style={{ display: 'flex' }}>
      <div style={{
        alignSelf: 'flex-start',
        background: '#F8F7F4',
        color: '#0A0A0A',
        borderRadius: '1.3em',
        borderBottomLeftRadius: '0.3em',
        padding: '0.7em 0.9em',
        fontSize: '1em',
        lineHeight: 1.4,
        maxWidth: '88%',
      }}>
        {children}
      </div>
    </Reveal>
  )
}

function OutgoingBubble({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <Reveal variant="up" delay={delay} style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{
        background: '#2563EB',
        color: '#fff',
        borderRadius: '1.3em',
        borderBottomRightRadius: '0.3em',
        padding: '0.7em 0.9em',
        fontSize: '1em',
        lineHeight: 1.4,
        maxWidth: '75%',
      }}>
        {children}
      </div>
    </Reveal>
  )
}

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
              justifyContent: 'flex-start',
              padding: '4em 0.55em 0',
              fontSize: 'clamp(7.5px, 1.05vw, 12.5px)',
            }}
          >
            {/* Kontakt-header: Screndo-symbolen i en cirkel plus namnet,
                som en kontaktrubrik i en SMS-app. Inget påhittat
                avsändarnummer, bara vem det är. Egen fontSize här skalar
                upp logotyp och text tillsammans (samma inbördes proportion,
                2.6em/0.85em) utan att påverka bubblornas storlek. */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.3em',
              marginBottom: '0.2em',
              fontSize: '1.5em',
            }}>
              <img
                src="/nyfavicon.png"
                alt=""
                style={{ width: '2.6em', height: '2.6em', borderRadius: '50%', display: 'block' }}
              />
              <span style={{ fontSize: '0.85em', color: '#1A1A1A', fontWeight: 400 }}>
                {t.employeeViewContactName}
              </span>
            </div>

            {/* Bubblorna centreras vertikalt i utrymmet som blir kvar under
                headern, som stannar överst. En uppåtförskjutning (em-baserad,
                skalar med samma bas som resten av skärmytan) lagd ovanpå
                centreringen, ger en lätt övervikt uppåt. Mobilens värde sätts
                om i CSS (se @media 768px) eftersom fontstorleken där ligger
                fast på sitt minimum och en gemensam em-multiplikator annars
                ger en betydligt kraftigare förskjutning på skrivbord (där
                fontstorleken är större) än vad som var avsett. */}
            <div className="ev-msg-col" style={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '0.9em',
              transform: 'translateY(-4.5em)',
            }}>
              <IncomingBubble delay={0}>{t.employeeMsg1}</IncomingBubble>
              <OutgoingBubble delay={400}>{t.employeeMsg2}</OutgoingBubble>
              <IncomingBubble delay={800}>{t.employeeMsg3}</IncomingBubble>
              <OutgoingBubble delay={1200}>{t.employeeMsg4}</OutgoingBubble>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
