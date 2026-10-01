'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

/**
 * Speglar plattformens faktiska svarssida (dashboard-v2, app/svar/[token]),
 * som en lugn, loopande sekvens istället för en enda stillbild. Alla mått,
 * färger och texter är lästa ur den sidans kod (page.tsx + globals.css,
 * .svar-*-klasserna), inte gissade.
 *
 * Skalan är EN enhet, inte per element: allt nedan byggs i riktiga pixlar,
 * exakt som på /svar vid en telefonbredd på 390px (.svar-sida har
 * padding: 48px 24px 104px, så innehållet får 390 - 24*2 = 342px att
 * breda ut sig på — samma bredd kluringsfrågan bryts, eller inte bryts,
 * mot på riktigt). Hela blocket skalas sedan med transform: scale så det
 * passar telefonrutan, oavsett hur bred den råkar vara där den visas.
 *
 * Inget i sekvensen är klickbart — hela mockupen är en avbild, inte ett
 * formulär. aria-hidden på rotnivå, inga <button>/<textarea>-element.
 */

const SKALA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const VALT_TAL = 7

// Samma telefonbredd och sidpadding som .svar-sida (globals.css) ger på en
// riktig telefon. Allt härunder är byggt i dessa pixlar, inte uppskalat.
const BASE_WIDTH = 390
const SIDPADDING = 24

// Färger, 1:1 från .svar-sida i dashboard-v2/app/globals.css.
const C = {
  paper: '#FFFFFF',
  shell: '#FBFBFA',
  line: '#EDECEA',
  ink: '#141414',
  rubrik: '#0A0A0A',
  body: '#3A3A38',
  muted: '#8B8A87',
  faint: '#B5B4B0',
  bla: '#2563EB',
  blaTryckt: '#1D4ED8',
  blaInaktiv: '#A8C1F6',
}

// Tider i ms. Verklig sida: TONING 180, PAUS 260 (rorelse.ts) — här något
// längre för en lugnare, passivt itittad loop, samma återhållsamma känsla.
const FADE = 260
const START_HOLD = 2500
const PRESS = 150
const FRAGA_HOLD_FORE_FYLLNING = 1150
const FRAGA_HOLD_EFTER_FYLLNING = 500
const FOLJD_HOLD_FORE_SKRIVNING = 550
const FOLJD_HOLD_EFTER_SKRIVNING = 500
const TACK_HOLD = 4000

type Fas = 'start' | 'fraga' | 'foljdfraga' | 'tack'

function sleep(
  ms: number,
  synligRef: React.RefObject<boolean>,
  avbrutenRef: React.RefObject<boolean>,
  timers: React.RefObject<ReturnType<typeof setTimeout>[]>
): Promise<void> {
  return new Promise((resolve) => {
    let kvar = ms
    const steg = () => {
      if (avbrutenRef.current) return
      if (!synligRef.current) {
        // Pausad: tiden räknas inte ner medan telefonen inte syns.
        timers.current.push(setTimeout(steg, 150))
        return
      }
      const del = Math.min(kvar, 150)
      kvar -= del
      if (kvar <= 0) {
        timers.current.push(setTimeout(resolve, del))
      } else {
        timers.current.push(setTimeout(steg, del))
      }
    }
    steg()
  })
}

function AnonymRad({ text }: { text: string }) {
  return (
    <p style={{
      alignSelf: 'stretch',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      gap: 6,
      marginTop: 16,
      fontSize: 12,
      lineHeight: 1.5,
      color: C.muted,
    }}>
      <svg
        width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
        style={{ flex: '0 0 auto', marginTop: 3 }}
      >
        <rect x="4" y="10.5" width="16" height="11" rx="2.5" />
        <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
      </svg>
      {text}
    </p>
  )
}

export default function SvarMockup() {
  const { t } = useLanguage()
  const tRef = useRef(t)
  tRef.current = t

  const [fas, setFas] = useState<Fas>('start')
  const [tonarUt, setTonarUt] = useState(false)
  const [valt, setValt] = useState<number | null>(null)
  const [typed, setTyped] = useState('')
  const [skriverNu, setSkriverNu] = useState(false)
  const [tryckt, setTryckt] = useState<'kor' | 'skicka' | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  const rotRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [contentHeight, setContentHeight] = useState(0)

  const synligRef = useRef(false)
  const avbrutenRef = useRef(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // Mäter tillgänglig bredd (stageRef) och innehållets egen, oskalade höjd
  // (innerRef — ResizeObserver rapporterar boxens layoutstorlek, opåverkad
  // av transform: scale). Skalan räknas ut som bredd/BASE_WIDTH, och stagets
  // höjd sätts till den skalade höjden, så resten av sidan får rätt utrymme
  // reserverat oavsett vilken fas som visas just nu.
  useEffect(() => {
    const stageEl = stageRef.current
    const innerEl = innerRef.current
    if (!stageEl || !innerEl) return
    const stageObserver = new ResizeObserver(() => setScale(stageEl.offsetWidth / BASE_WIDTH))
    const innerObserver = new ResizeObserver(() => setContentHeight(innerEl.offsetHeight))
    stageObserver.observe(stageEl)
    innerObserver.observe(innerEl)
    setScale(stageEl.offsetWidth / BASE_WIDTH)
    setContentHeight(innerEl.offsetHeight)
    return () => {
      stageObserver.disconnect()
      innerObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReducedMotion(reduced)
    if (reduced) return

    avbrutenRef.current = false

    const observer = new IntersectionObserver(
      ([entry]) => { synligRef.current = entry.isIntersecting },
      { threshold: 0.15 }
    )
    if (rotRef.current) observer.observe(rotRef.current)

    async function vanta(ms: number) {
      await sleep(ms, synligRef, avbrutenRef, timers)
    }

    async function skrivText(text: string) {
      let nu = ''
      for (let i = 0; i < text.length; i++) {
        if (avbrutenRef.current) return
        nu += text[i]
        setTyped(nu)
        const tecken = text[i]
        const bas = 18 + Math.random() * 24
        const extra = tecken === '.' || tecken === ',' ? 230 : 0
        await vanta(bas + extra)
      }
    }

    async function loop() {
      while (!avbrutenRef.current) {
        // ─── Startskärm ──────────────────────────────────────────────────
        setFas('start')
        setTonarUt(false)
        setValt(null)
        setTyped('')
        setSkriverNu(false)
        setTryckt(null)
        await vanta(START_HOLD)
        if (avbrutenRef.current) return
        setTryckt('kor')
        await vanta(PRESS)
        if (avbrutenRef.current) return
        setTryckt(null)
        setTonarUt(true)
        await vanta(FADE)
        if (avbrutenRef.current) return

        // ─── Frågan ──────────────────────────────────────────────────────
        setFas('fraga')
        setTonarUt(false)
        await vanta(FRAGA_HOLD_FORE_FYLLNING)
        if (avbrutenRef.current) return
        setValt(VALT_TAL)
        await vanta(FRAGA_HOLD_EFTER_FYLLNING)
        if (avbrutenRef.current) return
        setTonarUt(true)
        await vanta(FADE)
        if (avbrutenRef.current) return

        // ─── Följdfrågan ─────────────────────────────────────────────────
        setFas('foljdfraga')
        setTonarUt(false)
        setTyped('')
        await vanta(FOLJD_HOLD_FORE_SKRIVNING)
        if (avbrutenRef.current) return
        setSkriverNu(true)
        await skrivText(tRef.current.svarTypedText)
        setSkriverNu(false)
        if (avbrutenRef.current) return
        await vanta(FOLJD_HOLD_EFTER_SKRIVNING)
        if (avbrutenRef.current) return
        setTryckt('skicka')
        await vanta(PRESS)
        if (avbrutenRef.current) return
        setTryckt(null)
        setTonarUt(true)
        await vanta(FADE)
        if (avbrutenRef.current) return

        // ─── Tack ────────────────────────────────────────────────────────
        // Ligger kvar komplett (inget tomt mellanläge) och tonar sedan
        // direkt över i nästa varvs startskärm — samma enkla toning som
        // mellan alla andra skärmar, ingen extra paus på tom yta.
        setFas('tack')
        setTonarUt(false)
        await vanta(TACK_HOLD)
        if (avbrutenRef.current) return
        setTonarUt(true)
        await vanta(FADE)
        if (avbrutenRef.current) return
      }
    }

    loop()

    return () => {
      avbrutenRef.current = true
      observer.disconnect()
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  // Startas om vid språkbyte, så den uppskrivna texten alltid matchar valt
  // språk i stället för att vänta på nästa varv.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t.svarTypedText])

  const knappStil = (variant: 'kor' | 'skicka', aktiv: boolean): React.CSSProperties => ({
    alignSelf: 'stretch',
    marginTop: 24,
    padding: '15px 22px',
    border: 'none',
    borderRadius: 100,
    background: !aktiv ? C.blaInaktiv : tryckt === variant ? C.blaTryckt : C.bla,
    color: '#fff',
    fontSize: 15,
    fontFamily: 'inherit',
    transform: tryckt === variant ? 'scale(0.97)' : 'none',
    transition: 'background .15s ease, transform .12s ease',
  })

  return (
    <div
      ref={rotRef}
      aria-hidden="true"
      style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <style>{`@keyframes ev-svar-blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }`}</style>

      <div ref={stageRef} style={{ width: '100%', position: 'relative', height: contentHeight * scale || undefined }}>
        <div
          ref={innerRef}
          style={{
            width: BASE_WIDTH,
            boxSizing: 'border-box',
            padding: `0 ${SIDPADDING}px`,
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: 'top center',
            // Samma bas-typografi som body i dashboard-v2 (globals.css):
            // ärvs av alla barn som inte sätter egna värden, precis som på
            // riktiga sidan. letter-spacing räknas ut en gång mot 15px
            // (body:s fontSize) och ärvs sedan som ett fast pixelvärde —
            // räknas INTE om mot varje barns egen fontSize.
            lineHeight: 1.55,
            letterSpacing: '-0.075px',
          }}
        >
          <div style={{ fontSize: 13, letterSpacing: '.04em', color: C.muted, marginBottom: 26 }}>
            {t.svarCompanyName}
          </div>

          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            opacity: reducedMotion || !tonarUt ? 1 : 0,
            transition: reducedMotion ? 'none' : `opacity ${FADE}ms ease`,
          }}>
            {(reducedMotion || fas === 'start') && (
              <>
                <div style={{
                  width: '100%', boxSizing: 'border-box', padding: '20px 22px',
                  border: `1px solid ${C.line}`, borderRadius: 16, background: C.shell,
                }}>
                  <p style={{ fontSize: 11.5, letterSpacing: '.07em', textTransform: 'uppercase', color: C.muted, margin: '0 0 10px' }}>
                    {t.svarKluringLabel}
                  </p>
                  <p style={{ fontSize: 17, lineHeight: 1.45, color: C.ink, margin: 0 }}>
                    {t.svarKluringQuestion}
                  </p>
                  <p style={{ margin: '10px 0 0', fontSize: 13, color: C.muted }}>
                    {t.svarKluringFacitForst}
                  </p>
                </div>
                <button style={knappStil('kor', true)} disabled tabIndex={-1}>{t.svarKorKnapp}</button>
                <AnonymRad text={t.svarDisclaimer} />
              </>
            )}

            {!reducedMotion && fas === 'fraga' && (
              <>
                <h1 style={{ fontSize: 26, fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.3, color: C.rubrik, margin: '0 0 30px' }}>
                  {t.svarQuestion}
                </h1>
                <div style={{ display: 'flex', width: '100%', gap: 5 }}>
                  {SKALA.map((n) => (
                    <div
                      key={n}
                      style={{
                        flex: '1 1 0', minWidth: 0, aspectRatio: '1',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: n === valt ? `1px solid ${C.bla}` : `1px solid ${C.line}`,
                        borderRadius: 10,
                        background: n === valt ? C.bla : C.paper,
                        color: n === valt ? '#fff' : C.ink,
                        fontSize: 15,
                        lineHeight: 1,
                        transition: 'background .14s, border-color .14s, color .14s',
                      }}
                    >
                      {n}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 10, fontSize: 12, color: C.muted }}>
                  <span>{t.svarNeverLabel}</span>
                  <span>{t.svarAlwaysLabel}</span>
                </div>
                <AnonymRad text={t.svarDisclaimer} />
              </>
            )}

            {!reducedMotion && fas === 'foljdfraga' && (
              <>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 26, color: C.muted, fontSize: 14 }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
                    <path d="M19 12H5M11 6l-6 6 6 6" />
                  </svg>
                  {t.svarTillbaka}
                </div>
                <p style={{ fontSize: 13, color: C.muted, margin: '0 0 8px' }}>{t.svarDuValde}</p>
                <p style={{ fontSize: 22, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.35, color: C.rubrik, margin: '0 0 20px' }}>
                  {t.svarFoljdFraga}
                </p>
                <div style={{
                  width: '100%', height: 150, boxSizing: 'border-box', fontSize: 15, lineHeight: 1.6,
                  padding: '16px 18px', border: `1px solid ${C.line}`, borderRadius: 14,
                  background: C.paper, color: C.ink, overflow: 'hidden', textAlign: 'left',
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {typed.length > 0 ? typed : <span style={{ color: C.faint }}>{t.svarFaltPlaceholder}</span>}
                  {skriverNu && (
                    <span style={{
                      display: 'inline-block', width: 1.5, height: 15, marginLeft: 1,
                      background: C.ink, verticalAlign: 'text-bottom',
                      animation: 'ev-svar-blink 0.9s step-end infinite',
                    }} />
                  )}
                </div>
                <button style={knappStil('skicka', typed.length > 0)} disabled tabIndex={-1}>{t.svarSkicka}</button>
                <div style={{ alignSelf: 'center', margin: '14px auto 0', fontSize: 13, color: C.muted }}>
                  {t.svarHoppaOver}
                </div>
                <AnonymRad text={t.svarDisclaimer} />
              </>
            )}

            {!reducedMotion && fas === 'tack' && (
              <>
                <p style={{ fontSize: 26, fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.3, color: C.rubrik, margin: 0 }}>
                  {t.svarTack}
                </p>
                <p style={{ margin: '8px 0 30px', fontSize: 15, color: C.body }}>{t.svarTackUnder}</p>
                <div style={{
                  width: '100%', boxSizing: 'border-box', padding: '20px 22px',
                  border: `1px solid ${C.line}`, borderRadius: 16, background: C.shell,
                }}>
                  <p style={{ fontSize: 11.5, letterSpacing: '.07em', textTransform: 'uppercase', color: C.muted, margin: '0 0 10px' }}>
                    {t.svarKluringLabel}
                  </p>
                  <p style={{ fontSize: 17, lineHeight: 1.45, color: C.ink, margin: 0 }}>
                    {t.svarKluringQuestion}
                  </p>
                  <p style={{ margin: '10px 0 0', fontSize: 13, color: C.muted }}>
                    {t.svarKluringFacitSvar}
                  </p>
                </div>
                <p style={{ marginTop: 26, fontSize: 13, color: C.muted }}>
                  {t.svarProblemPrefix}<span style={{ color: C.bla }}>{t.svarProblemLank}</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
