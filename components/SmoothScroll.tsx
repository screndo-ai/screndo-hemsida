'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

// Kalibrering: subtil glidning efter release, ingen studs. lerp 0.1 och
// duration 1.1s (exponentiell ease-out, ingen overshoot) ger en kort,
// exklusiv känsla snarare än en lång utrullning. syncTouch lämnas av
// (default false) så mobilens native scroll inte påverkas alls — Lenis
// läser bara scrollpositionen där, den smoothar inte pekskärmsscroll.
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.1,
      wheelMultiplier: 1,
      anchors: true,
      respectReducedMotion: true,
    })

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return null
}
