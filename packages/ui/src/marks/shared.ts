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
