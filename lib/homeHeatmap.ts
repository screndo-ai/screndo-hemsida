// Värmekartan "Läget per avdelning" på startsidan. Exempeldata: värdena
// syns aldrig som siffror, de styr bara hur ljus varje ruta är (högre värde
// = ljusare ruta = bättre läge). Ändra namn eller värden här.

export const heatmapAreas = {
  sv: ['Arbetsbelastning', 'Ledarskap', 'Trygghet', 'Erkännande', 'Tydlighet', 'Meningsfullhet'],
  en: ['Workload', 'Leadership', 'Safety', 'Recognition', 'Clarity', 'Meaningfulness'],
}

export const heatmapDepartments: { sv: string; en: string; values: number[] }[] = [
  { sv: 'Produktion', en: 'Production', values: [48, 66, 71, 52, 63, 74] },
  { sv: 'Lager', en: 'Warehouse', values: [55, 61, 69, 47, 58, 70] },
  { sv: 'Kontor', en: 'Office', values: [68, 72, 80, 64, 75, 78] },
  { sv: 'Ekonomi', en: 'Finance', values: [62, 70, 77, 59, 71, 73] },
  { sv: 'Kundtjänst', en: 'Customer service', values: [51, 64, 73, 57, 60, 69] },
]
