import { describe, expect, it } from "vitest";

import { SECTION_DEFINITIONS } from "../shop/catalogue";
import { SHOP_LIMITS } from "../shop/limits";
import { parseShopPage, type ShopPage } from "../shop/schema";
import { shopStarters } from "../shop/starters";
import { applyCommand, type Command } from "./commands";
import { diffPages } from "./diff";
import { canRedo, canUndo, createHistory, HISTORY_LIMIT, redo, run, undo } from "./history";
import { newKey } from "./keys";

const start = (): ShopPage => structuredClone(shopStarters.salonCompact);
const keys = (p: ShopPage) => p.sections.map((s) => s.key);

describe("the composer's commands", () => {
  it("never mutate the document, and return the same object when nothing changes", () => {
    const page = start();
    const frozen = JSON.stringify(page);
    expect(applyCommand(page, { type: "setVariant", key: "s_services", variant: "cards" })).not.toBe(page);
    expect(JSON.stringify(page)).toBe(frozen);
    expect(applyCommand(page, { type: "setVariant", key: "s_services", variant: "menu" })).toBe(page);
    expect(applyCommand(page, { type: "removeSection", key: "nope" })).toBe(page);
  });

  it("ignores a patch that says nothing new (a form reporting its first values must not be a step)", () => {
    const page = start();
    expect(applyCommand(page, { type: "patchSettings", key: "s_services", patch: { source: "all", columns: 1 } })).toBe(page);
    expect(applyCommand(page, { type: "patchSettings", key: "s_services", patch: { columns: 2 } })).not.toBe(page);
  });

  it("keeps the hero first: nothing moves above it, a second hero is refused, a new hero goes first", () => {
    const page = start();
    expect(keys(applyCommand(page, { type: "moveSection", key: "s_services", to: 0 }))[0]).toBe("s_hero");
    expect(applyCommand(page, { type: "moveSection", key: "s_hero", to: 3 })).toBe(page);
    expect(applyCommand(page, { type: "addSection", sectionType: "hero", key: "s_h2" })).toBe(page);
    const headless: ShopPage = { ...page, sections: page.sections.slice(1) };
    const added = applyCommand(headless, { type: "addSection", sectionType: "hero", key: "s_h2", at: 3 });
    expect(keys(added)[0]).toBe("s_h2");
  });

  it("adds a section with its type's defaults and refuses a variant the type does not have, a duplicate key and a 17th section", () => {
    const page = start();
    const added = applyCommand(page, { type: "addSection", sectionType: "faq", key: "s_faq", at: 2 });
    expect(added.sections[2]).toMatchObject({ key: "s_faq", type: "faq", variant: "list" });
    expect(applyCommand(page, { type: "addSection", sectionType: "faq", key: "s_x", variant: "carousel" })).toBe(page);
    expect(applyCommand(added, { type: "addSection", sectionType: "faq", key: "s_faq" })).toBe(added);
    let full = page;
    for (let i = 0; full.sections.length < SHOP_LIMITS.sections; i++) full = applyCommand(full, { type: "addSection", sectionType: "booking", key: `s_${i}` });
    expect(full.sections.length).toBe(SHOP_LIMITS.sections);
    expect(applyCommand(full, { type: "addSection", sectionType: "booking", key: "s_over" })).toBe(full);
  });

  it("keeps the last section", () => {
    let page: ShopPage = { ...start(), sections: [start().sections[1]!] };
    page = applyCommand(page, { type: "removeSection", key: page.sections[0]!.key });
    expect(page.sections.length).toBe(1);
  });

  it("adds, moves and removes blocks within the type's block kinds and the 24-block limit", () => {
    let page = start();
    const g = "s_photos";
    page = applyCommand(page, { type: "addBlock", key: g, blockKey: "b_1", blockType: "note", settings: { text: "Hi" } });
    page = applyCommand(page, { type: "addBlock", key: g, blockKey: "b_2", blockType: "note", settings: { text: "Yo" } });
    expect(applyCommand(page, { type: "addBlock", key: g, blockKey: "b_3", blockType: "flyer" })).toBe(page);
    page = applyCommand(page, { type: "moveBlock", key: g, blockKey: "b_2", to: 0 });
    expect((page.sections.find((s) => s.key === g)!.blocks as { key: string }[]).map((b) => b.key)).toEqual(["b_2", "b_1"]);
    page = applyCommand(page, { type: "patchBlock", key: g, blockKey: "b_1", patch: { text: "Hello" } });
    expect(JSON.stringify(page)).toContain("Hello");
    page = applyCommand(page, { type: "removeBlock", key: g, blockKey: "b_1" });
    page = applyCommand(page, { type: "removeBlock", key: g, blockKey: "b_2" });
    expect(page.sections.find((s) => s.key === g)!.blocks).toBeUndefined();
    for (let i = 0; i < SHOP_LIMITS.blocks + 3; i++) page = applyCommand(page, { type: "addBlock", key: g, blockKey: `b_${i}`, blockType: "note", settings: { text: "x" } });
    expect((page.sections.find((s) => s.key === g)!.blocks ?? []).length).toBe(SHOP_LIMITS.blocks);
  });

  it("toggles visibility without losing the section, edits the words, and changes the look", () => {
    let page = start();
    page = applyCommand(page, { type: "toggleDisabled", key: "s_reviews" });
    expect(page.sections.find((s) => s.key === "s_reviews")!.disabled).toBe(true);
    page = applyCommand(page, { type: "toggleDisabled", key: "s_reviews" });
    expect(page.sections.find((s) => s.key === "s_reviews")!.disabled).toBeFalsy();
    page = applyCommand(page, { type: "setText", key: "s_services", field: "title", value: { fr: "Nos soins", en: "Our care" } });
    expect(page.sections.find((s) => s.key === "s_services")!.text?.title?.fr).toBe("Nos soins");
    page = applyCommand(page, { type: "setText", key: "s_services", field: "title", value: undefined });
    expect(page.sections.find((s) => s.key === "s_services")!.text).toBeUndefined();
    page = applyCommand(page, { type: "setPreset", preset: { id: "salon-atelier", version: 1 }, density: "airy" });
    expect(page).toMatchObject({ preset: { id: "salon-atelier" }, density: "airy" });
  });
});

describe("history", () => {
  it("undoes and redoes exactly, forgets the future on a new command, and ignores a no-op", () => {
    let h = createHistory(start());
    const initial = h.present;
    h = run(h, { type: "setVariant", key: "s_services", variant: "cards" });
    h = run(h, { type: "moveSection", key: "s_reviews", to: 1 });
    expect(run(h, { type: "setVariant", key: "s_services", variant: "cards" })).toBe(h);
    const final = h.present;
    h = undo(undo(h));
    expect(h.present).toEqual(initial);
    expect(canRedo(h)).toBe(true);
    h = redo(redo(h));
    expect(h.present).toEqual(final);
    h = undo(h);
    h = run(h, { type: "toggleDisabled", key: "s_book" });
    expect(canRedo(h)).toBe(false);
    expect(canUndo(createHistory(initial))).toBe(false);
  });

  it("makes one step of the keystrokes of one field, and a new step once another field is touched", () => {
    let h = createHistory(start());
    const initial = h.present;
    for (const en of ["O", "Ou", "Our"]) h = run(h, { type: "setText", key: "s_services", field: "title", value: { en } }, "text:s_services:title");
    expect(h.past.length).toBe(1);
    h = run(h, { type: "toggleDisabled", key: "s_book" });
    h = run(h, { type: "setText", key: "s_services", field: "title", value: { en: "Our care" } }, "text:s_services:title");
    expect(h.past.length).toBe(3);
    h = undo(undo(undo(h)));
    expect(h.present).toEqual(initial);
  });

  it("keeps 100 steps", () => {
    let h = createHistory(start());
    for (let i = 0; i < HISTORY_LIMIT + 20; i++) h = run(h, { type: "setDensity", density: i % 2 ? "airy" : "compact" });
    expect(h.past.length).toBe(HISTORY_LIMIT);
  });

  // The property: for any random sequence of commands, every step is a valid document, and undoing every step restores the
  // exact initial document, redoing every step the exact final one.
  it("restores the exact document after any random sequence (property test, seeded)", () => {
    for (let seed = 1; seed <= 40; seed++) {
      let state = seed * 2654435761;
      const rnd = () => {
        state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
        return state / 4294967296;
      };
      const pick = <T,>(xs: readonly T[]): T => xs[Math.floor(rnd() * xs.length)]!;
      let h = createHistory(structuredClone(shopStarters[pick(Object.keys(shopStarters) as (keyof typeof shopStarters)[])]));
      const initial = structuredClone(h.present);
      for (let step = 0; step < 60; step++) {
        const page = h.present;
        const sec = pick(page.sections);
        const def = pick(SECTION_DEFINITIONS);
        const cmd: Command = pick<Command>([
          { type: "addSection", sectionType: def.type, key: newKey("s", rnd), at: Math.floor(rnd() * 20) },
          { type: "removeSection", key: sec.key },
          { type: "moveSection", key: sec.key, to: Math.floor(rnd() * 20) - 2 },
          { type: "setVariant", key: sec.key, variant: pick(def.variants as readonly string[]) },
          { type: "toggleDisabled", key: sec.key },
          { type: "setDensity", density: pick(["compact", "airy", undefined] as const) },
          { type: "addBlock", key: sec.key, blockKey: newKey("b", rnd), blockType: pick(["note", "photo", "service", "fact", "flyer"]), settings: { text: "x", mediaId: "m", serviceId: "s", kind: "area" } },
          { type: "setText", key: sec.key, field: "lead", value: pick([undefined, { en: "Hello" }]) },
        ]);
        h = run(h, cmd);
        const parsed = parseShopPage(h.present);
        // the generated starter blocks are valid for their type; a random block that is not valid for the type is the only thing that may fail
        if (!parsed.ok) {
          const onlyBlocks = parsed.issues.every((i) => i.path.includes("blocks"));
          expect(onlyBlocks, `${JSON.stringify(cmd)} → ${JSON.stringify(parsed.issues)}`).toBe(true);
          h = undo(h);
        }
        expect(h.present.sections[0]?.type === "hero" || !h.present.sections.some((s) => s.type === "hero")).toBe(true);
        expect(new Set(keys(h.present)).size).toBe(h.present.sections.length);
      }
      const final = structuredClone(h.present);
      const steps = h.past.length;
      for (let i = 0; i < steps; i++) h = undo(h);
      expect(h.present, `seed ${seed}`).toEqual(initial);
      for (let i = 0; i < steps; i++) h = redo(h);
      expect(h.present, `seed ${seed}`).toEqual(final);
    }
  });
});

describe("diff", () => {
  it("lists what a publish changes: added, removed, moved, variant, settings, visibility, look", () => {
    const before = start();
    let after = applyCommand(before, { type: "setVariant", key: "s_services", variant: "cards" });
    after = applyCommand(after, { type: "removeSection", key: "s_reviews" });
    after = applyCommand(after, { type: "addSection", sectionType: "faq", key: "s_faq", at: 2 });
    after = applyCommand(after, { type: "toggleDisabled", key: "s_book" });
    after = applyCommand(after, { type: "moveSection", key: "s_photos", to: 1 });
    after = applyCommand(after, { type: "setPreset", preset: { id: "salon-atelier", version: 1 } });
    const kinds = diffPages(before, after).map((d) => `${d.kind}:${"key" in d ? d.key : ""}`);
    expect(kinds).toEqual(expect.arrayContaining(["variant:s_services", "removed:s_reviews", "added:s_faq", "disabled:s_book", "moved:s_photos", "preset:"]));
    expect(diffPages(before, before)).toEqual([]);
  });

  it("does not call a section moved because one above it was removed", () => {
    const before = start();
    const after = applyCommand(before, { type: "removeSection", key: "s_times" });
    expect(diffPages(before, after).map((d) => d.kind)).toEqual(["removed"]);
  });
});

describe("keys", () => {
  it("makes a short stable-looking key", () => {
    expect(newKey("s", () => 0)).toBe("s_000000");
    expect(newKey("b")).toMatch(/^b_[0-9a-f]{6}$/);
  });
});
