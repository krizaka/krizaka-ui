import type { ReactNode } from "react";
import type { z } from "zod";

import type { EmailTranslator } from "./messages";

/**
 * - `marketing`: sent to a list; must carry an unsubscribe link (CASL, Gmail and Yahoo's bulk-sender rules).
 * - `transactional`: asked for by the person, one at a time (a confirmation, a sign-in link, an auto-reply).
 * - `internal`: for the team, never for a customer.
 */
export type EmailCategory = "marketing" | "transactional" | "internal";

export interface TemplateDefinition<S extends z.ZodType<{ brand: string }>> {
  category: EmailCategory;
  schema: S;
  subject: (props: z.output<S>, t: EmailTranslator) => string;
  preheader: (props: z.output<S>, t: EmailTranslator) => string;
  /** Why this person receives this email, in a sentence (the footer). */
  why: (props: z.output<S>, t: EmailTranslator) => string;
  /** The body of the card: heading, text, button, fallback link, signature. */
  Body: (props: z.output<S>) => ReactNode;
  /** A realistic example, for the preview and the tests. */
  example: z.input<S>;
}

export function defineTemplate<S extends z.ZodType<{ brand: string }>>(definition: TemplateDefinition<S>): TemplateDefinition<S> {
  return definition;
}
