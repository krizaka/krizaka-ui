// Server-safe (no hook, no React): the value of a text style, its validation and its CSS. A shop owner's choice is stored
// by the app, so the value is plain data and its CSS is built from fixed tables of CSS variables — what comes from a
// database never reaches a style sheet as text. The fonts are the curated roles of @krizaka/fonts (the product theme
// says which family a role is), the sizes are the type scale's steps, the tones are the text roles and the brand hue.
import type { CSSProperties } from "react";
import * as z from "zod/mini";

/** The curated families of `@krizaka/fonts`, by role: `display` (the headlines), `text` (reading), `mono` (the typewriter), `cahier` (the pen). */
export const fontIds = ["display", "text", "mono", "cahier"] as const;
export type FontId = (typeof fontIds)[number];

/** The steps of the type scale, smallest to largest. Never pixels. */
export const sizeSteps = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const;
export type SizeStep = (typeof sizeSteps)[number];

export const textWeights = [400, 500, 600, 700] as const;
export type TextWeight = (typeof textWeights)[number];

export const leadings = ["tight", "normal", "relaxed"] as const;
export type Leading = (typeof leadings)[number];

export const trackings = ["tight", "normal", "wide"] as const;
export type Tracking = (typeof trackings)[number];

export const aligns = ["start", "center", "end"] as const;
export type Align = (typeof aligns)[number];

export const cases = ["none", "upper", "small-caps"] as const;
export type Case = (typeof cases)[number];

/** The text roles of the tokens, and the brand hue. */
export const toneIds = ["primary", "secondary", "muted", "accent"] as const;
export type ToneId = (typeof toneIds)[number];

/** A text style: what a shop owner chooses, stored as it is. */
export type TextStyle = {
  font: FontId;
  size: SizeStep;
  weight: TextWeight;
  leading: Leading;
  tracking: Tracking;
  align: Align;
  case: Case;
  italic: boolean;
  tone: ToneId;
};

/** What `parseTextStyle` answers for anything that is not a text style. */
export const defaultTextStyle: Readonly<TextStyle> = Object.freeze({
  font: "text",
  size: "md",
  weight: 400,
  leading: "normal",
  tracking: "normal",
  align: "start",
  case: "none",
  italic: false,
  tone: "primary",
});

/** The weights each face is cut in: a picker offers these, never a synthesised bold. */
export const fontWeights: Readonly<Record<FontId, readonly TextWeight[]>> = {
  display: [400],
  text: [400, 600, 700],
  mono: [400, 700],
  cahier: [500],
};

const schema = z.object({
  font: z.enum(fontIds),
  size: z.enum(sizeSteps),
  weight: z.union([z.literal(400), z.literal(500), z.literal(600), z.literal(700)]),
  leading: z.enum(leadings),
  tracking: z.enum(trackings),
  align: z.enum(aligns),
  case: z.enum(cases),
  italic: z.boolean(),
  tone: z.enum(toneIds),
});

/**
 * Validates what was stored (or sent): the text style, or `defaultTextStyle` for anything invalid — a free font name, a
 * hex colour, a pixel size, CSS text, a value that is not an object. Keys a text style does not have are dropped; keys it
 * lacks (a value stored before one was added) take their default. Usable on a server.
 */
export function parseTextStyle(input: unknown): TextStyle {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return { ...defaultTextStyle };
  const own = Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined));
  const parsed = schema.safeParse({ ...defaultTextStyle, ...own });
  return parsed.success ? { ...parsed.data } : { ...defaultTextStyle };
}

const rem: Record<SizeStep, string> = { xs: "0.75rem", sm: "0.875rem", md: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem" };
const lineHeight: Record<Leading, string> = { tight: "1.15", normal: "1.4", relaxed: "1.7" };
const letterSpacing: Record<Tracking, string> = { tight: "-0.02em", normal: "0em", wide: "0.08em" };
const textAlign: Record<Align, CSSProperties["textAlign"]> = { start: "start", center: "center", end: "end" };
const tone: Record<ToneId, string> = {
  primary: "var(--kz-text-primary)",
  secondary: "var(--kz-text-secondary)",
  muted: "var(--kz-text-muted)",
  accent: "var(--kz-accent-text)",
};

/** The CSS variable of a text role: the product theme's face for `display`, the preset's for the others. */
export const fontVariable: Readonly<Record<FontId, string>> = {
  display: "var(--kz-font-display)",
  text: "var(--kz-font-text)",
  mono: "var(--kz-font-mono)",
  cahier: "var(--kz-font-cahier)",
};

/** A step's size as a CSS value: `var(--kz-text-style-<step>, <rem>)` — a product may re-cut the scale with the variable. */
export const sizeVariable = (step: SizeStep): string => `var(--kz-text-style-${step}, ${rem[step]})`;

/** A tone's colour as a CSS value: a role of the tokens. */
export const toneVariable = (id: ToneId): string => tone[id];

/** The `className` and `style` that draw a text style. Built from fixed tables of CSS variables only. */
export function textStyleProps(style: unknown): { className: string; style: CSSProperties } {
  const v = parseTextStyle(style);
  return {
    className: "kz-text-style",
    style: {
      fontFamily: fontVariable[v.font],
      fontSize: sizeVariable(v.size),
      fontWeight: v.weight,
      lineHeight: `var(--kz-text-style-leading-${v.leading}, ${lineHeight[v.leading]})`,
      letterSpacing: `var(--kz-text-style-tracking-${v.tracking}, ${letterSpacing[v.tracking]})`,
      textAlign: textAlign[v.align],
      textTransform: v.case === "upper" ? "uppercase" : "none",
      fontVariantCaps: v.case === "small-caps" ? "small-caps" : "normal",
      fontStyle: v.italic ? "italic" : "normal",
      color: toneVariable(v.tone),
    },
  };
}

/** A colour read from the page, as `[r, g, b]` in 0–255, or `null` when it cannot be read (the check then says nothing). */
export function parseColor(text: string): [number, number, number] | null {
  const value = text.trim().toLowerCase();
  const hex = /^#([0-9a-f]{3,8})$/.exec(value)?.[1];
  if (hex && [3, 4, 6, 8].includes(hex.length)) {
    const full = hex.length <= 4 ? [...hex].map((c) => c + c).join("") : hex;
    return [0, 2, 4].map((i) => Number.parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
  }
  const rgb = /^rgba?\(([^)]+)\)$/.exec(value)?.[1];
  if (rgb) {
    const parts = rgb.split(/[\s,/]+/).filter(Boolean).slice(0, 3).map((p) => (p.endsWith("%") ? (Number.parseFloat(p) / 100) * 255 : Number.parseFloat(p)));
    return parts.length === 3 && parts.every(Number.isFinite) ? (parts as [number, number, number]) : null;
  }
  const srgb = /^color\(srgb\s+([^)]+)\)$/.exec(value)?.[1];
  if (srgb) {
    const parts = srgb.split(/[\s/]+/).filter(Boolean).slice(0, 3).map((p) => Number.parseFloat(p) * 255);
    return parts.length === 3 && parts.every(Number.isFinite) ? (parts as [number, number, number]) : null;
  }
  return null;
}

const channel = (c: number) => {
  const s = Math.min(Math.max(c, 0), 255) / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]: [number, number, number]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

/** The WCAG contrast ratio of two colours (1 – 21). */
export function contrastRatio(foreground: [number, number, number], background: [number, number, number]): number {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** The ratio WCAG asks of large text. */
export const largeTextRatio = 3;
/** The ratio WCAG asks of body text. */
export const bodyTextRatio = 4.5;

/** Large text for WCAG: 24 px and over, or bold from 18.66 px (`xl`, 20 px, in bold). */
export function isLargeText(style: Pick<TextStyle, "size" | "weight">): boolean {
  const at = sizeSteps.indexOf(style.size);
  return at >= sizeSteps.indexOf("2xl") || (at >= sizeSteps.indexOf("xl") && style.weight >= 700);
}

/** The ratio a style's text must reach on its surface. */
export const requiredContrast = (style: Pick<TextStyle, "size" | "weight">): number => (isLargeText(style) ? largeTextRatio : bodyTextRatio);

/** True when body text in this step is under the minimum: a warning to show, never a size to force. */
export const isUnderMinimumSize = (size: SizeStep, minimum: SizeStep): boolean => sizeSteps.indexOf(size) < sizeSteps.indexOf(minimum);
