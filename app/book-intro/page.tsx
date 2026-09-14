"use client";

import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/LanguageContext";
import { useEffect, useRef, useState, FormEvent } from "react";

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 13l4 4L19 7" />
  </svg>
);

// Bekräftelsesekvensen: pill -> cirkel (håller ~700ms) -> hela blocket
// tonar bort -> bekräftelsetext tonar in. Ingen sidledes rörelse: knappen
// ligger i en flex-centrerad wrapper så krympningen sker symmetriskt.
const MORPH_MS = 320;
const HOLD_MS = 700;
const FADE_MS = 400;

const inputStyle: React.CSSProperties = {
  borderRadius: "100px",
  border: "1px solid #ECECEC",
  padding: "14px 20px",
  fontSize: "15px",
  background: "#F8F7F4",
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
  fontFamily: "inherit",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  borderRadius: "16px",
  resize: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 500,
  color: "#0A0A0A",
  marginBottom: "6px",
  display: "block",
};

const errorStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#FF6B5C",
  marginTop: "6px",
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "20px",
};

type Fields = {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  jobTitle: string;
  companySize: string;
  message: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

const required: (keyof Fields)[] = [
  "email",
  "firstName",
  "lastName",
  "company",
  "jobTitle",
  "companySize",
];

function BookIntroForm() {
  const { t } = useLanguage();
  const [fields, setFields] = useState<Fields>({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    jobTitle: "",
    companySize: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // vila: vanligt formulär. cirkel: knappen har morphat till en grön cirkel.
  // hiding: hela blocket tonar bort. confirmed: bekräftelsetexten visas.
  const [phase, setPhase] = useState<"vila" | "cirkel" | "hiding" | "confirmed">("vila");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function set(key: keyof Fields, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): Errors {
    const e: Errors = {};
    for (const key of required) {
      if (!fields[key].trim()) {
        e[key] = t.validationError;
      }
    }
    return e;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/book-intro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || t.submitErrorMessage);
      }

      setPhase("cirkel");
      timers.current.push(
        setTimeout(() => setPhase("hiding"), MORPH_MS + HOLD_MS),
        setTimeout(() => setPhase("confirmed"), MORPH_MS + HOLD_MS + FADE_MS)
      );
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t.submitErrorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  if (phase === "confirmed") {
    return (
      <div
        className="bi-fade-in"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <h1
          className="book-intro-h1"
          style={{
            fontWeight: 700,
            fontSize: "36px",
            letterSpacing: "-0.01em",
            marginBottom: "8px",
            marginTop: 0,
          }}
        >
          {t.confirmHeadline}
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#6B6B6B",
            marginTop: 0,
            marginBottom: 0,
          }}
        >
          {t.confirmSubline}
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", width: "100%" }}>
      <div
        style={{
          opacity: phase === "hiding" ? 0 : 1,
          transition: `opacity ${FADE_MS}ms ease`,
          pointerEvents: phase === "vila" ? "auto" : "none",
        }}
      >
        <h1
          className="book-intro-h1"
          style={{
            fontWeight: 700,
            fontSize: "36px",
            letterSpacing: "-0.01em",
            marginBottom: "8px",
            marginTop: 0,
          }}
        >
          {t.pageHeadline}
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#6B6B6B",
            marginBottom: "48px",
            marginTop: 0,
          }}
        >
          {t.pageSubline}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Work email */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              {t.workEmail} <span style={{ color: "#FF6B5C" }}>*</span>
            </label>
            <input
              type="email"
              value={fields.email}
              onChange={(e) => set("email", e.target.value)}
              style={inputStyle}
            />
            {errors.email && <span style={errorStyle}>{errors.email}</span>}
          </div>

          {/* First name + Last name */}
          <div
            className="book-intro-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={labelStyle}>
                {t.firstName} <span style={{ color: "#FF6B5C" }}>*</span>
              </label>
              <input
                type="text"
                value={fields.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                style={inputStyle}
              />
              {errors.firstName && (
                <span style={errorStyle}>{errors.firstName}</span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={labelStyle}>
                {t.lastName} <span style={{ color: "#FF6B5C" }}>*</span>
              </label>
              <input
                type="text"
                value={fields.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                style={inputStyle}
              />
              {errors.lastName && (
                <span style={errorStyle}>{errors.lastName}</span>
              )}
            </div>
          </div>

          {/* Company name + Job title */}
          <div
            className="book-intro-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={labelStyle}>
                {t.companyName} <span style={{ color: "#FF6B5C" }}>*</span>
              </label>
              <input
                type="text"
                value={fields.company}
                onChange={(e) => set("company", e.target.value)}
                style={inputStyle}
              />
              {errors.company && (
                <span style={errorStyle}>{errors.company}</span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={labelStyle}>
                {t.jobTitle} <span style={{ color: "#FF6B5C" }}>*</span>
              </label>
              <input
                type="text"
                value={fields.jobTitle}
                onChange={(e) => set("jobTitle", e.target.value)}
                style={inputStyle}
              />
              {errors.jobTitle && (
                <span style={errorStyle}>{errors.jobTitle}</span>
              )}
            </div>
          </div>

          {/* Company size */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              {t.companySize} <span style={{ color: "#FF6B5C" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={fields.companySize}
                onChange={(e) => set("companySize", e.target.value)}
                style={{
                  ...inputStyle,
                  appearance: "none",
                  paddingRight: "44px",
                  cursor: "pointer",
                }}
              >
                <option value="">{t.selectPlaceholder}</option>
                <option value="0-49">{t.size1}</option>
                <option value="50-149">{t.size2}</option>
                <option value="150-299">{t.size3}</option>
                <option value="300-499">{t.size4}</option>
                <option value="500+">{t.size5}</option>
              </select>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="#6B6B6B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {errors.companySize && (
              <span style={errorStyle}>{errors.companySize}</span>
            )}
          </div>

          {/* Message */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              {t.textareaLabel}
            </label>
            <textarea
              rows={4}
              value={fields.message}
              onChange={(e) => set("message", e.target.value)}
              style={textareaStyle}
            />
          </div>

          {/* Submit: pill -> cirkel vid lyckat inskick. Knappen ligger i en
              flex-centrerad wrapper så krympningen sker symmetriskt kring
              sin egen mittpunkt, ingen sidledes rörelse. */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="submit"
              disabled={submitting || phase !== "vila"}
              style={{
                position: "relative",
                overflow: "hidden",
                boxSizing: "border-box",
                width: phase === "vila" ? "100%" : "52px",
                height: "52px",
                background: phase === "vila" ? "#0A0A0A" : "#0f6e56",
                color: "#fff",
                fontWeight: 600,
                fontSize: "16px",
                borderRadius: phase === "vila" ? "100px" : "50%",
                border: "none",
                cursor: submitting || phase !== "vila" ? "default" : "pointer",
                opacity: submitting && phase === "vila" ? 0.6 : 1,
                fontFamily: "inherit",
                marginTop: "8px",
                transition: `width ${MORPH_MS}ms ease-out, border-radius ${MORPH_MS}ms ease-out, background-color ${MORPH_MS}ms ease-out`,
              }}
            >
              <span
                style={{
                  display: "block",
                  opacity: phase === "vila" ? 1 : 0,
                  transition: "opacity 120ms linear",
                }}
              >
                {submitting ? t.submitButtonLoading : t.submitButton}
              </span>
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: phase === "vila" ? 0 : 1,
                  transition:
                    phase === "vila"
                      ? "opacity 160ms linear"
                      : "opacity 160ms linear 180ms",
                  pointerEvents: "none",
                }}
              >
                <CheckIcon />
              </span>
            </button>
          </div>

          {submitError && (
            <p style={{ ...errorStyle, marginTop: "16px", textAlign: "center" }}>
              {submitError}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default function BookIntro() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <Navbar />
      <div
        className="book-intro-wrap"
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "80px 24px",
        }}
      >
        <BookIntroForm />
      </div>
    </div>
  );
}
