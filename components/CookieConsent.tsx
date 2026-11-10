'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

function loadAnalytics() {
  if (typeof window === 'undefined') return
  const script = document.createElement('script')
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-DKZ8FQJKZ6'
  script.async = true
  document.head.appendChild(script)
  script.onload = () => {
    const w = window as Window & { dataLayer?: unknown[] }
    w.dataLayer = w.dataLayer || []
    function gtag(...args: unknown[]) { w.dataLayer!.push(args) }
    gtag('js', new Date())
    gtag('config', 'G-DKZ8FQJKZ6')
  }
}

// Samtycket sparas i localStorage och läses som en extern källa
// (useSyncExternalStore). På servern och i första renderingen visas ingen
// banner ("pending"); sedan visas den om inget val finns.
const CONSENT_KEY = 'cookie_consent'
const CONSENT_EVENT = 'cookie-consent-change'

function subscribeConsent(onChange: () => void) {
  window.addEventListener('storage', onChange)
  window.addEventListener(CONSENT_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(CONSENT_EVENT, onChange)
  }
}

function readConsent(): string {
  try {
    return localStorage.getItem(CONSENT_KEY) ?? 'none'
  } catch {
    return 'none'
  }
}

export default function CookieConsent() {
  const { t } = useLanguage()
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => 'pending')

  // Ladda statistiken först efter ett godkännande (även vid nästa besök).
  useEffect(() => {
    if (consent === 'accepted') loadAnalytics()
  }, [consent])

  function choose(value: 'accepted' | 'declined') {
    try {
      localStorage.setItem(CONSENT_KEY, value)
    } catch {}
    window.dispatchEvent(new Event(CONSENT_EVENT))
  }

  function accept() {
    choose('accepted')
  }

  function decline() {
    choose('declined')
  }

  if (consent !== 'none') return null

  return (
    <div
      className="cookie-banner"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "#fff",
        borderTop: "1px solid #ECECEC",
        padding: "20px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <p style={{ color: "#6B6B6B", fontSize: "14px", margin: 0 }}>
        {t.cookieText}
      </p>
      <div className="cookie-buttons" style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
        <button
          onClick={accept}
          style={{
            background: "#000",
            color: "#fff",
            fontWeight: 600,
            borderRadius: "100px",
            padding: "10px 24px",
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {t.cookieAccept}
        </button>
        <button
          onClick={decline}
          style={{
            background: "transparent",
            border: "1.5px solid #ECECEC",
            color: "#0A0A0A",
            borderRadius: "100px",
            padding: "10px 24px",
            fontSize: "14px",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {t.cookieDecline}
        </button>
      </div>
    </div>
  )
}
