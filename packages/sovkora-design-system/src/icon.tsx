/**
 * @file icon.tsx
 * @description Centralized polymorphic icon registry for the Sovkora UI.
 *
 * Single ICON_REGISTRY dictionary housing custom-crafted, minimalist geometric
 * SVG paths. Every path uses vector-effect="non-scaling-stroke" for visual
 * thickness consistency during layout motion sweeps.
 *
 * Usage: <Icon name="dashboard" size={20} className="text-accent" />
 *
 * Default: 24×24 viewBox, 1.25px stroke, round caps, currentColor.
 */

import React from "react";

import type { IconName } from "./icon.registry";
import { ICON_REGISTRY } from "./icon.registry";

export type { IconName };

interface IconProps {
  /** Icon identifier from the registry */
  name: IconName;
  /** Pixel size (width & height). Defaults to 20. */
  size?: number;
  /** Additional CSS classes */
  className?: string;
  /** Accessible label — if omitted, icon is decorative (aria-hidden) */
  label?: string;
  /** Drawn when `name` is not in the registry (a key that comes from data, e.g. a Studio's `iconKey`). */
  fallback?: IconName;
}

/**
 * Polymorphic SVG icon wrapper with uniform fallback configuration.
 *
 * - Default fine strokeWidth: 1.25
 * - Round caps and joins
 * - Size control via `size` prop
 * - vector-effect="non-scaling-stroke" on all paths
 *
 * @param props — Icon configuration
 * @returns SVG element with the requested icon path
 */
export function Icon({ name, size = 20, className = "", label, fallback }: Readonly<IconProps>) {
  const paths = ICON_REGISTRY[name] ?? (fallback ? ICON_REGISTRY[fallback] : undefined);
  if (!paths) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={!label}
    >
      {paths}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   ICON_REGISTRY — Minimalist Geometric SVG Paths
   ─────────────────────────────────────────────────────────
   Every path entry features vector-effect="non-scaling-stroke"
   for visual thickness consistency during layout motion sweeps.
   ═══════════════════════════════════════════════════════════ */
