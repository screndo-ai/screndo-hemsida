'use client'

import { useRef, useState, useEffect } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

export default function AutoSection() {
  const { t } = useLanguage()
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState([false, false, false, false])
  const [struck, setStruck] = useState([false, false, false, false])
  const [finalVisible, setFinalVisible] = useState(false)
  const [cardVisible, setCardVisible] = useState(false)

  useEffect(() => {
    let started = false
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function startSequence() {
      if (reduced) {
        setShown([true, true, true, true])
        setStruck([true, true, true, true])
        setFinalVisible(true)
        return
      }

      const show = (i: number, ms: number) =>
        setTimeout(() => setShown(s => { const n = [...s]; n[i] = true; return n }), ms)
      const strike = (i: number, ms: number) =>
        setTimeout(() => setStruck(s => { const n = [...s]; n[i] = true; return n }), ms)

      show(0, 0)
      strike(0, 550)
      show(1, 950)
      strike(1, 1500)
      show(2, 1900)
      strike(2, 2450)
      show(3, 2850)
      strike(3, 3400)
      setTimeout(() => setFinalVisible(true), 3900)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true
          observer.disconnect()

          if (reduced) {
            setCardVisible(true)
            setTimeout(startSequence, 300)
            return
          }

          setCardVisible(true)
          setTimeout(startSequence, 900)
        }
      },
      { threshold: 0.25 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const items = [t.autoItem1, t.autoItem2, t.autoItem3, t.autoItem4]

  return (
    <>
      <style>{`
        @keyframes auto-shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .auto-shimmer-text {
          background: linear-gradient(90deg, #1a1a1a 25%, #a0a0a0 50%, #1a1a1a 75%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: auto-shimmer 2.5s linear infinite;
        }
      `}</style>

      <section
        ref={ref}
        className="auto-section"
        style={{ background: '#fff', paddingTop: '150px', overflow: 'hidden' }}
      >
        <div
          className="hero-two-col"
          style={{ display: 'flex', gap: '6%', alignItems: 'center' }}
        >
          {/* Left: heading + body */}
          <div style={{ flex: '0 0 44%', paddingLeft: '6%' }}>
            <h2 className="font-heading" style={{
              fontSize: 'clamp(20px, 3.5vw, 42px)',
              margin: '0 0 20px 0',
              color: '#0A0A0A',
            }}>
              {t.autoHeadline}
            </h2>
            <p style={{
              fontSize: '15px',
              fontWeight: 400,
              lineHeight: 1.75,
              color: '#3D3D3D',
              margin: 0,
              maxWidth: '400px',
            }}>
              {t.autoParagraph}
            </p>
          </div>

          {/* Right: animated checklist card */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              width: '100%',
              boxSizing: 'border-box',
              background: '#ffffff',
              border: '1px solid #E4E3DF',
              boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
              borderRadius: '16px',
              padding: '52px 48px',
              opacity: cardVisible ? 1 : 0,
              transform: cardVisible ? 'translateX(0)' : 'translateX(100px)',
              transition: 'opacity 0.85s ease-out, transform 0.85s ease-out',
            }}>
              {items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    marginBottom: '26px',
                    opacity: shown[i] ? 1 : 0,
                    transform: shown[i] ? 'translateY(0px)' : 'translateY(10px)',
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                  }}
                >
                  {/* Circle: empty → filled with checkmark when struck */}
                  <span style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: struck[i] ? '#0A0A0A' : 'transparent',
                    border: `2px solid ${struck[i] ? '#0A0A0A' : '#D1D1D1'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'background 0.2s ease, border-color 0.2s ease',
                  }}>
                    {struck[i] && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <polyline
                          points="2,6 5,9 10,3"
                          stroke="#fff"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span style={{
                    position: 'relative',
                    display: 'inline-block',
                    fontSize: '15px',
                    color: struck[i] ? '#B0B0B0' : '#0A0A0A',
                    transition: 'color 0.5s ease',
                  }}>
                    {item}
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      height: '1px',
                      width: struck[i] ? '100%' : '0%',
                      background: '#B0B0B0',
                      transition: 'width 0.5s ease',
                    }} />
                  </span>
                </div>
              ))}

              {/* Final row — not struck, shimmer text */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                opacity: finalVisible ? 1 : 0,
                transform: finalVisible ? 'translateY(0px)' : 'translateY(10px)',
                transition: 'opacity 0.35s ease, transform 0.35s ease',
              }}>
                <span style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#2563EB',
                  border: '2px solid #2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <polyline
                      points="2,6 5,9 10,3"
                      stroke="#fff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span
                  className={finalVisible ? 'auto-shimmer-text' : undefined}
                  style={{ fontSize: '18px', fontWeight: 600 }}
                >
                  {t.autoFinal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
