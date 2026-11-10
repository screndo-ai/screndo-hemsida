// Illustrationer till funktionskorten på startsidan. Alla i samma stil:
// samma rutnät (160 x 112), linjetjocklek 3, rundade linjeändar, få former
// och mycket luft. Färgen kommer från currentColor (vit på mörka ytor, blå
// på den ljusa). Inga riktiga siffror och ingen text, utom skalans
// ändpunkter på eNPS-mätaren.

const S = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 3,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export type FeatureArtKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I'

export default function FeatureArt({ k }: { k: FeatureArtKey }) {
  return (
    <svg viewBox="0 0 160 112" aria-hidden="true" focusable="false">
      {ART[k]}
    </svg>
  )
}

const ART: Record<FeatureArtKey, React.ReactNode> = {
  // Pulsmätning: en pulslinje där små prickar (svar) landar av sig själva
  A: (
    <>
      <path {...S} d="M14 66H50L60 44L72 86L84 32L96 66H146" />
      <circle cx="116" cy="66" r="4" fill="currentColor" />
      <circle cx="132" cy="66" r="4" fill="currentColor" />
      <circle cx="124" cy="44" r="4" fill="currentColor" opacity="0.55" />
      <circle cx="140" cy="30" r="4" fill="currentColor" opacity="0.3" />
    </>
  ),
  // Anonym rapportering: pratbubbla utan avsändare, med ett litet lås
  I: (
    <>
      <path {...S} d="M42 24H118A14 14 0 0 1 132 38V66A14 14 0 0 1 118 80H78L58 94V80H42A14 14 0 0 1 28 66V38A14 14 0 0 1 42 24Z" />
      <path {...S} d="M72 50V45A8 8 0 0 1 88 45V50" />
      <rect {...S} x="66" y="50" width="28" height="20" rx="5" />
    </>
  ),
  // Läget i organisationen: en liten stapelgraf och en abstrakt värmekarta
  B: (
    <>
      <path {...S} d="M18 90H66" opacity="0.45" />
      <path {...S} d="M26 90V64M40 90V46M54 90V56" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <rect
            key={`${r}${c}`}
            x={84 + c * 21}
            y={26 + r * 21}
            width="16"
            height="16"
            rx="4"
            fill="currentColor"
            opacity={[[0.9, 0.35, 0.6], [0.5, 0.95, 0.25], [0.3, 0.65, 0.85]][r][c]}
          />
        )),
      )}
    </>
  ),
  // eNPS: halvcirkelmätare från −100 till +100 med zoner och en visare i
  // den positiva zonen (inget eget värde)
  C: (
    <>
      <path {...S} strokeWidth={9} strokeLinecap="butt" d="M28 82A52 52 0 0 1 54 37" opacity="0.3" />
      <path {...S} strokeWidth={9} strokeLinecap="butt" d="M57 35.5A52 52 0 0 1 103 35.5" opacity="0.6" />
      <path {...S} strokeWidth={9} strokeLinecap="butt" d="M106 37A52 52 0 0 1 132 82" />
      <path {...S} d="M80 82L106 50" />
      <circle cx="80" cy="82" r="5" fill="currentColor" />
      <g fill="currentColor" fontSize="10" fontFamily="var(--font-inter), sans-serif" opacity="0.8" textAnchor="middle">
        <text x="28" y="100">−100</text>
        <text x="80" y="22">0</text>
        <text x="132" y="100">+100</text>
      </g>
    </>
  ),
  // AI: en gnista med några små gnistor runt
  D: (
    <>
      <path {...S} d="M80 22C83 46 92 55 116 58C92 61 83 70 80 94C77 70 68 61 44 58C68 55 77 46 80 22Z" />
      <path {...S} d="M122 24C123 32 126 35 134 36C126 37 123 40 122 48C121 40 118 37 110 36C118 35 121 32 122 24Z" opacity="0.6" />
      <path {...S} d="M42 80C43 85 45 87 50 88C45 89 43 91 42 96C41 91 39 89 34 88C39 87 41 85 42 80Z" opacity="0.6" />
    </>
  ),
  // Från resultat till åtgärd: en graf som pilar vidare till en checklista
  F: (
    <>
      <path {...S} d="M16 80L30 66L42 72L56 52" />
      <circle cx="56" cy="52" r="4" fill="currentColor" />
      <path {...S} d="M70 58H92M84 50L92 58L84 66" opacity="0.6" />
      <path {...S} d="M106 40L111 45L120 36M128 41H146" />
      <path {...S} d="M106 62L111 67L120 58M128 63H146" />
      <path {...S} d="M128 85H146" opacity="0.4" />
      <rect {...S} x="105" y="79" width="12" height="12" rx="3" opacity="0.4" />
    </>
  ),
  // Utveckling över tid: en kurva som stiger allt brantare, med punkter
  G: (
    <>
      <path {...S} d="M18 94H146" opacity="0.35" />
      <path {...S} d="M20 88C62 86 96 76 136 24" />
      <circle cx="44" cy="86" r="4" fill="currentColor" />
      <circle cx="78" cy="80" r="4" fill="currentColor" />
      <circle cx="108" cy="62" r="4" fill="currentColor" />
      <circle cx="132" cy="30" r="4" fill="currentColor" />
    </>
  ),
  // Frågor som blir bättre: tre frågebubblor som växer och fylls, som en trappa
  E: (
    <>
      <path {...S} d="M22 74H44A6 6 0 0 1 50 80V88A6 6 0 0 1 44 94H32L26 99V94H22A6 6 0 0 1 16 88V80A6 6 0 0 1 22 74Z" />
      <path {...S} d="M66 52H94A7 7 0 0 1 101 59V71A7 7 0 0 1 94 78H80L72 84V78H66A7 7 0 0 1 59 71V59A7 7 0 0 1 66 52Z" fill="currentColor" fillOpacity="0.35" />
      <path {...S} d="M116 22H138A8 8 0 0 1 146 30V48A8 8 0 0 1 138 56H128L118 64V56H116A8 8 0 0 1 108 48V30A8 8 0 0 1 116 22Z" fill="currentColor" fillOpacity="0.85" />
    </>
  ),
  // Anonymt på riktigt: en sköld med en bock
  H: (
    <>
      <path {...S} d="M80 18L114 30V56C114 78 99 92 80 100C61 92 46 78 46 56V30Z" />
      <path {...S} d="M66 58L76 68L96 46" />
    </>
  ),
}
