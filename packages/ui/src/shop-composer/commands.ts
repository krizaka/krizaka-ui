// The composer's commands (ADR-007 §5): every change of the document is a pure command on a reducer — never a mutation —
// so undo / redo restore the exact document, and the rules of the document (a hero first, 16 sections, 24 blocks, the variants
// of a type) hold after every step. A command that would break a rule is a no-op: the page stays valid, always.
import { SECTION_DEFINITIONS, sectionDefinition,type SectionType } from "../shop/catalogue";
import { SHOP_LIMITS } from "../shop/limits";
import { applyLook, type ShopLookLike } from "../shop/look/apply-look";
import type { Section, ShopPage } from "../shop/schema";
import type { LocalizedText } from "../shop/text";

type Rec = Record<string, unknown>;

export type Command =
  /** Adds a section (its type's default settings, the given or the default variant) at an index; a hero goes first. */
  | { type: "addSection"; sectionType: SectionType; key: string; variant?: string; at?: number; settings?: Rec }
  | { type: "removeSection"; key: string }
  /** Moves a section to an absolute index (the hero stays first: nothing goes above it). */
  | { type: "moveSection"; key: string; to: number }
  | { type: "setVariant"; key: string; variant: string }
  /** Merges into the settings. */
  | { type: "patchSettings"; key: string; patch: Rec }
  | { type: "setText"; key: string; field: "title" | "lead"; value: LocalizedText | undefined }
  | { type: "toggleDisabled"; key: string }
  | { type: "setPreset"; preset: { id: string; version: number }; density?: "compact" | "airy" | null }
  | { type: "setDensity"; density: "compact" | "airy" | undefined }
  /** A whole look (`look-*`): the variants of the sections, nothing of their content (`applyLook`). */
  | { type: "applyLook"; look: ShopLookLike }
  /** The accent within the look's tested list. */
  | { type: "setAccent"; accent: string | undefined }
  | { type: "addBlock"; key: string; blockKey: string; blockType: string; settings?: Rec; at?: number }
  | { type: "removeBlock"; key: string; blockKey: string }
  | { type: "moveBlock"; key: string; blockKey: string; to: number }
  | { type: "patchBlock"; key: string; blockKey: string; patch: Rec };

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);
const indexOfKey = (page: ShopPage, key: string) => page.sections.findIndex((s) => s.key === key);

/** The array with an item moved to an index. */
export function moved<T>(list: readonly T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(clamp(to, 0, next.length), 0, item as T);
  return next;
}

function withSection(page: ShopPage, key: string, change: (s: Section) => Section): ShopPage {
  const i = indexOfKey(page, key);
  if (i < 0) return page;
  const next = change(page.sections[i]!);
  if (next === page.sections[i]) return page;
  const sections = [...page.sections];
  sections[i] = next;
  return { ...page, sections };
}

type Handler<T extends Command["type"]> = (page: ShopPage, cmd: Extract<Command, { type: T }>) => ShopPage;

const addSection: Handler<"addSection"> = (page, cmd) => {
  const def = SECTION_DEFINITIONS.find((d) => d.type === cmd.sectionType);
  if (!def || page.sections.length >= SHOP_LIMITS.sections || page.sections.some((s) => s.key === cmd.key)) return page;
  const variant = cmd.variant ?? def.defaultVariant;
  if (!(def.variants as readonly string[]).includes(variant)) return page;
  const isHero = def.type === "hero";
  if (isHero && page.sections.some((s) => s.type === "hero")) return page;
  const heroFirst = page.sections[0]?.type === "hero";
  const at = isHero ? 0 : clamp(cmd.at ?? page.sections.length, heroFirst ? 1 : 0, page.sections.length);
  const section = { key: cmd.key, type: def.type, variant, settings: { ...(def.settingsDefault as Rec), ...cmd.settings } } as unknown as Section;
  const sections = [...page.sections];
  sections.splice(at, 0, section);
  return { ...page, sections };
};

const removeSection: Handler<"removeSection"> = (page, cmd) => {
  if (indexOfKey(page, cmd.key) < 0 || page.sections.length <= 1) return page;
  return { ...page, sections: page.sections.filter((s) => s.key !== cmd.key) };
};

const moveSection: Handler<"moveSection"> = (page, cmd) => {
  const from = indexOfKey(page, cmd.key);
  if (from < 0 || page.sections[from]!.type === "hero") return page;
  const lo = page.sections[0]?.type === "hero" ? 1 : 0;
  const to = clamp(cmd.to, lo, page.sections.length - 1);
  return to === from ? page : { ...page, sections: moved(page.sections, from, to) };
};

const setVariant: Handler<"setVariant"> = (page, cmd) =>
  withSection(page, cmd.key, (s) => {
    const def = sectionDefinition(s.type);
    if (s.variant === cmd.variant || !(def.variants as readonly string[]).includes(cmd.variant)) return s;
    return { ...s, variant: cmd.variant } as Section;
  });

/** Whether every value of a patch is already the one the object holds. */
const saysNothingNew = (current: Rec, patch: Rec) => Object.entries(patch).every(([k, v]) => JSON.stringify(current[k]) === JSON.stringify(v));

const patchSettings: Handler<"patchSettings"> = (page, cmd) =>
  withSection(page, cmd.key, (s) => {
    const current = s.settings as Rec;
    // Nothing to say when every value is already the document's (a form that reports its first values after an undo).
    return saysNothingNew(current, cmd.patch) ? s : ({ ...s, settings: { ...current, ...cmd.patch } } as Section);
  });

const setText: Handler<"setText"> = (page, cmd) =>
  withSection(page, cmd.key, (s) => {
    const text = { ...(s.text ?? {}) } as Rec;
    if (cmd.value === undefined) delete text[cmd.field];
    else text[cmd.field] = cmd.value;
    const next = { ...s } as Rec;
    if (Object.keys(text).length === 0) delete next.text;
    else next.text = text;
    return next as unknown as Section;
  });

const toggleDisabled: Handler<"toggleDisabled"> = (page, cmd) => withSection(page, cmd.key, (s) => ({ ...s, disabled: s.disabled ? undefined : true }) as Section);

const setPreset: Handler<"setPreset"> = (page, cmd) => {
  if (page.preset.id === cmd.preset.id && page.preset.version === cmd.preset.version && cmd.density === undefined) return page;
  let density: Partial<Pick<ShopPage, "density">> = {};
  if (cmd.density === null) density = { density: undefined };
  else if (cmd.density) density = { density: cmd.density };
  return { ...page, preset: { ...cmd.preset }, ...density };
};

const setDensity: Handler<"setDensity"> = (page, cmd) => (page.density === cmd.density ? page : { ...page, density: cmd.density });

const applyLookCmd: Handler<"applyLook"> = (page, cmd) => applyLook(page, cmd.look);

const setAccent: Handler<"setAccent"> = (page, cmd) => (page.accent === cmd.accent ? page : { ...page, accent: cmd.accent });

type Keyed = { key: string; type?: string; settings?: Rec };

const addBlock: Handler<"addBlock"> = (page, cmd) =>
  withSection(page, cmd.key, (s) => {
    const def = sectionDefinition(s.type);
    const blocks = (s.blocks ?? []) as readonly Keyed[];
    if (!(def.blockTypes as readonly string[]).includes(cmd.blockType) || blocks.length >= SHOP_LIMITS.blocks || blocks.some((b) => b.key === cmd.blockKey)) return s;
    const next = [...blocks];
    next.splice(clamp(cmd.at ?? blocks.length, 0, blocks.length), 0, { key: cmd.blockKey, type: cmd.blockType, settings: { ...cmd.settings } });
    return { ...s, blocks: next } as unknown as Section;
  });

const removeBlock: Handler<"removeBlock"> = (page, cmd) =>
  withSection(page, cmd.key, (s) => {
    const blocks = (s.blocks ?? []) as readonly Keyed[];
    if (!blocks.some((b) => b.key === cmd.blockKey)) return s;
    const next = blocks.filter((b) => b.key !== cmd.blockKey);
    return { ...s, blocks: next.length > 0 ? next : undefined } as unknown as Section;
  });

const moveBlock: Handler<"moveBlock"> = (page, cmd) =>
  withSection(page, cmd.key, (s) => {
    const blocks = (s.blocks ?? []) as readonly Keyed[];
    const from = blocks.findIndex((b) => b.key === cmd.blockKey);
    const to = clamp(cmd.to, 0, blocks.length - 1);
    return from < 0 || from === to ? s : ({ ...s, blocks: moved(blocks, from, to) } as unknown as Section);
  });

const patchBlock: Handler<"patchBlock"> = (page, cmd) =>
  withSection(page, cmd.key, (s) => {
    const blocks = (s.blocks ?? []) as readonly Keyed[];
    const block = blocks.find((b) => b.key === cmd.blockKey);
    if (!block || saysNothingNew(block.settings ?? {}, cmd.patch)) return s;
    return { ...s, blocks: blocks.map((b) => (b === block ? { ...b, settings: { ...b.settings, ...cmd.patch } } : b)) } as unknown as Section;
  });

const handlers: { [T in Command["type"]]: Handler<T> } = {
  addSection, removeSection, moveSection, setVariant, patchSettings, setText, toggleDisabled, setPreset, setDensity, applyLook: applyLookCmd, setAccent, addBlock, removeBlock, moveBlock, patchBlock,
};

/** Applies a command to a document; returns the same object when nothing changes. */
export function applyCommand(page: ShopPage, cmd: Command): ShopPage {
  return (handlers[cmd.type] as (page: ShopPage, cmd: Command) => ShopPage)(page, cmd);
}
