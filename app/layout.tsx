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
  title: "Screndo | Organisatorisk intelligens genom medarbetarfeedback",
  description:
    "Från spridda insikter till samlad intelligens. Screndo använder AI för att ställa korta, anonyma frågor till alla medarbetare och föreslå vad som är värt att göra, grundat i organisationspsykologi.",
  icons: { icon: "/nyfavicon.png" },
  robots: { googleBot: { noimageindex: true } },
  verification: { google: "mjIBIF1f28mY21N6YttL9-o8HC1i2-qgGnmNgpQjRio" },
  openGraph: {
    title: "Screndo | Organisatorisk intelligens genom medarbetarfeedback",
    description:
      "Från spridda insikter till samlad intelligens. Screndo använder AI för att ställa korta, anonyma frågor till alla medarbetare och föreslå vad som är värt att göra, grundat i organisationspsykologi.",
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
