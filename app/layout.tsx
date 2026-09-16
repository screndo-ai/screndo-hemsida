import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/lib/LanguageContext";
import CookieConsent from "@/components/CookieConsent";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Screndo | AI-driven pulsmätning för medarbetarengagemang",
  description:
    "Medarbetarförståelse som sköter sig själv: Screndo frågar dina medarbetare, förstår svaren och ger dig ett konkret förslag på vad som är värt att göra. Utvecklat och designat i Halmstad, Sverige.",
  icons: { icon: "/nyfavicon.png" },
  robots: { googleBot: { noimageindex: true } },
  verification: { google: "mjIBIF1f28mY21N6YttL9-o8HC1i2-qgGnmNgpQjRio" },
  openGraph: {
    title: "Screndo | AI-driven pulsmätning för medarbetarengagemang",
    description:
      "Medarbetarförståelse som sköter sig själv: Screndo frågar dina medarbetare, förstår svaren och ger dig ett konkret förslag på vad som är värt att göra. Utvecklat och designat i Halmstad, Sverige.",
    url: "https://screndo.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className="dark">
      <body className={`${inter.variable} ${inter.className}`} style={{ background: "#fff", color: "#000", margin: 0 }}>
        <SmoothScroll />
        <LanguageProvider>
          {children}
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}
