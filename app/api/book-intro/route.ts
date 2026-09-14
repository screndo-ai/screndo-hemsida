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

function isValidPayload(body: unknown): body is BookIntroPayload {
  if (typeof body !== "object" || body === null) return false;
  const record = body as Record<string, unknown>;
  return requiredFields.every(
    (field) => typeof record[field] === "string" && record[field].trim().length > 0
  );
}

export async function POST(request: NextRequest) {
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

  const bodyLines = [
    `Namn: ${firstName} ${lastName}`,
    `Jobbmejl: ${email}`,
    `Företag: ${company}`,
    `Titel: ${jobTitle}`,
    `Företagsstorlek: ${companySize}`,
    `Meddelande: ${message.trim() ? message : "(inget)"}`,
  ];

  try {
    await transporter.sendMail({
      from: gmailUser,
      to: "benjamin@screndo.com",
      replyTo: email,
      subject: `Demo-förfrågan: ${company}`,
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
