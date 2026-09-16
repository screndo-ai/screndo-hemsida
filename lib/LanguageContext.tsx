'use client'

import { createContext, useContext, useEffect, useState } from 'react'

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
    headline: 'Medarbetarförståelse som sköter sig själv',
    subline: 'Screndo frågar dina medarbetare, förstår svaren och ger dig ett konkret förslag på vad som är värt att göra. Ingen enkät att administrera, ingen data att tolka.',
    seeHow: 'Se hur det fungerar',
    videoHeadline: 'Se hur Screndo fungerar',
    // Why it matters section
    whyMattersHeadline: 'Varför det spelar roll',
    whyMattersStat1Value: '51%',
    whyMattersStat1Label: 'fler uppgifter än vad som är rimligt, enligt chefer själva',
    whyMattersStat2Value: '75%',
    whyMattersStat2Label: 'av chefer känner sig överväldigade av sin roll',
    whyMattersStat3Value: '5x',
    whyMattersStat3Label: 'mer effektivt att göra chefsrollen hanterbar än att träna chefen mer',
    whyMattersBridge: 'Screndo lägger inte till en uppgift. Det tar bort administrationen kring något chefen redan ansvarar för, och fångar upp problem medan de fortfarande är små.',
    whyMattersSource: 'Källa: Gartner',
    // AI-native CTA section
    aiNativeHeadline: 'Du får inte en dashboard. Du får ett förslag.',
    aiNativeSubline: 'Varje rapport avslutas med en konkret åtgärd, grundad i vad dina medarbetare faktiskt svarat, och en kort motivering till varför.',
    watchDemo: 'Se demofilm',
    // Founded section
    foundedHeadline: 'Grundad där forskningen faktiskt görs.',
    foundedBody: 'Screndo är antaget till HighFive Innovationsarena vid Högskolan i Halmstad, med tillgång till forskning och rådgivning inom organisationspsykologi.',
    foundedImageAlt: 'Högskolan i Halmstad',
    // Auto section
    autoHeadline: 'Lägg tiden där det faktiskt gör skillnad.',
    autoParagraph: 'Screndo sköter pulsmätningarna autonomt och levererar färdiga åtgärder. Ingen app, ingen inloggning, ingenting för dina medarbetare att installera.',
    autoItem1: 'Formulera frågor',
    autoItem2: 'Samla in och analysera svaren',
    autoItem3: 'Omsätta till konkret åtgärd',
    autoFinal: 'Konkret åtgärd, redo att agera på.',
    // Employee view section
    employeeViewHeadline: 'Så ser det ut för medarbetaren',
    employeeMsg1: 'Hej! Snabb anonym fredagsfråga. Fördelas helger och obekväma pass rimligt i ditt team? Svara 1-10.',
    employeeMsg2: '7',
    employeeMsg3: 'Tack för ditt svar, din feedback betyder mycket. Vill du förklara varför du känner så?',
    employeeMsg4: 'Helgpassen hamnar ofta på samma två personer',
    employeeViewBody: 'Ett SMS, en siffra, valfritt en mening. Ingen app, ingen inloggning. Svaren är anonyma och visas aldrig för grupper under fem personer. Medarbetarna fortsätter svara av ett enda skäl: de ser att förra svaret ledde någonstans.',
    employeeViewContactName: 'Screndo',
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
    headline: 'Employee understanding that runs itself',
    subline: "Screndo asks your employees, understands the answers, and gives you one concrete suggestion worth acting on. No survey to administer, no data to interpret.",
    seeHow: 'See how it works',
    videoHeadline: 'See how Screndo works',
    // Why it matters section
    whyMattersHeadline: 'Why it matters',
    whyMattersStat1Value: '51%',
    whyMattersStat1Label: 'more tasks than is reasonable, according to managers themselves',
    whyMattersStat2Value: '75%',
    whyMattersStat2Label: 'of managers feel overwhelmed by their role',
    whyMattersStat3Value: '5x',
    whyMattersStat3Label: 'more effective to make the manager role manageable than to train the manager more',
    whyMattersBridge: "Screndo doesn't add another task. It removes the administration around something the manager already owns, and catches problems while they're still small.",
    whyMattersSource: 'Source: Gartner',
    // AI-native CTA section
    aiNativeHeadline: "You don't get a dashboard. You get a recommendation.",
    aiNativeSubline: 'Every report ends with a concrete action, grounded in what your employees actually said, and a short explanation of why.',
    watchDemo: 'Watch demo',
    // Founded section
    foundedHeadline: 'Founded where the research actually happens.',
    foundedBody: 'Screndo has been admitted to HighFive Innovation Arena at Halmstad University, with access to research and advisory support in organizational psychology.',
    foundedImageAlt: 'Halmstad University',
    // Auto section
    autoHeadline: 'Spend your time where it actually makes a difference.',
    autoParagraph: 'Screndo handles pulse measurements autonomously and delivers ready-made actions. No app, no login, nothing for your employees to install.',
    autoItem1: 'Formulate questions',
    autoItem2: 'Collect and analyze responses',
    autoItem3: 'Turn into concrete action',
    autoFinal: 'Concrete action, ready to act on.',
    // Employee view section
    employeeViewHeadline: "This is what it looks like for the employee",
    employeeMsg1: 'Hi! Quick anonymous Friday question. Are weekends and inconvenient shifts distributed fairly in your team? Answer 1-10.',
    employeeMsg2: '7',
    employeeMsg3: 'Thanks for your answer, your feedback matters. Want to explain why you feel that way?',
    employeeMsg4: 'Weekend shifts often land on the same two people',
    employeeViewBody: 'One text, one number, optionally a sentence. No app, no login. Answers are anonymous and never shown for groups under five people. Employees keep answering for one reason: they see that the last answer led somewhere.',
    employeeViewContactName: 'Screndo',
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

  useEffect(() => {
    const saved = localStorage.getItem('screndo-lang') as Lang | null
    if (saved === 'sv' || saved === 'en') setLang(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

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
