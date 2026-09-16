import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type BookIntroPayload = {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  jobTitle: string;
  companySize: string;
  message: string;
};

const requiredFields: (keyof BookIntroPayload)[] = [
  "email",
  "firstName",
  "lastName",
  "company",
  "jobTitle",
  "companySize",
];

const MAX_LENGTHS: Record<keyof BookIntroPayload, number> = {
  email: 254,
  firstName: 100,
  lastName: 100,
  company: 150,
  jobTitle: 150,
  companySize: 50,
  message: 2000,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPayload(body: unknown): body is BookIntroPayload {
  if (typeof body !== "object" || body === null) return false;
  const record = body as Record<string, unknown>;

  const allFieldsWellFormed = (Object.keys(MAX_LENGTHS) as (keyof BookIntroPayload)[]).every(
    (field) => record[field] === undefined || typeof record[field] === "string"
  );
  if (!allFieldsWellFormed) return false;

  const requiredFieldsPresent = requiredFields.every((field) => {
    const value = record[field];
    return typeof value === "string" && value.trim().length > 0 && value.length <= MAX_LENGTHS[field];
  });
  if (!requiredFieldsPresent) return false;

  const message = record.message;
  if (typeof message === "string" && message.length > MAX_LENGTHS.message) return false;

  return EMAIL_PATTERN.test((record.email as string).trim());
}

// Enkel per-IP rate limiting i minnet. Fungerar per serverinstans, så på en
// serverless-plattform med flera samtidiga instanser (eller efter en
// cold start) ger den inget hårt tak — men stoppar de billigaste
// spam-/script-bomberna utan att kräva extra infrastruktur.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function stripControlChars(value: string): string {
  return value.replace(/[\r\n\t\0]/g, " ").trim();
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "För många förfrågningar. Försök igen om en stund." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json(
      { error: "Alla obligatoriska fält måste fyllas i." },
      { status: 400 }
    );
  }

  const { email, firstName, lastName, company, jobTitle, companySize, message } = body;

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    console.error("GMAIL_USER / GMAIL_APP_PASSWORD saknas i miljövariablerna.");
    return NextResponse.json(
      { error: "E-postutskick är inte konfigurerat just nu." },
      { status: 500 }
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  const safeCompany = stripControlChars(company);

  const bodyLines = [
    `Namn: ${stripControlChars(firstName)} ${stripControlChars(lastName)}`,
    `Jobbmejl: ${email.trim()}`,
    `Företag: ${safeCompany}`,
    `Titel: ${stripControlChars(jobTitle)}`,
    `Företagsstorlek: ${stripControlChars(companySize)}`,
    `Meddelande: ${message.trim() ? message : "(inget)"}`,
  ];

  try {
    await transporter.sendMail({
      from: gmailUser,
      to: "benjamin@screndo.com",
      replyTo: email.trim(),
      subject: `Demo-förfrågan: ${safeCompany}`,
      text: bodyLines.join("\n"),
    });
  } catch (error) {
    console.error("Misslyckades att skicka bokningsmejl:", error);
    return NextResponse.json(
      { error: "Något gick fel vid utskicket. Försök igen om en stund." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
