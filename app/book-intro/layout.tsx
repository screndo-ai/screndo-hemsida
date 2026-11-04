import type { Metadata } from "next";

// Sidans titel i HTML:en från början (sidan själv är en klientkomponent
// och kan inte exportera metadata). På engelska byts den i webbläsaren
// via LanguageContext (bookIntroMetaTitle).
export const metadata: Metadata = {
  title: "Screndo · Boka intro",
};

export default function BookIntroLayout({ children }: { children: React.ReactNode }) {
  return children;
}
