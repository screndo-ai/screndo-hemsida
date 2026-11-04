// Korten i bildraden under heron på startsidan, i visningsordning
// (flytta ett helt objekt för att byta plats på ett kort).
// Ändra texterna här: role visas i fetstil, perspective på raden under.
// alt beskriver personen på bilden för skärmläsare.

export type HeroCard = {
  src: string
  width: number
  height: number
  sv: { role: string; perspective: string; alt: string }
  en: { role: string; perspective: string; alt: string }
}

export const heroCards: HeroCard[] = [
  {
    src: '/brandi1.jpg',
    width: 1105,
    height: 1423,
    sv: {
      role: 'Teamledare, kontor',
      perspective: 'Säger att allt är bra. Har sökt två jobb den här månaden.',
      alt: 'Kvinna med glasögon och mörk kavaj mot ljusblå bakgrund.',
    },
    en: {
      role: 'Team lead, office',
      perspective: 'Says everything is fine. Has applied for two jobs this month.',
      alt: 'Woman with glasses and a dark blazer against a light blue background.',
    },
  },
  {
    src: '/brandi2.jpg',
    width: 1023,
    height: 1317,
    sv: {
      role: 'Lagerarbetare',
      perspective: 'Har en idé som skulle spara en timme om dagen. Ingen har frågat.',
      alt: 'Man i grå tröja som blickar åt sidan mot ljus bakgrund.',
    },
    en: {
      role: 'Warehouse worker',
      perspective: 'Has an idea that would save an hour a day. Nobody has asked.',
      alt: 'Man in a grey sweater looking to the side against a light background.',
    },
  },
  {
    src: '/brandi3.jpg',
    width: 997,
    height: 1284,
    sv: {
      role: 'Ny på jobbet',
      perspective: 'Vet inte vad som förväntas av henne och vågar inte fråga.',
      alt: 'Kvinna i mörkgrön tröja med hakan i handen mot ljusblå bakgrund.',
    },
    en: {
      role: 'New on the job',
      perspective: "Doesn't know what is expected of her and doesn't dare to ask.",
      alt: 'Woman in a dark green sweater resting her chin on her hand against a light blue background.',
    },
  },
  {
    src: '/brandi4.jpg',
    width: 1105,
    height: 1423,
    sv: {
      role: 'Montör, tolv år i bolaget',
      perspective: 'Gör jobbet för två sedan kollegan slutade.',
      alt: 'Gråhårig man i vit t-shirt mot mörkblå bakgrund.',
    },
    en: {
      role: 'Assembler, twelve years at the company',
      perspective: 'Has been doing the work of two since a colleague left.',
      alt: 'Grey-haired man in a white T-shirt against a dark blue background.',
    },
  },
  {
    src: '/brandi6.jpg',
    width: 1105,
    height: 1423,
    sv: {
      role: 'Undersköterska',
      perspective: 'Känner sig ensam på kvällspassen.',
      alt: 'Blond man i mörk tröja mot ljusgrå bakgrund.',
    },
    en: {
      role: 'Assistant nurse',
      perspective: 'Feels alone on the evening shifts.',
      alt: 'Blond man in a dark sweater against a light grey background.',
    },
  },
  {
    src: '/brandi8.jpg',
    width: 1105,
    height: 1423,
    sv: {
      role: 'Chef för tolv personer',
      perspective: 'Vill veta hur teamet mår, men hör bara att det är lugnt.',
      alt: 'Kvinna med uppsatt brunt hår i blå arbetsjacka mot blå bakgrund.',
    },
    en: {
      role: 'Manager of twelve people',
      perspective: 'Wants to know how the team is doing, but only hears that things are calm.',
      alt: 'Woman with brown hair tied up, in a blue work jacket against a blue background.',
    },
  },
  {
    src: '/brandi5.jpg',
    width: 1105,
    height: 1423,
    sv: {
      role: 'Säljare',
      perspective: 'Fick sitt senaste beröm för ett halvår sedan.',
      alt: 'Man med mörkt, lockigt hår i svart tröja mot ljusblå bakgrund.',
    },
    en: {
      role: 'Sales representative',
      perspective: 'Last received praise six months ago.',
      alt: 'Man with dark, wavy hair in a black sweater against a light blue background.',
    },
  },
  {
    src: '/brandi7.jpg',
    width: 1105,
    height: 1423,
    sv: {
      role: 'Produktionstekniker',
      perspective: 'Funderar på att sluta. Ingen har märkt det.',
      alt: 'Kvinna med uppsatt blont hår i mörk skjorta mot mörkblå bakgrund.',
    },
    en: {
      role: 'Production engineer',
      perspective: 'Is thinking about quitting. Nobody has noticed.',
      alt: 'Woman with blonde hair tied up, in a dark shirt against a dark blue background.',
    },
  },
]
