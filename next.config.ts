import type { NextConfig } from "next";

/**
 * SÄKERHETSHUVUDENA, samma som plattformen (dashboard-v2/next.config.ts).
 * De gäller varje svar, sidor som API.
 *
 * CSP:N TILLÅTER INLINE-SKRIPT, med flit. Next lägger egna inline-skript
 * (self.__next_f), och utan 'unsafe-inline' krävs en nonce per förfrågan,
 * vilket gör varje sida dynamisk. Det CSP:n ändå gör:
 *
 *   frame-ancestors 'none'  ingen annan sida kan rama in sidan (klickkapning)
 *   connect-src             webbläsaren pratar bara med sidan och Google
 *                           Analytics, så ett injicerat skript kan inte
 *                           skicka data någon annanstans med fetch
 *   object-src, base-uri    inga plugin-objekt, ingen kapad <base>
 *   form-action 'self'      formulär skickas bara till sidan
 *
 * GOOGLE ANALYTICS laddas först efter cookiesamtycke (CookieConsent.tsx).
 * Domänerna är de Google anger för GA4: skriptet från googletagmanager.com,
 * mätningen till *.google-analytics.com och *.analytics.google.com (där
 * ingår region1.google-analytics.com, som används inom EU).
 *
 * Typsnitten kommer från next/font/google, som bäddar in dem i bygget och
 * serverar dem från sidan själv. Bilderna går via /_next/image eller /public.
 *
 * 'unsafe-eval' och ws: bara i next dev, som behöver dem för snabbomladdningen.
 *
 * REFERRER-POLICY same-origin, som plattformen: till en annan webbplats
 * skickas ingen adress alls, inte ens domänen.
 *
 * HSTS med includeSubDomains, men utan preload: preload är svårt att ta
 * tillbaka och ska beslutas för screndo.com i stort, inte här.
 */
const UTVECKLING = process.env.NODE_ENV !== "production";

const GA_SKRIPT = "https://www.googletagmanager.com";
const GA_MATNING =
  "https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com";

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${GA_SKRIPT}${UTVECKLING ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' blob: data: ${GA_MATNING}`,
  "font-src 'self' data:",
  `connect-src 'self' ${GA_MATNING}${UTVECKLING ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(UTVECKLING ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const SAKERHETSHUVUDEN = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Inget "x-powered-by: Next.js": det säger bara vad en angripare ska leta efter.
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: SAKERHETSHUVUDEN }];
  },
};

export default nextConfig;
