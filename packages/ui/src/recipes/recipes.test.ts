import { readFileSync } from "node:fs";
import { join } from "node:path";

import { themes } from "@krizaka/tokens/native";
import { tv } from "tailwind-variants";

import { badgeRecipe } from "../badge/recipe";
import { buttonRecipe } from "../button/recipe";
import { cardRecipe } from "../card/recipe";
import { chipRecipe } from "../chip/recipe";
import { defineRecipe, nativeRecipe, ROLES, withAlpha } from "./index";

const dark = themes.dark as Readonly<Record<string, string>>;
const light = themes.light as Readonly<Record<string, string>>;

describe("the roles", () => {
  it("name keys that exist in the native theme, in both modes", () => {
    for (const key of Object.values(ROLES)) {
      expect(dark[key], `dark.${key}`).toBeTypeOf("string");
      expect(light[key], `light.${key}`).toBeTypeOf("string");
    }
  });

  it("name Tailwind utilities that the preset defines (the web side of the same token)", () => {
    const css = readFileSync(join(process.cwd(), "..", "tailwind", "index.css"), "utf8");
    for (const role of Object.keys(ROLES)) expect(css, `--color-${role}`).toContain(`--color-${role}:`);
  });
});

describe("withAlpha", () => {
  it("turns a hex colour into rgba and leaves other forms alone", () => {
    expect(withAlpha("#ff8000", 0.5)).toBe("rgba(255,128,0,0.5)");
    expect(withAlpha("rgba(1,2,3,1)", 0.5)).toBe("rgba(1,2,3,1)");
    expect(withAlpha("transparent", 0.5)).toBe("transparent");
  });
});

describe("nativeRecipe", () => {
  const recipe = defineRecipe({
    base: "inline-flex border border-border-default bg-surface-1 text-fg-secondary font-semibold uppercase tracking-wider transition-colors hover:bg-surface-2",
    variants: {
      tone: {
        plain: "",
        loud: "bg-accent text-on-accent ring-1 ring-accent/40 [&>[data-dot]]:bg-success",
        glow: "bg-linear-to-r from-accent to-accent-2 text-on-accent",
        veil: "bg-danger/10 text-fg",
      },
      size: { sm: "h-8 px-3 py-0.5 text-xs", md: "h-10 w-10 min-w-6 gap-1.5 p-4 text-[11px]" },
      pulse: { true: "opacity-80" },
    },
    compoundVariants: [{ tone: "loud", size: "sm", class: "text-lg" }],
    defaultVariants: { tone: "plain", size: "sm" },
  });
  const native = nativeRecipe(recipe);
  const resolve = (props = {}) => native.resolve(props, dark).base!;

  it("reads colours as the roles of the theme, with an opacity", () => {
    expect(resolve().frame).toMatchObject({ backgroundColor: dark.surface1, borderWidth: 1, borderColor: dark.borderDefault });
    expect(resolve().text.color).toBe(dark.textSecondary);
    expect(resolve({ tone: "veil" }).frame.backgroundColor).toBe(withAlpha(dark.danger!, 0.1));
    expect(resolve({ tone: "loud" }).frame.borderColor).toBe(withAlpha(dark.accent!, 0.4));
    expect(resolve({ tone: "loud" }).dot).toBe(dark.success);
  });

  it("lets a variant override the base, and a compound one the variants", () => {
    expect(resolve({ tone: "loud" }).frame.backgroundColor).toBe(dark.accent);
    expect(resolve({ tone: "loud" }).text.fontSize).toBe(18);
    expect(resolve({ tone: "loud", size: "md" }).text.fontSize).toBe(11);
  });

  it("reads sizes in points (Tailwind's unit is 4) and the type", () => {
    expect(resolve().frame).toMatchObject({ height: 32, paddingHorizontal: 12, paddingVertical: 2 });
    expect(resolve().text).toMatchObject({ fontSize: 12, fontWeight: "600", textTransform: "uppercase" });
    expect(resolve({ size: "md" }).frame).toMatchObject({ height: 40, width: 40, minWidth: 24, gap: 6, padding: 16 });
  });

  it("turns tracking in em into points of the font size", () => {
    expect(resolve().text.letterSpacing).toBeCloseTo(0.6);
    expect(resolve({ size: "md" }).text.letterSpacing).toBeCloseTo(0.55);
  });

  it("reads the stops of a gradient", () => {
    expect(resolve({ tone: "glow" }).gradient).toEqual([dark.accent, dark.accent2]);
    expect(resolve().gradient).toBeUndefined();
  });

  it("reads a boolean variant", () => {
    expect(resolve({ pulse: true }).frame.opacity).toBe(0.8);
    expect(resolve({ pulse: false }).frame.opacity).toBeUndefined();
  });

  it("keeps what it cannot draw in `ignored`", () => {
    expect(resolve().ignored).toEqual(["inline-flex", "transition-colors", "hover:bg-surface-2"]);
  });

  it("follows the theme", () => {
    expect(native.resolve({}, light).base!.frame.backgroundColor).toBe(light.surface1);
  });

  it("splits a recipe with slots, and reads the states that change the frame", () => {
    const parts = nativeRecipe(
      defineRecipe({
        slots: {
          base: "bg-surface-1 data-[state=on]:bg-accent-soft data-[state=on]:text-fg disabled:opacity-40",
          label: "text-fg-secondary",
        },
        variants: { size: { sm: { base: "h-7", label: "text-xs" }, md: { base: "h-9", label: "text-sm" } } },
        defaultVariants: { size: "md" },
      }),
    ).resolve({ size: "sm" }, dark);
    expect(parts.base!.frame.height).toBe(28);
    expect(parts.base!.on).toEqual({ frame: { backgroundColor: dark.accentSoft }, text: { color: dark.textPrimary } });
    expect(parts.base!.disabled.frame.opacity).toBe(0.4);
    expect(parts.label!.text).toEqual({ color: dark.textSecondary, fontSize: 12 });
  });

  it("ignores a role that does not exist and a colour the theme lacks", () => {
    const look = nativeRecipe(defineRecipe({ base: "bg-nope text-fg border-nope from-nope [&>[data-dot]]:bg-nope" })).resolve({}, dark).base!;
    expect(look.ignored).toEqual(["bg-nope", "border-nope", "from-nope", "[&>[data-dot]]:bg-nope"]);
    const bare = nativeRecipe(defineRecipe({ base: "bg-accent" })).resolve({}, {}).base!;
    expect(bare.ignored).toEqual(["bg-accent"]);
  });

  it("matches the variants by a list in a compound variant", () => {
    const r = nativeRecipe(defineRecipe({ variants: { tone: { a: "", b: "", c: "" } }, compoundVariants: [{ tone: ["a", "b"], className: "bg-accent" }] }));
    expect(r.resolve({ tone: "b" }, dark).base!.frame.backgroundColor).toBe(dark.accent);
    expect(r.resolve({ tone: "c" }, dark).base!.frame.backgroundColor).toBeUndefined();
  });
});

// The parity of the four recipes the web and the phone share: the same variants resolve on both sides, and what the phone
// cannot draw is only what only the web has (pointer, focus, shadow, layout classes) — never a forgotten token.
const WEB_ONLY =
  /^(?:(?:hover|focus-visible|focus|active|group-hover|motion-safe|motion-reduce|data-loading|data-\[[^\]]+\]|aria-\[[^\]]+\]|disabled|\[&[^\]]*\]+[^:]*):)|^(?:inline-flex|flex|relative|absolute|shrink-0|select-none|items-[a-z]+|justify-[a-z]+|whitespace-(?:nowrap|normal)|max-w-full|text-center|transition(?:-[a-z]+)?|duration-\d+|shadow(?:-[a-z]+)?|backdrop-blur(?:-[a-z]+)?|overflow-hidden|rounded(?:-[a-z0-9[\]-]+)?|\[corner-shape:[a-z]+\]|kz-[a-z-]+|group|flex-col|flex-1|mt-auto)$/;

type Parity = { name: string; recipe: Parameters<typeof nativeRecipe>[0]; slots: string[]; variants: Record<string, string[]> };
const RECIPES: Parity[] = [
  { name: "button", recipe: buttonRecipe, slots: ["base"], variants: { variant: ["primary", "gradient", "secondary", "outline", "ghost", "danger"], size: ["sm", "md", "lg", "icon"], shape: ["rounded", "pill", "cut"] } },
  { name: "badge", recipe: badgeRecipe, slots: ["base"], variants: { tone: ["neutral", "accent", "success", "warning", "danger", "scrim"], size: ["sm", "md"] } },
  { name: "chip", recipe: chipRecipe, slots: ["base"], variants: { size: ["sm", "md"] } },
  { name: "card", recipe: cardRecipe, slots: ["root", "body"], variants: { radius: ["md", "lg", "xl"], tone: ["default", "elevated", "glass"], padding: ["none", "sm", "md", "lg"] } },
];

describe.each(RECIPES)("$name: the web and the phone share one recipe", ({ recipe, slots, variants }) => {
  const web = tv(recipe as Parameters<typeof tv>[0]) as unknown as { variants: Record<string, Record<string, unknown>> };
  const native = nativeRecipe(recipe);

  it("has on the phone exactly the variants it has on the web", () => {
    expect(Object.fromEntries(Object.entries(web.variants).filter(([key]) => key in variants).map(([key, values]) => [key, Object.keys(values)]))).toEqual(variants);
  });

  it("resolves every variant, in both modes, on roles that exist", () => {
    for (const [dimension, values] of Object.entries(variants)) {
      for (const value of values) {
        for (const theme of [dark, light]) {
          const looks = native.resolve({ [dimension]: value }, theme);
          for (const slot of slots) {
            const look = looks[slot]!;
            expect(look, `${dimension}=${value} ${slot}`).toBeDefined();
            for (const colourValue of [look.frame.backgroundColor, look.frame.borderColor, look.text.color, look.dot, ...(look.gradient ?? [])]) {
              if (colourValue !== undefined) expect(colourValue).toMatch(/^(#|rgba?\(|transparent)/);
            }
          }
        }
      }
    }
  });

  it("leaves unresolved on the phone only what only the web has", () => {
    for (const [dimension, values] of Object.entries(variants)) {
      for (const value of values) {
        const looks = native.resolve({ [dimension]: value }, dark);
        for (const slot of slots) {
          for (const cls of looks[slot]!.ignored) expect(cls, `${dimension}=${value} ${slot}: "${cls}" is neither mapped nor declared web-only`).toMatch(WEB_ONLY);
        }
      }
    }
  });
});

describe("what the phone wears (as the hand-written look() functions did)", () => {
  const button = (props: Record<string, string>) => nativeRecipe(buttonRecipe).resolve(props, dark).base!;
  it("buttons: the six looks and the three sizes", () => {
    expect(button({ variant: "primary" })).toMatchObject({ frame: { backgroundColor: dark.accent }, text: { color: dark.onAccent } });
    expect(button({ variant: "gradient" }).gradient).toEqual([dark.accent, dark.accent2]);
    expect(button({ variant: "secondary" })).toMatchObject({ frame: { backgroundColor: dark.surface2, borderColor: dark.borderDefault, borderWidth: 1 }, text: { color: dark.textPrimary } });
    expect(button({ variant: "outline" }).frame).toMatchObject({ backgroundColor: "transparent", borderColor: dark.borderDefault });
    expect(button({ variant: "ghost" }).text.color).toBe(dark.textSecondary);
    expect(button({ variant: "danger" })).toMatchObject({ frame: { backgroundColor: withAlpha(dark.danger!, 0.1), borderColor: withAlpha(dark.danger!, 0.5) }, text: { color: dark.textPrimary } });
    expect([button({ size: "sm" }), button({ size: "md" }), button({ size: "lg" })].map((l) => [l.frame.height, l.frame.paddingHorizontal, l.text.fontSize])).toEqual([
      [32, 12, 12],
      [40, 16, 14],
      [48, 24, 14],
    ]);
  });

  it("badges: soft tones with a tinted ring and a coloured dot", () => {
    const badge = (tone: string, size = "sm") => nativeRecipe(badgeRecipe).resolve({ tone, size }, dark).base!;
    expect(badge("accent")).toMatchObject({ frame: { backgroundColor: dark.accentSoft, borderColor: withAlpha(dark.accent!, 0.4) }, dot: dark.accent, text: { color: dark.textPrimary } });
    expect(badge("danger").frame.backgroundColor).toBe(withAlpha(dark.danger!, 0.15));
    expect(badge("scrim")).toMatchObject({ frame: { backgroundColor: dark.scrim }, text: { color: dark.textOnMedia } });
    expect(badge("neutral").text.color).toBe(dark.textSecondary);
    expect([badge("neutral", "sm"), badge("neutral", "md")].map((l) => [l.frame.paddingHorizontal, l.frame.paddingVertical, l.text.fontSize])).toEqual([
      [8, 2, 10],
      [10, 4, 11],
    ]);
  });

  it("chips: a quiet pill, an accent one when chosen", () => {
    const chip = nativeRecipe(chipRecipe).resolve({ size: "md" }, dark).base!;
    expect(chip.frame).toMatchObject({ backgroundColor: dark.surface1, borderColor: dark.borderDefault, height: 36, paddingHorizontal: 14 });
    expect(chip.on).toEqual({ frame: { borderColor: dark.accent, backgroundColor: dark.accentSoft }, text: { color: dark.textPrimary } });
    expect(nativeRecipe(chipRecipe).resolve({ size: "sm" }, dark).base!.frame.height).toBe(28);
  });

  it("cards: the raised surface, one step higher when elevated, and the body's padding", () => {
    const card = (props: Record<string, string>) => nativeRecipe(cardRecipe).resolve(props, dark);
    expect(card({}).root!.frame).toMatchObject({ backgroundColor: dark.surface1, borderColor: dark.borderDefault });
    expect(card({ tone: "elevated" }).root!.frame.backgroundColor).toBe(dark.surface2);
    expect(["none", "sm", "md", "lg"].map((padding) => card({ padding }).body!.frame.padding)).toEqual([0, 12, 16, 24]);
  });
});
