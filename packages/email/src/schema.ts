import { z } from "zod";

import { BRAND_IDS, type BrandId } from "./theme";

/** An https URL: the only kind an email carries (no `javascript:`, no `data:`, no plain http). */
export const httpsUrl = z.url({ protocol: /^https$/, hostname: z.regexes.hostname }).max(2048);

/** A name or a title typed by a person: no control characters (they would split a header), bounded. */
// eslint-disable-next-line no-control-regex -- the point of the rule is to refuse control characters
const CONTROL = /[\u0000-\u001f\u007f]/;
export const line = (max: number) => z.string().trim().min(1).max(max).refine((v) => !CONTROL.test(v), "control characters");

/** A longer free text (a visitor's message): line breaks allowed, other control characters refused. */
// eslint-disable-next-line no-control-regex
const CONTROL_EXCEPT_NEWLINE = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
export const text = (max: number) => z.string().trim().min(1).max(max).refine((v) => !CONTROL_EXCEPT_NEWLINE.test(v), "control characters");

export const brandId = z.enum(BRAND_IDS as [BrandId, ...BrandId[]]);

/** What every template takes: the brand it wears, who signs, the postal address and the one-click unsubscribe. */
export const baseSchema = z.object({
  /** The brand: a product email never shows another product. */
  brand: brandId.default("krizaka"),
  /** The postal address of the sender (CASL). Default: « Montréal (Québec), Canada ». */
  address: line(200).optional(),
  /** The signature; default: Oussama for Krizaka, « The <brand> team » for a product. */
  signature: z.object({ name: line(80), role: line(120).optional(), avatarUrl: httpsUrl.optional() }).optional(),
  /** The one-click unsubscribe (required by marketing emails, and added as `List-Unsubscribe` headers). */
  unsubscribeUrl: httpsUrl.optional(),
});

export type BaseProps = z.output<typeof baseSchema>;
