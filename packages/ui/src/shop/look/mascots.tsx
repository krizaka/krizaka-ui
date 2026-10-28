// Server-safe. The Krizaka look's birds (akinaza#478): at most one per section, each one doing its job, never on the first
// screen nor on the pictures. The host asks `mascotFor` and hands the result to the section's `mascot` slot.
import { Mascot, type MascotBird } from "@krizaka/ui/mascots";
import * as React from "react";

import type { Section } from "../schema";

/** The section (and booking variant) that carries a bird, and which: the beaver builds the shop, the owl reads, the falcon watches, the crane listens, the flamingo answers, the pigeon delivers. */
export const MASCOT_SLOTS = {
  "booking:strip": "beaver",
  reviews: "owl",
  policies: "falcon",
  story: "crane",
  faq: "flamingo",
  "booking:closing": "pigeon",
} as const satisfies Record<string, MascotBird>;

/** The bird of a section under a look, or none: only a look with `mascots: "on"`; never the hero, the gallery, the wall or the TV. */
export function mascotFor(section: Pick<Section, "type" | "variant">, look: { mascots?: string } | undefined): MascotBird | undefined {
  if (look?.mascots !== "on") return undefined;
  const slots = MASCOT_SLOTS as Record<string, MascotBird>;
  return slots[`${section.type}:${section.variant}`] ?? (section.type === "booking" ? undefined : slots[section.type]);
}

/** The bird, small, in the brand's accent: decorative (`aria-hidden`), the words stay beside it. */
export function ShopMascot({ bird, size = 56 }: { bird: MascotBird; size?: number }) {
  return <Mascot bird={bird} tone="brand" size={size} life aria-hidden />;
}
