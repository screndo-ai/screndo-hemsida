import type { Metadata } from "next";

// Sidans titel i HTML:en från början (sidan själv är en klientkomponent
// och kan inte exportera metadata). På engelska byts den i webbläsaren
// via LanguageContext (privacyMetaTitle).
export const metadata: Metadata = {
  title: "Screndo · Integritet",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
