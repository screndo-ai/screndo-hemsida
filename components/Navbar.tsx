'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

export default function Navbar() {
  const { t, lang, setLanguage } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('click', handleOutside)
    return () => document.removeEventListener('click', handleOutside)
  }, [menuOpen])

  return (
    <nav
      ref={navRef}
      className="navbar"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: "64px",
        background: "#fff",
        borderBottom: "1px solid #ECECEC",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Left: logo + nav */}
      <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        <a href="/"><img src="/logo2.png" alt="Screndo" className="navbar-logo" style={{ height: "46px", width: "auto" }} /></a>

      </div>

      {/* Right: lang + desktop links + hamburger */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>

        {/* SV/EN — always visible */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px" }}>
          <button
            onClick={() => setLanguage('sv')}
            style={{ background: "none", border: "none", cursor: lang === 'sv' ? "default" : "pointer", fontFamily: "inherit", fontSize: "13px", padding: 0, letterSpacing: "-0.01em", color: lang === 'sv' ? "#0A0A0A" : "#6B6B6B", fontWeight: lang === 'sv' ? 500 : 400 }}
          >SV</button>
          <span style={{ color: "#6B6B6B" }}>/</span>
          <button
            onClick={() => setLanguage('en')}
            style={{ background: "none", border: "none", cursor: lang === 'en' ? "default" : "pointer", fontFamily: "inherit", fontSize: "13px", padding: 0, letterSpacing: "-0.01em", color: lang === 'en' ? "#0A0A0A" : "#6B6B6B", fontWeight: lang === 'en' ? 500 : 400 }}
          >EN</button>
        </div>

        {/* Logga in — desktop only */}
        <a
          className="nav-desktop-item"
          href="/login"
          style={{ color: "#6B6B6B", textDecoration: "none", fontSize: "15px", fontWeight: 400, letterSpacing: "-0.01em" }}
        >
          {t.login}
        </a>

        {/* Boka intro — desktop only */}
        <a
          className="nav-desktop-item"
          href="/book-intro"
          style={{
            background: "#000",
            color: "#fff",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            borderRadius: "100px",
            padding: "9px 20px",
            display: "inline-block",
          }}
        >
          {t.bookIntro}
        </a>

        {/* Hamburger — mobile only */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label={t.menuLabel}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu backdrop + panel */}
      {menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed",
              top: "64px",
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(10,10,10,0.35)",
              zIndex: 98,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "64px",
              left: 0,
              right: 0,
              background: "#fff",
              borderBottom: "1px solid #ECECEC",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              zIndex: 99,
            }}
          >
            <a href="/login" style={{ color: "#0A0A0A", fontSize: "15px", textDecoration: "none" }}>{t.login}</a>
            <a
              href="/book-intro"
              className="nav-mobile-book"
              style={{
                background: "#000",
                color: "#fff",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
                borderRadius: "100px",
                padding: "12px 20px",
                textAlign: "center",
                display: "block",
              }}
            >
              {t.bookIntro}
            </a>
          </div>
        </>
      )}
    </nav>
  )
}
