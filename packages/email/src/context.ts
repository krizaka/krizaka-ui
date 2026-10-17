import { createContext, useContext } from "react";

import type { EmailLocale, EmailTranslator } from "./messages";
import type { EmailTheme } from "./theme";

/** The sender every email names (CASL: who sends, and where to reach them). */
export interface LegalSender {
  /** The legal name. */
  name: string;
  /** The postal address. */
  address: string;
}

export interface EmailLinks {
  privacy: string;
  contact: string;
  site: string;
}

export interface EmailSignature {
  name: string;
  role?: string | undefined;
  /** An https image, shown round next to the name. */
  avatarUrl?: string | undefined;
}

export interface EmailContextValue {
  theme: EmailTheme;
  locale: EmailLocale;
  t: EmailTranslator;
  legal: LegalSender;
  links: EmailLinks;
  signature: EmailSignature;
  unsubscribeUrl?: string | undefined;
  /** Why this person receives this email (one sentence, in their language). */
  why: string;
}

const EmailContext = createContext<EmailContextValue | null>(null);
export const EmailProvider = EmailContext.Provider;

export function useEmail(): EmailContextValue {
  const value = useContext(EmailContext);
  if (!value) throw new Error("@krizaka/email: a component was rendered outside an email (use renderEmail).");
  return value;
}
