'use client'

import Image from 'next/image'
import { useLanguage } from '@/lib/LanguageContext'

const LINKEDIN_URL = 'https://www.linkedin.com/company/screndo'

// Sidfoten på startsidan: Screndo-loggan över hela bredden, länkar till
// vänster och copyright till höger. logo2.png (3000x1000) har transparent
// marginal runt själva logotypen; .home-wordmark beskär bort den (se
// globals.css) så att logotypen fyller bredden kant i kant.
export default function HomeFooter() {
  const { t } = useLanguage()

  return (
    <footer className="home home-footer">
      <div className="home-wordmark">
        <Image src="/logo2.png" alt="Screndo" width={3000} height={1000} sizes="110vw" />
      </div>
      <div className="home-footer-row">
        <div>
          <a href="/privacy">{t.privacy}</a>
          <a href="/book-intro">{t.footerContact}</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
        <span>{t.footerCopyright}</span>
      </div>
    </footer>
  )
}
