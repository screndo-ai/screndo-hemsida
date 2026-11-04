import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeSections from "@/components/HomeSections";
import HomeFooter from "@/components/HomeFooter";
import type { Metadata } from "next";

const title = "Screndo · Feedback som drivkraft";
const description =
  "Screndo fångar upp feedback från era medarbetare autonomt och ger en aktuell överblick över er organisation.";

// Startsidans titel och beskrivning, samma för Open Graph och Twitter så
// att länken ser bra ut när den delas (t.ex. på LinkedIn). Delningsbilden
// public/og-image.png är 1200x630.
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://screndo.com",
    siteName: "Screndo",
    locale: "sv_SE",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Screndo – Feedback som drivkraft" }],
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
