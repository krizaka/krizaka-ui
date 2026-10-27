import * as z from "zod/mini";

/** The owner's words, in each language; the product's message is the fallback when a language is absent. */
export const localizedText = z.object({
  fr: z.optional(z.string().check(z.maxLength(600))),
  en: z.optional(z.string().check(z.maxLength(600))),
});
export type LocalizedText = z.output<typeof localizedText>;
