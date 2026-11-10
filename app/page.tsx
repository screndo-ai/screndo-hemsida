import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeSections from "@/components/HomeSections";
import HomeFooter from "@/components/HomeFooter";
import type { Metadata } from "next";

const title = "Screndo · Från insikt till handling";
const description =
  "Screndo samlar in feedback från era medarbetare löpande och ger en aktuell bild av organisationen. Sedan hjälper vi er att agera på den, med stöd i forskning.";

// Startsidans titel och beskrivning, samma för Open Graph och Twitter så
// att länken ser bra ut när den delas (t.ex. på LinkedIn). Delningsbilden
// public/og-image.png är 1200x630.
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://www.screndo.com",
    siteName: "Screndo",
    locale: "sv_SE",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Screndo. Från insikt till handling" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
};

export default function Home() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <HomeSections />
      <HomeFooter />
    </div>
  );
}
