export interface LocalizedMessage {
  en: string;
  fr: string;
}

/** The message in the person's language (`fr`, `fr-CA` → French), English otherwise. */
export function pickMessage(message: LocalizedMessage | undefined, locale: string | undefined): string | undefined {
  if (!message) return undefined;
  return locale?.toLowerCase().startsWith("fr") ? message.fr : message.en;
}
