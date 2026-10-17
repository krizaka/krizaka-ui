/** The words of `Captcha` and `CaptchaDisclosure`, English and French. Pass `labels` to say them otherwise. */
export interface CaptchaLabels {
  /** The accessible name of the check (the group around the widget). */
  readonly group: string;
  /** Said when Cloudflare could not run the check. */
  readonly error: string;
  /** The retry button. */
  readonly retry: string;
  /** « Protected by Cloudflare Turnstile ». */
  readonly protectedBy: string;
  readonly privacy: string;
  readonly terms: string;
}

export const captchaMessages = {
  en: {
    group: "Security check",
    error: "The security check could not run. Check your connection and try again.",
    retry: "Try again",
    protectedBy: "Protected by Cloudflare Turnstile",
    privacy: "Privacy",
    terms: "Terms",
  },
  fr: {
    group: "Vérification de sécurité",
    error: "La vérification de sécurité n'a pas pu s'exécuter. Vérifiez votre connexion et réessayez.",
    retry: "Réessayer",
    protectedBy: "Protégé par Cloudflare Turnstile",
    privacy: "Confidentialité",
    terms: "Conditions",
  },
} as const satisfies Record<string, CaptchaLabels>;

export type CaptchaLocale = keyof typeof captchaMessages;

export const labelsFor = (locale: string | undefined, labels?: Partial<CaptchaLabels>): CaptchaLabels => ({
  ...captchaMessages[locale?.toLowerCase().startsWith("fr") ? "fr" : "en"],
  ...labels,
});
