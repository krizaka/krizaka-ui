// What « Publish » shows (ADR-007 §5): the sections added, removed, moved, whose variant, settings or visibility changed, and the
// look that changed — a list of facts read from two documents, never a guess.
import type { Section, ShopPage } from "../shop/schema";

export type DiffEntry =
  | { kind: "added" | "removed"; key: string; type: string; position: number }
  | { kind: "moved"; key: string; type: string; from: number; to: number }
  | { kind: "variant"; key: string; type: string; from: string; to: string }
  | { kind: "settings" | "blocks" | "text"; key: string; type: string }
  | { kind: "disabled" | "enabled"; key: string; type: string }
  | { kind: "preset"; from: string; to: string }
  | { kind: "density"; from: string | undefined; to: string | undefined };

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** The differences between the published document and the draft, in the draft's reading order. */
export function diffPages(before: ShopPage, after: ShopPage): DiffEntry[] {
  const out: DiffEntry[] = [];
  const was = new Map(before.sections.map((s, i) => [s.key, { s, i }]));
  const is = new Set(after.sections.map((s) => s.key));
  // « moved » is relative: removing a section above must not mark every section under it as moved.
  const kept = before.sections.filter((s) => is.has(s.key)).map((s) => s.key);
  const order = after.sections.filter((s) => was.has(s.key)).map((s) => s.key);
  after.sections.forEach((s: Section, i) => {
    const old = was.get(s.key);
    if (!old) {
      out.push({ kind: "added", key: s.key, type: s.type, position: i });
      return;
    }
    if (kept.indexOf(s.key) !== order.indexOf(s.key)) out.push({ kind: "moved", key: s.key, type: s.type, from: old.i, to: i });
    if (old.s.variant !== s.variant) out.push({ kind: "variant", key: s.key, type: s.type, from: old.s.variant, to: s.variant });
    if (!same(old.s.settings, s.settings)) out.push({ kind: "settings", key: s.key, type: s.type });
    if (!same(old.s.blocks, s.blocks)) out.push({ kind: "blocks", key: s.key, type: s.type });
    if (!same(old.s.text, s.text)) out.push({ kind: "text", key: s.key, type: s.type });
    if (Boolean(old.s.disabled) !== Boolean(s.disabled)) out.push({ kind: s.disabled ? "disabled" : "enabled", key: s.key, type: s.type });
  });
  for (const [key, { s, i }] of was) if (!is.has(key)) out.push({ kind: "removed", key, type: s.type, position: i });
  if (before.preset.id !== after.preset.id || before.preset.version !== after.preset.version) out.push({ kind: "preset", from: before.preset.id, to: after.preset.id });
  if (before.density !== after.density) out.push({ kind: "density", from: before.density, to: after.density });
  return out;
}
