'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type Lang = 'sv' | 'en'

const translations = {
  sv: {
    // Privacy
    privacyHeadline: 'Integritetspolicy',
    lastUpdated: 'Senast uppdaterad: juni 2026',
    collectTitle: 'Vad vi samlar in',
    collectText: 'Vi samlar in den information du anger när du bokar ett intro: namn, jobbmejl, företagsnamn, jobbtitel och antal anställda.',
    whyTitle: 'Varför vi samlar in den',
    whyText: 'Vi använder informationen enbart för att kontakta dig om Screndo och förbereda vårt introduktionsmöte. Vi säljer eller delar inte din data med tredje part.',
    keepTitle: 'Hur länge vi sparar den',
    keepText: 'Vi sparar din information så länge det behövs för att upprätthålla vår affärsrelation. Du kan begära radering när som helst.',
    rightsTitle: 'Dina rättigheter',
    rightsText: 'Enligt GDPR har du rätt att få tillgång till, korrigera eller radera dina personuppgifter. Kontakta oss via vår hemsida.',
    // Book intro form
    pageHeadline: 'Boka intro',
    pageSubline: 'Vi hör av oss inom 24 timmar.',
    workEmail: 'Jobbmejl',
    firstName: 'Förnamn',
    lastName: 'Efternamn',
    companyName: 'Företagsnamn',
    jobTitle: 'Jobbtitel',
    companySize: 'Hur många är ni ungefär?',
    selectPlaceholder: 'Välj...',
    size1: '0-49',
    size2: '50-149',
    size3: '150-299',
    size4: '300-499',
    size5: '500+',
    textareaLabel: 'Något du vill att vi vet innan vi ses?',
    januaryNotice: 'Vi tar in nya kunder från januari 2027. Boka en intro nu så får du en plats i kön.',
    submitButton: 'Skicka förfrågan',
    submitButtonLoading: 'Skickar...',
    validationError: 'Fyll i det här obligatoriska fältet.',
    submitErrorMessage: 'Något gick fel. Försök igen om en stund.',
    confirmHeadline: 'Tack för att du hörde av dig.',
    confirmSubline: 'Du har nu din plats i kön inför januari 2027.',
    // Navbar
    login: 'Logga in',
    bookIntro: 'Boka intro',
    produkterDropdown: 'Produkter',
    menuLabel: 'Meny',
    // Hero
    headline1: 'Kultur som drivkraft',
    metaTitle: 'Screndo · Kultur som drivkraft',
    privacyMetaTitle: 'Screndo · Integritet',
    bookIntroMetaTitle: 'Screndo · Boka intro',
    metaDescription: 'Screndo samlar in feedback från era medarbetare, ger en aktuell bild av organisationen och stödjer ert systematiska arbetsmiljöarbete, löpande.',
    subline: 'Screndo samlar in feedback från era medarbetare, ger en aktuell bild av organisationen och stödjer ert systematiska arbetsmiljöarbete, löpande.',
    seeHow: 'Se hur det fungerar',
    videoHeadline: 'Se hur Screndo fungerar',
    // Startsidan under heron
    homeLossHeadline: 'Viktig feedback går förlorad om den inte fångas upp.',
    homeLossPara1: 'Är organisationen utspridd i tid och rum, blir ni fler eller är det svårt att prata med alla? Att ställa rätt frågor, i rätt tid, är svårare än det låter.',
    homeLossPara2: 'Screndo fångar upp feedback autonomt och bygger en kontext över tid, med pulsmätning, problemrapportering och en aktuell bild av läget i organisationen.',
    homeLossImageAlt: 'Medarbetare på en arbetsplats',
    homeSamHeadline: 'Ett stöd i det systematiska arbetsmiljöarbetet.',
    homeSamBody: 'Alla arbetsgivare ska löpande undersöka arbetsmiljön, bedöma riskerna, åtgärda det som behöver förbättras och följa upp att det fungerar. Screndo gör det till en naturlig del av vardagen.',
    homeSam1Title: 'Undersöka',
    homeSam1Text: 'Screndo ställer frågorna till medarbetarna.',
    homeSam2Title: 'Bedöma',
    homeSam2Text: 'Ni ser läget per avdelning och område.',
    homeSam3Title: 'Åtgärda',
    homeSam3Text: 'Screndo föreslår åtgärder, och ni väljer ett fokus.',
    homeSam4Title: 'Följa upp',
    homeSam4Text: 'Kommande mätningar visar om det blev bättre.',
    homeSamSource: 'Arbetsmiljöverkets föreskrifter om systematiskt arbetsmiljöarbete, AFS 2023:1',
    homeCostHeadline1: 'Rekrytering är dyrt.',
    homeCostHeadline2: 'Omotiverade anställda är dyrare.',
    homeStat1Value: '45\u00a0%',
    homeStat1Text: 'Anställda som fick erkännande av hög kvalitet var 45 procent mindre benägna att ha slutat två år senare.',
    homeStat1Source: 'Gallup, 2024',
    homeStat2Value: '23\u00a0%',
    homeStat2Text: 'Arbetsgrupper med högst engagemang har 23 procent högre lönsamhet än de med lägst.',
    homeStat2Source: 'Gallup, 2024',
    homeAdminHeadline: 'Lägg tiden på att förbättra, inte på att administrera.',
    homeAdminBody: 'Screndo ställer frågorna, samlar in svaren och finns där när du vill fråga hur det står till.',
    homeMockLabel: 'Skiss av Screndos startsida',
    homeMockGreeting: 'Hej Anna,',
    homeMockQuestion: 'Hur kan jag hjälpa dig idag?',
    homeMockCard1: 'Håll koll',
    homeMockCard2: 'Mätning 12',
    homeMockCard3: 'eNPS',
    homeMockAsk: 'Fråga Screndo vad som helst',
    homeMapHeadline: 'Se läget över hela organisationen.',
    homeMapTitle: 'Läget per avdelning',
    homeMapLabel: 'Exempel på värmekarta: ljusare ruta betyder bättre läge för avdelningen inom området.',
    homeResearchHeadline: 'Byggt på forskning om hur feedback blir drivkraft.',
    homeResearchBody: 'Frågorna bygger på etablerad forskning om arbetsmiljö. Screndo startade på HighFive Innovationsarena vid Högskolan i Halmstad och har nära band till forskningen där.',
    homeResearchImageAlt: 'Högskolan i Halmstad',
    homeTrustHeadline: 'Ett litet bolag från Halmstad. Höga krav på integritet.',
    homeTrust1Title: 'Svaren går inte att koppla till en person',
    homeTrust1Text: 'Kopplingen mellan svar och den som svarade raderas.',
    homeTrust2Title: 'Inga resultat från små grupper',
    homeTrust2Text: 'Resultat visas först när minst fem har svarat. Kommentarer först vid tio.',
    homeTrust3Title: 'Data inom EU',
    homeTrust3Text: 'Svar och personuppgifter lagras i en databas inom EU.',
    homeTrust4Title: 'Ingen bedömning av individer',
    homeTrust4Text: 'Screndo visar läget för grupper. Inga beslut fattas om enskilda.',
    homeTrust5Title: 'Byggt för GDPR',
    homeTrust5Text: 'Kunden äger sin data, och den raderas när avtalet upphör.',
    homeCtaHeadline: 'Vi tar in ett fåtal företag i taget.',
    homeCtaBody: 'Berätta kort om er organisation, så hör vi av oss om ett första samtal.',
    footerContact: 'Kontakt',
    footerCopyright: '© 2026 Screndo · Halmstad',
    // Why it matters section
    whyMattersHeadline: 'Varför det spelar roll',
    whyMattersPara1: 'De flesta organisationer frågar sina medarbetare en gång om året, ibland mer sällan. Den stora undersökningen har sin plats: den ger ledningen en helhetsbild och siffror att följa.',
    whyMattersPara2: 'Men det som påverkar vardagen händer mellan gångerna. Det behövs inte ännu ett HR-system som samlar nyckeltal och gör varje fråga till en punkt på ledningsmötet.',
    whyMattersPara3: 'Screndo finns för det löpande arbetet. Det förenar organisationspsykologi med er egen kontext och det medarbetarna säger just nu, och ger konkreta åtgärder att agera på.',
    whyMattersPara4: 'Har ni redan en undersökning? Ladda upp den, så tar Screndo vid därifrån.',
    // AI-native CTA section
    aiNativeHeadline: 'Du får inte en dashboard. Du får ett förslag.',
    aiNativeSubline: 'Varje rapport avslutas med en konkret åtgärd, grundad i vad dina medarbetare faktiskt svarat, och en kort motivering till varför.',
    aiNativeExtra: 'Och undrar du något, fråga. "Vad bör jag ta upp på medarbetarsamtalen nästa vecka?"',
    // Founded section
    foundedHeadline: 'Byggt på forskning, inte på magkänsla.',
    foundedBody: 'Screndo utvecklas vid HighFive Innovationsarena, Högskolan i Halmstad. Förslagen bygger på etablerad forskning om arbetsmiljö och organisationspsykologi.',
    foundedImageAlt: 'Högskolan i Halmstad',
    // Auto section
    autoHeadline: 'Lägg tiden där det faktiskt gör skillnad.',
    autoParagraph: 'Screndo sköter frågorna, svaren och analysen. Du får ett förslag, och bestämmer själv vad som görs.',
    autoItem1: 'Ställer frågorna',
    autoItem2: 'Samlar in och analyserar',
    autoItem3: 'Föreslår vad som är värt att göra',
    autoItem4: 'Följer upp om det hjälpte',
    autoFinal: 'Konkret åtgärd, redo att agera på.',
    // Employee view section
    employeeViewHeadline: 'Så ser det ut för medarbetaren',
    employeeViewBody: 'En länk via SMS eller mejl. Veckans kluring, en fråga, ett tryck. Ingen app, ingen inloggning, och svaren visas aldrig för grupper under fem.',
    svarCompanyName: 'Acme AB',
    svarQuestion: 'Känner du att du får tillräckligt med uppskattning för det arbete du gör?',
    svarNeverLabel: 'Inte alls',
    svarAlwaysLabel: 'Absolut',
    svarDisclaimer: 'Ditt svar är anonymt och citeras aldrig ordagrant.',
    svarKluringLabel: 'Veckans kluring',
    svarKluringQuestion: 'Vilken metall är vanligast i jordskorpan?',
    svarKluringFacitForst: 'Svaret får du när du svarat.',
    svarKluringFacitSvar: 'Rätt svar: aluminium',
    svarKorKnapp: 'Kör',
    svarTillbaka: 'Tillbaka',
    svarDuValde: 'Du valde 7',
    svarFoljdFraga: 'Vill du skriva några rader om varför?',
    svarFaltPlaceholder: 'Skriv om du vill. Det är frivilligt.',
    svarSkicka: 'Skicka',
    svarHoppaOver: 'Hoppa över',
    svarTypedText: 'Min chef är bra på att ge beröm när något går bra. Men jag önskar att vi fick veta tidigare när planeringen ändras.',
    svarTack: 'Tack för att du svarade.',
    svarTackUnder: 'Din feedback är viktig.',
    svarProblemPrefix: 'Något som inte fungerar? ',
    svarProblemLank: 'Rapportera anonymt',
    // Final CTA section
    finalCtaHeadline: 'Vill du se hur det skulle se ut hos er?',
    finalCtaSubline: 'Trettio minuter, inga förberedelser. Vi tittar på hur ni jobbar med medarbetarfeedback idag och visar hur Screndo skulle fungera hos er.',
    // Hero two-column section
    heroFeatureHeadline: 'Få reda på vad som stör dina medarbetare innan det blir ett problem.',
    heroFeatureParagraph: 'Screndo förbereder kontinuerligt korta, anonyma pulsfrågor åt dina medarbetare, du väljer själv hur ofta de ska gå ut. Frågorna väljs ur ett forskningsbaserat bibliotek inom organisationspsykologi och anpassas efter vad som faktiskt behöver undersökas i just din organisation, du godkänner varje fråga innan den skickas. Svaren analyseras direkt, du behöver aldrig själv tolka rådata eller läsa hundratals fritextsvar. Istället får du konkreta åtgärder att agera på, grundade i vad medarbetarna faktiskt säger, innan det blir ett problem som är svårt att vända. Chatta direkt med Screndo för att diskutera hur du enkelt kan applicera insikterna i praktiken.',
    // Feature section (home page)
    featureHeadline1: 'En fråga i veckan',
    featureHeadline2: 'Svar på en minut.',
    featureParagraph: 'Medarbetare svarar direkt via mobilen. Inga inloggningar, inga långa formulär. Öppna frågor ger utrymme för den som vill berätta mer.',
    // Home page CTA links
    homeCta: 'Se mer om produkten',
    getStartedFree: 'Kom igång gratis',
    // Pulse cards section
    pulseCardsHeadline: 'Mät det som spelar roll',
    pulseCardsSubline: 'Rotera mellan färdiga pulsar eller låt Screndo föreslå nästa utifrån vad som händer.',
    pulses: [
      { name: "Trivsel",          question: "Hur bra trivs du, 1 till 10?" },
      { name: "Arbetsbelastning", question: "Hur hanterbar känns din arbetsbörda?" },
      { name: "Ledarskap",        question: "Hur väl stöttar din närmaste chef dig?" },
      { name: "Teamkänsla",       question: "Hur väl fungerar samarbetet i teamet?" },
      { name: "eNPS",             question: "Skulle du rekommendera oss som arbetsplats?" },
      { name: "Arbetsmiljö",      question: "Hur fungerar din arbetsmiljö för det du ska göra?" },
    ],
    // Product search
    productSearchQuestion: 'Vilka signaler missar vi just nu?',
    productSearchAnswer: 'Ljudnivån har nämnts tre veckor i rad. Trivseln på plan 3 ligger under snittet. Vill du att jag föreslår en åtgärd?',
    sendLabel: 'Skicka',
    // More card (product page)
    moreCardTitle: '+ många fler',
    moreCardSubline: 'Hela biblioteket täcker allt från mening och samarbete till förändringsvilja och fokusro.',
    // CTA (home page)
    ctaHeadline: 'Hör vad din organisation faktiskt säger.',
    ctaButton: 'Boka intro',
    // Product page intro
    whatHeadline: 'De flesta organisationer är fulla av signaler. Nästan inga blir hörda.',
    whatPara1: 'Screndo är en plattform för kontinuerlig people intelligence. Den lyssnar på din organisation genom strukturerad och ostrukturerad data och översätter det till tydlig insikt för HR och ledning.',
    whatPara2: 'Inte ännu en årlig undersökning. Inte en dashboard som ingen öppnar. Ett system som faktiskt fungerar.',
    // Pulse section
    pulseLabel: 'PULSEN',
    pulseHeadline: 'En fråga i veckan. Svar på en minut.',
    pulseParagraph: 'Medarbetare svarar direkt i mobilen. Du ser svarsfrekvensen i realtid och vet exakt hur många som hunnit svara.',
    // Insights section
    insightsLabel: 'INSIKTER',
    insightsHeadline: 'Mönster som annars hade passerat obemärkt.',
    insightsParagraph: 'Screndo läser av vad som sägs över tid och lyfter fram det som faktiskt förändras. Inte fler siffror. Färre, men rätt.',
    // App section
    appLabel: 'APPEN',
    appHeadline: 'Anonymt. Alltid.',
    appParagraph: 'Medarbetare kan svara på veckans fråga eller rapportera något som inte fungerar. Ingen kan se vem som skrivit vad.',
    // Product CTA
    productCtaHeadline: 'Redo att testa?',
    // Login page
    loginHeadline: 'Logga in',
    emailLabel: 'E-post',
    passwordLabel: 'Lösenord',
    loginButton: 'Logga in',
    noAccount: 'Har du inget konto? Kontakta oss.',
    // Footer
    product: 'Produkt',
    privacy: 'Integritet',
    // Cookie banner
    cookieText: 'Vi använder cookies för att förbättra din upplevelse och mäta trafik.',
    cookieAccept: 'Acceptera',
    cookieDecline: 'Avböj',
    // Unused legacy
    overlayTitle: 'Ett system som lyssnar.',
    overlaySub: 'Screndo översätter din organisation i realtid.',
    gardenText: 'Organisationer är levande.',
    about: 'Om oss',
    careers: 'Karriär',
  },
  en: {
    // Privacy
    privacyHeadline: 'Privacy Policy',
    lastUpdated: 'Last updated: June 2026',
    collectTitle: 'What we collect',
    collectText: 'We collect the information you provide when booking an intro: name, work email, company name, job title, and company size.',
    whyTitle: 'Why we collect it',
    whyText: 'We use this information solely to contact you about Screndo and prepare for our introductory meeting. We do not sell or share your data with third parties.',
    keepTitle: 'How long we keep it',
    keepText: 'We retain your information for as long as necessary to maintain our business relationship. You can request deletion at any time.',
    rightsTitle: 'Your rights',
    rightsText: 'Under GDPR, you have the right to access, correct, or delete your personal data. Contact us via our website.',
    // Book intro form
    pageHeadline: 'Book an intro',
    pageSubline: 'We will reach out within 24 hours.',
    workEmail: 'Work email',
    firstName: 'First name',
    lastName: 'Last name',
    companyName: 'Company name',
    jobTitle: 'Job title',
    companySize: 'Roughly how many are you?',
    selectPlaceholder: 'Select...',
    size1: '0-49',
    size2: '50-149',
    size3: '150-299',
    size4: '300-499',
    size5: '500+',
    textareaLabel: 'Anything you want us to know before we meet?',
    januaryNotice: "We're onboarding new customers starting January 2027. Book an intro now to secure your place in the queue.",
    submitButton: 'Send request',
    submitButtonLoading: 'Sending...',
    validationError: 'Please complete this required field.',
    submitErrorMessage: 'Something went wrong. Please try again shortly.',
    confirmHeadline: 'Thanks for reaching out.',
    confirmSubline: "You've secured your place in the queue for January 2027.",
    // Navbar
    login: 'Log in',
    bookIntro: 'Book an intro',
    produkterDropdown: 'Products',
    menuLabel: 'Menu',
    // Hero
    headline1: 'Culture as the driving force',
    subline: 'Screndo gathers feedback from your employees, gives you a current picture of the organisation and supports your systematic work environment management, continuously.',
    metaTitle: 'Screndo · Culture as the driving force',
    privacyMetaTitle: 'Screndo · Privacy',
    bookIntroMetaTitle: 'Screndo · Book an intro',
    metaDescription: 'Screndo gathers feedback from your employees, gives you a current picture of the organisation and supports your systematic work environment management, continuously.',
    seeHow: 'See how it works',
    videoHeadline: 'See how Screndo works',
    // Home page below the hero
    homeLossHeadline: "Important feedback is lost if it isn't captured.",
    homeLossPara1: 'Is your organisation spread out in time and place, are you growing, or is it hard to talk to everyone? Asking the right questions at the right time is harder than it sounds.',
    homeLossPara2: 'Screndo captures feedback autonomously and builds context over time, with pulse surveys, issue reporting and an up-to-date picture of where your organisation stands.',
    homeLossImageAlt: 'Employees at a workplace',
    homeSamHeadline: 'Support for systematic work environment management.',
    homeSamBody: 'All employers must continuously examine the work environment, assess the risks, fix what needs improving and follow up that it works. Screndo makes it a natural part of everyday work.',
    homeSam1Title: 'Examine',
    homeSam1Text: 'Screndo asks your employees the questions.',
    homeSam2Title: 'Assess',
    homeSam2Text: 'You see the situation by department and area.',
    homeSam3Title: 'Act',
    homeSam3Text: 'Screndo suggests actions, and you choose a focus.',
    homeSam4Title: 'Follow up',
    homeSam4Text: 'Upcoming surveys show whether things got better.',
    homeSamSource: 'The Swedish Work Environment Authority’s provisions on systematic work environment management, AFS 2023:1',
    homeCostHeadline1: 'Recruiting is expensive.',
    homeCostHeadline2: 'Unmotivated employees cost more.',
    homeStat1Value: '45%',
    homeStat1Text: 'Employees who received high-quality recognition were 45 percent less likely to have left two years later.',
    homeStat1Source: 'Gallup, 2024',
    homeStat2Value: '23%',
    homeStat2Text: 'Work groups with the highest engagement are 23 percent more profitable than those with the lowest.',
    homeStat2Source: 'Gallup, 2024',
    homeAdminHeadline: 'Spend your time improving, not administering.',
    homeAdminBody: 'Screndo asks the questions, collects the answers and is there when you want to ask how things are going.',
    homeMockLabel: "Sketch of Screndo's home screen",
    homeMockGreeting: 'Hi Anna,',
    homeMockQuestion: 'How can I help you today?',
    homeMockCard1: 'Keep track',
    homeMockCard2: 'Survey 12',
    homeMockCard3: 'eNPS',
    homeMockAsk: 'Ask Screndo anything',
    homeMapHeadline: 'See where the whole organisation stands.',
    homeMapTitle: 'Status by department',
    homeMapLabel: 'Example heat map: a lighter cell means a better situation for the department in that area.',
    homeResearchHeadline: 'Built on research into how feedback becomes a driving force.',
    homeResearchBody: 'The questions are based on established research on the work environment. Screndo started at HighFive Innovation Arena at Halmstad University and has close ties to the research there.',
    homeResearchImageAlt: 'Halmstad University',
    homeTrustHeadline: 'A small company from Halmstad. High standards for privacy.',
    homeTrust1Title: "Answers can't be linked to a person",
    homeTrust1Text: 'The link between an answer and the person who gave it is deleted.',
    homeTrust2Title: 'No results from small groups',
    homeTrust2Text: 'Results are shown only once at least five people have answered. Comments only at ten.',
    homeTrust3Title: 'Data within the EU',
    homeTrust3Text: 'Answers and personal data are stored in a database within the EU.',
    homeTrust4Title: 'No assessment of individuals',
    homeTrust4Text: 'Screndo shows how groups are doing. No decisions are made about individuals.',
    homeTrust5Title: 'Built for GDPR',
    homeTrust5Text: 'The customer owns its data, and it is deleted when the agreement ends.',
    homeCtaHeadline: 'We take on a few companies at a time.',
    homeCtaBody: "Tell us briefly about your organisation and we'll get in touch about a first call.",
    footerContact: 'Contact',
    footerCopyright: '© 2026 Screndo · Halmstad',
    // Why it matters section
    whyMattersHeadline: 'Why it matters',
    whyMattersPara1: 'Most organizations ask their employees once a year, sometimes even less often. The big survey has its place: it gives leadership a full picture and numbers to track.',
    whyMattersPara2: "But what affects day-to-day work happens in between. What's needed isn't another HR system that collects metrics and turns every question into an agenda item for the leadership meeting.",
    whyMattersPara3: "Screndo exists for the ongoing work. It combines organizational psychology with your own context and what employees are saying right now, and turns it into concrete actions to act on.",
    whyMattersPara4: 'Already have a survey? Upload it, and Screndo picks up from there.',
    // AI-native CTA section
    aiNativeHeadline: "You don't get a dashboard. You get a recommendation.",
    aiNativeSubline: 'Every report ends with a concrete action, grounded in what your employees actually said, and a short explanation of why.',
    aiNativeExtra: 'And if you wonder about something, just ask. "What should I bring up in next week\'s one-on-ones?"',
    // Founded section
    foundedHeadline: 'Built on research, not gut feeling.',
    foundedBody: 'Screndo is developed at HighFive Innovation Arena, Halmstad University. The suggestions are based on established research in work environment and organisational psychology.',
    foundedImageAlt: 'Halmstad University',
    // Auto section
    autoHeadline: 'Spend your time where it actually makes a difference.',
    autoParagraph: 'Screndo handles the questions, the responses and the analysis. You get a suggestion, and decide for yourself what gets done.',
    autoItem1: 'Asks the questions',
    autoItem2: 'Collects and analyses',
    autoItem3: "Suggests what's worth doing",
    autoItem4: 'Follows up on whether it helped',
    autoFinal: 'Concrete action, ready to act on.',
    // Employee view section
    employeeViewHeadline: "This is what it looks like for the employee",
    employeeViewBody: 'A link by text or email. The weekly brain teaser, one question, one tap. No app, no login, and responses are never shown for groups under five.',
    svarCompanyName: 'Acme AB',
    svarQuestion: 'Do you feel you get enough appreciation for the work you do?',
    svarNeverLabel: 'Not at all',
    svarAlwaysLabel: 'Absolutely',
    svarDisclaimer: 'Your answer is anonymous and never quoted word for word.',
    svarKluringLabel: 'Weekly brain teaser',
    svarKluringQuestion: "Which metal is most common in the Earth's crust?",
    svarKluringFacitForst: "You'll get the answer after you respond.",
    svarKluringFacitSvar: 'Correct answer: aluminium',
    svarKorKnapp: 'Start',
    svarTillbaka: 'Back',
    svarDuValde: 'You chose 7',
    svarFoljdFraga: 'Would you like to write a few lines about why?',
    svarFaltPlaceholder: "Write if you want. It's optional.",
    svarSkicka: 'Send',
    svarHoppaOver: 'Skip',
    svarTypedText: 'My manager is good at giving praise when things go well. But I wish we found out earlier when the schedule changes.',
    svarTack: 'Thanks for responding.',
    svarTackUnder: 'Your feedback matters.',
    svarProblemPrefix: 'Something not working? ',
    svarProblemLank: 'Report anonymously',
    // Final CTA section
    finalCtaHeadline: 'Want to see what it would look like for you?',
    finalCtaSubline: "Thirty minutes, no prep. We'll look at how you handle employee feedback today and show you how Screndo would work for you.",
    // Hero two-column section
    heroFeatureHeadline: 'Find out what is bothering your employees before it becomes a problem.',
    heroFeatureParagraph: 'Screndo continuously prepares short, anonymous pulse questions for your employees — you decide how often they go out. Questions are selected from a research-based library in organizational psychology and tailored to what actually needs to be explored in your organization; you approve each question before it is sent. Answers are analyzed instantly — you never have to interpret raw data or read through hundreds of free-text responses. Instead, you get concrete actions to take, grounded in what employees are actually saying, before it becomes a problem that is hard to reverse. Chat directly with Screndo to discuss how you can easily put the insights into practice.',
    // Feature section (home page)
    featureHeadline1: 'One question a week',
    featureHeadline2: 'Answered in a minute.',
    featureParagraph: 'People answer straight from their phone. No logins, no long forms. Open questions leave room for those who want to say more.',
    // Home page CTA links
    homeCta: 'Learn more',
    getStartedFree: 'Get started for free',
    // Pulse cards section
    pulseCardsHeadline: 'Measure what matters',
    pulseCardsSubline: "Rotate between ready-made pulses or let Screndo suggest the next one based on what's happening.",
    pulses: [
      { name: "Wellbeing",        question: "How would you rate your wellbeing, 1 to 10?" },
      { name: "Workload",         question: "How manageable is your workload right now?" },
      { name: "Leadership",       question: "How well does your manager support you?" },
      { name: "Team spirit",      question: "How well does collaboration work in the team?" },
      { name: "eNPS",             question: "Would you recommend us as a workplace?" },
      { name: "Work environment", question: "How well does your work environment support your work?" },
    ],
    // Product search
    productSearchQuestion: 'What signals are we missing right now?',
    productSearchAnswer: 'The noise level has been mentioned three weeks in a row. Wellbeing on floor 3 is below average. Would you like me to suggest an action?',
    sendLabel: 'Send',
    // More card (product page)
    moreCardTitle: '+ many more',
    moreCardSubline: 'The full library covers everything from meaning and collaboration to change readiness and focus time.',
    // CTA (home page)
    ctaHeadline: 'Hear what your organization is actually saying.',
    ctaButton: 'Book an intro',
    // Product page intro
    whatHeadline: 'Most organizations are full of signal. Almost none of it gets heard.',
    whatPara1: 'Screndo is a continuous people intelligence platform. It listens to your organization through structured and unstructured data and translates that into clear insight for HR and leadership.',
    whatPara2: 'Not another annual survey. Not a dashboard nobody opens. A system that actually works.',
    // Pulse section
    pulseLabel: 'THE PULSE',
    pulseHeadline: 'One question a week. Answered in a minute.',
    pulseParagraph: 'People answer straight from their phone. You see the response rate in real time and know exactly how many have replied.',
    // Insights section
    insightsLabel: 'INSIGHTS',
    insightsHeadline: 'Patterns that would otherwise go unnoticed.',
    insightsParagraph: 'Screndo reads what is said over time and surfaces what is actually changing. Not more numbers. Fewer, but the right ones.',
    // App section
    appLabel: 'THE APP',
    appHeadline: 'Anonymous. Always.',
    appParagraph: 'People can answer the weekly question or report something that is not working. No one can see who wrote what.',
    // Product CTA
    productCtaHeadline: 'Ready to try it?',
    // Login page
    loginHeadline: 'Log in',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    loginButton: 'Log in',
    noAccount: 'No account? Get in touch.',
    // Footer
    product: 'Product',
    privacy: 'Privacy',
    // Cookie banner
    cookieText: 'We use cookies to improve your experience and measure traffic.',
    cookieAccept: 'Accept',
    cookieDecline: 'Decline',
    // Unused legacy
    overlayTitle: 'A system that listens.',
    overlaySub: 'Screndo translates your organization in real time.',
    gardenText: 'Organizations are living things.',
    about: 'About',
    careers: 'Careers',
  },
}

type Translations = typeof translations.sv

const LanguageContext = createContext<{
  lang: Lang
  t: Translations
  setLanguage: (l: Lang) => void
}>({
  lang: 'sv',
  t: translations.sv,
  setLanguage: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('sv')
  const pathname = usePathname()

  useEffect(() => {
    const saved = localStorage.getItem('screndo-lang') as Lang | null
    if (saved === 'sv' || saved === 'en') setLang(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    // Titel och description följer språkvalet. Den statiska metadatan
    // (layout.tsx, page.tsx) är svenska (det som crawlers och delningskort
    // ser). Next kan skriva in sin <title> efter den här effekten, så en
    // observatör på <head> lägger tillbaka rätt titel om den skrivs över.
    // Egna titlar för /privacy och /book-intro (samma som i deras
    // layout.tsx på svenska), annars startsidans.
    const tr = translations[lang]
    const metaTitle =
      pathname === '/privacy' ? tr.privacyMetaTitle
      : pathname === '/book-intro' ? tr.bookIntroMetaTitle
      : tr.metaTitle
    const metaDescription = tr.metaDescription
    const apply = () => {
      if (document.title !== metaTitle) document.title = metaTitle
      const desc = document.querySelector('meta[name="description"]')
      if (desc && desc.getAttribute('content') !== metaDescription) desc.setAttribute('content', metaDescription)
    }
    apply()
    const observer = new MutationObserver(apply)
    observer.observe(document.head, { childList: true, subtree: true, characterData: true, attributes: true })
    return () => observer.disconnect()
  }, [lang, pathname])

  function setLanguage(l: Lang) {
    setLang(l)
    localStorage.setItem('screndo-lang', l)
  }

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
