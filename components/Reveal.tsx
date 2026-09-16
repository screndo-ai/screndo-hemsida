'use client'

import { useRef, useEffect, useState, ReactNode, CSSProperties } from 'react'

type Variant = 'up' | 'left' | 'right' | 'scale'

const OFFSETS: Record<Variant, string> = {
  up: 'translateY(26px)',
  left: 'translateX(-36px)',
  right: 'translateX(36px)',
  scale: 'scale(0.95)',
}

export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  className,
  style,
}: {
  children: ReactNode
  variant?: Variant
  delay?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setReducedMotion(true)
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : OFFSETS[variant],
        transition: reducedMotion
          ? 'none'
          : `opacity 0.7s ease-out ${delay}ms, transform 0.7s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
