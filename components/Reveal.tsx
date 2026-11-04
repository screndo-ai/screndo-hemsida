'use client'

import { useRef, useEffect, useState, ReactNode, CSSProperties, ElementType, HTMLAttributes } from 'react'

// Spelar en in-animation en gång, när elementet kommer in i bild
// (IntersectionObserver + CSS-övergång). Med prefers-reduced-motion visas
// allt direkt utan rörelse (se [data-reveal] i globals.css). Elementet får klassen is-in när det har
// visats, så att CSS för innehållet kan haka på (se värmekartan i
// globals.css). variant "none" rör inte elementet självt, bara is-in.
type Variant = 'up' | 'left' | 'right' | 'scale' | 'fade' | 'none'

// Standardsträcka per variant; distance (px) skriver över den.
const OFFSETS: Record<Variant, (d?: number) => string> = {
  up: (d = 24) => `translateY(${d}px)`,
  left: (d = 48) => `translateX(-${d}px)`,
  right: (d = 48) => `translateX(${d}px)`,
  scale: () => 'scale(0.95)',
  fade: () => 'none',
  none: () => 'none',
}

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export default function Reveal({
  children,
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  duration = 800,
  threshold = 0.2,
  distance,
  easing = EASE,
  className,
  style,
  ...rest
}: {
  children?: ReactNode
  as?: ElementType
  variant?: Variant
  delay?: number
  duration?: number
  threshold?: number
  distance?: number
  easing?: string
  className?: string
  style?: CSSProperties
} & Omit<HTMLAttributes<HTMLElement>, 'className' | 'style' | 'children'>) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  const animated = variant !== 'none'

  return (
    <Tag
      ref={ref}
      data-reveal={animated ? '' : undefined}
      className={[className, visible ? 'is-in' : ''].filter(Boolean).join(' ') || undefined}
      style={{
        ...style,
        ...(animated && {
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : OFFSETS[variant](distance),
          transition: `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`,
        }),
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
