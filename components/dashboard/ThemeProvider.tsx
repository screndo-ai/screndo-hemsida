'use client'

import { createContext, useContext, useEffect, useSyncExternalStore } from 'react'

type Theme = 'dark' | 'light'

const ThemeContext = createContext<{
  theme: Theme
  toggle: () => void
}>({
  theme: 'dark',
  toggle: () => {},
})

// Temat sparas i localStorage och läses som en extern källa
// (useSyncExternalStore); servern och första renderingen är mörka.
const THEME_KEY = 'screndo-theme'
const THEME_EVENT = 'screndo-theme-change'

function subscribeTheme(onChange: () => void) {
  window.addEventListener('storage', onChange)
  window.addEventListener(THEME_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(THEME_EVENT, onChange)
  }
}

function readTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, (): Theme => 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  function toggle() {
    try {
      localStorage.setItem(THEME_KEY, theme === 'dark' ? 'light' : 'dark')
    } catch {}
    window.dispatchEvent(new Event(THEME_EVENT))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
