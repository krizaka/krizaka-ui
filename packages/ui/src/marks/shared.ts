import { useId } from "react";

export interface MarkProps {
  /** Width and height in pixels. */
  size?: number;
  /** Orbit, pulse and shimmer. Off with `false`; always off under prefers-reduced-motion. */
  animated?: boolean;
  /** An accessible name (the mark becomes an image); without it the mark is decorative. */
  title?: string;
  className?: string;
}

/** A neutral stroke: the host's `--kz-*` token when it has one, else the text colour at a low opacity. */
export const neutral = (token: string, percent: number) => `var(${token}, color-mix(in srgb, currentColor ${percent}%, transparent))`;

/** Ids unique per instance, so several marks on a page never share a gradient. */
export function useIds<K extends string>(prefix: string, keys: readonly K[]): Record<K, string> {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return Object.fromEntries(keys.map((k) => [k, `${prefix}-${k}-${uid}`])) as Record<K, string>;
}

export const a11y = (title?: string) => (title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const });

/** `#rrggbb` + an opacity → `#rrggbbaa` (a brand colour in a CSS shadow). */
export const withAlpha = (hex: string, opacity: number) => `${hex}${Math.round(opacity * 255).toString(16).padStart(2, "0")}`;

/**
 * The family's motion (web), for a mark whose classes start with `prefix`: `<prefix>-orbit` turns the dashed orbit and
 * its node, `<prefix>-core` makes the lit core breathe (a shadow in the brand colour). Still under prefers-reduced-motion.
 */
export const familyMotion = (prefix: string, { spin, breath, color, low, high }: { spin: number; breath: number; color: string; low: number; high: number }) => `
.${prefix}-orbit { transform-origin: 200px 200px; animation: ${prefix}-orbit ${spin}s linear infinite; }
.${prefix}-core { transform-box: fill-box; transform-origin: center; animation: ${prefix}-core ${breath}s ease-in-out infinite; }
@keyframes ${prefix}-orbit { to { transform: rotate(360deg); } }
@keyframes ${prefix}-core {
  0%, 100% { filter: drop-shadow(0 0 6px ${withAlpha(color, low)}); opacity: .92; }
  50% { filter: drop-shadow(0 0 16px ${withAlpha(color, high)}); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) { .${prefix}-orbit, .${prefix}-core { animation: none; } }
`;
