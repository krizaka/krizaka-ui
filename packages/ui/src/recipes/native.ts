// The native side of a recipe: the classes of its variants, read into the styles React Native takes, on the roles of the
// theme. Pure (no React Native, no theme import): the components wrap the result in `StyleSheet` and pass the theme.
// What a phone has no use for (`hover:`, `focus-visible:`, shadows, transitions, the layout classes) is returned in
// `ignored`, so a test can tell the classes that only the web has from the ones that were forgotten.
import { FONT_WEIGHTS, type RoleName, ROLES, TEXT_SIZES, TRACKING } from "./roles";

/** The colour roles of a native theme (`Theme` of `@krizaka/ui/native`): a key, a colour. */
export type ThemeColors = Readonly<Record<string, string>>;

export type NativeFrame = {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  height?: number;
  width?: number;
  minWidth?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  padding?: number;
  gap?: number;
  opacity?: number;
};

export type NativeText = {
  color?: string;
  fontSize?: number;
  fontWeight?: "400" | "500" | "600" | "700" | "800" | "900";
  letterSpacing?: number;
  textTransform?: "uppercase" | "lowercase" | "capitalize";
};

/** What one part of a component looks like: its frame (a View), its text, and the states that change them. */
export type NativeLook = {
  frame: NativeFrame;
  text: NativeText;
  /** `bg-<role>` of the part's dot (`[&>[data-dot]]:bg-accent`): the colour of a status dot. */
  dot?: string;
  /** `bg-linear-to-r from-<role> to-<role>`: the two stops of a gradient fill. */
  gradient?: readonly [string, string];
  /** `disabled:` — the frame and text while disabled. */
  disabled: { frame: NativeFrame; text: NativeText };
  /** `data-[state=on]:` — the frame and text while selected / pressed on. */
  on: { frame: NativeFrame; text: NativeText };
  /** The classes with no native meaning (the web's pointer states, shadows, layout…). */
  ignored: string[];
};

type Props = Readonly<Record<string, string | number | boolean | null | undefined>>;
type Slot = string | readonly unknown[] | null | undefined;
type Config = {
  base?: Slot;
  slots?: Readonly<Record<string, Slot>>;
  variants?: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
  defaultVariants?: Readonly<Record<string, unknown>>;
  compoundVariants?: readonly Readonly<Record<string, unknown>>[];
};

const BASE = "base";

const words = (value: unknown): string[] => (typeof value === "string" ? value.split(/\s+/).filter(Boolean) : Array.isArray(value) ? value.flatMap(words) : []);

/** `#rrggbb` at an opacity (`rgba()`); any other form passes through. */
export function withAlpha(color: string, opacity: number): string {
  const hex = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(color);
  if (!hex) return color;
  const [r, g, b] = hex.slice(1).map((part) => parseInt(part, 16));
  return `rgba(${r},${g},${b},${opacity})`;
}

/** The slots of a config: `slots` when it has some, else the single `base`. */
function slotNames(config: Config): string[] {
  return config.slots ? Object.keys(config.slots) : [BASE];
}

/** The classes of each slot for some props: base, the chosen variants (defaults first), then the compound ones. */
function classesFor(config: Config, props: Props): Record<string, string[]> {
  const names = slotNames(config);
  const out: Record<string, string[]> = Object.fromEntries(names.map((name) => [name, config.slots ? words(config.slots[name]) : words(config.base)]));
  // A string (or a list) is for the base; an object names the slots it is for.
  const add = (value: unknown) => {
    if (typeof value === "string" || Array.isArray(value)) (out[BASE] ??= []).push(...words(value));
    else if (value && typeof value === "object") for (const [name, classes] of Object.entries(value)) (out[name] ??= []).push(...words(classes));
  };
  const chosen = { ...config.defaultVariants, ...Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined)) } as Record<string, unknown>;
  for (const [dimension, values] of Object.entries(config.variants ?? {})) {
    const key = String(chosen[dimension]);
    if (key in values) add(values[key]);
  }
  for (const compound of config.compoundVariants ?? []) {
    const { class: a, className: b, ...conditions } = compound as Record<string, unknown>;
    const matches = Object.entries(conditions).every(([dimension, expected]) => (Array.isArray(expected) ? expected.map(String).includes(String(chosen[dimension])) : String(chosen[dimension]) === String(expected)));
    if (matches) add(a ?? b);
  }
  return out;
}

const empty = (): NativeLook => ({ frame: {}, text: {}, disabled: { frame: {}, text: {} }, on: { frame: {}, text: {} }, ignored: [] });

/** `3` → 12, `0.5` → 2, `3.5` → 14: Tailwind's spacing unit is 4. */
const unit = (value: string): number | undefined => (/^\d+(\.\d+)?$/.test(value) ? Number(value) * 4 : undefined);

/** `accent`, `accent/40`, `transparent` → a colour of the theme, or `undefined` when it is not a role. */
function colour(name: string, theme: ThemeColors): string | undefined {
  const [role, percent] = name.split("/");
  if (role === "transparent") return "transparent";
  if (!role || !(role in ROLES)) return undefined;
  const resolved = theme[ROLES[role as RoleName]];
  if (resolved === undefined) return undefined;
  return percent === undefined ? resolved : withAlpha(resolved, Number(percent) / 100);
}

/** Reads one class into a look. Returns `false` when the class means nothing natively. */
function apply(look: NativeLook, cls: string, theme: ThemeColors): boolean {
  // States: `disabled:` and `data-[state=on]:` are kept apart; every other prefix is a pointer, focus or media state.
  let target: { frame: NativeFrame; text: NativeText } = look;
  let utility = cls;
  if (cls.startsWith("disabled:")) {
    target = look.disabled;
    utility = cls.slice("disabled:".length);
  } else if (cls.startsWith("data-[state=on]:")) {
    target = look.on;
    utility = cls.slice("data-[state=on]:".length);
  } else if (cls.startsWith("[&>[data-dot]]:bg-")) {
    const dot = colour(cls.slice("[&>[data-dot]]:bg-".length), theme);
    if (dot === undefined) return false;
    look.dot = dot;
    return true;
  }
  if (utility.includes(":") || utility.startsWith("[&")) return false;

  const { frame, text } = target;
  let match: RegExpExecArray | null;
  if (utility.startsWith("bg-linear-to-")) return true;
  if ((match = /^bg-(.+)$/.exec(utility))) {
    const value = colour(match[1]!, theme);
    if (value === undefined) return false;
    frame.backgroundColor = value;
    return true;
  }
  if ((match = /^text-(.+)$/.exec(utility))) {
    const arbitrary = /^\[(\d+(?:\.\d+)?)px\]$/.exec(match[1]!);
    if (arbitrary) return ((text.fontSize = Number(arbitrary[1])), true);
    if (match[1]! in TEXT_SIZES) return ((text.fontSize = TEXT_SIZES[match[1] as keyof typeof TEXT_SIZES]), true);
    const value = colour(match[1]!, theme);
    if (value === undefined) return false;
    text.color = value;
    return true;
  }
  if (utility === "border") return ((frame.borderWidth = 1), true);
  if ((match = /^(?:border|ring)-(.+)$/.exec(utility))) {
    if (match[1] === "1") return ((frame.borderWidth = 1), true);
    if (match[1] === "inset") return true;
    const value = colour(match[1]!, theme);
    if (value === undefined) return false;
    frame.borderColor = value;
    return true;
  }
  if (utility === "ring-inset") return true;
  if ((match = /^(h|w|min-w|px|py|p|gap)-(\d+(?:\.\d+)?)$/.exec(utility))) {
    const points = unit(match[2]!)!;
    const key = { h: "height", w: "width", "min-w": "minWidth", px: "paddingHorizontal", py: "paddingVertical", p: "padding", gap: "gap" }[match[1]!] as keyof NativeFrame;
    (frame as Record<string, number>)[key] = points;
    return true;
  }
  if ((match = /^opacity-(\d+)$/.exec(utility))) return ((frame.opacity = Number(match[1]) / 100), true);
  if ((match = /^font-(.+)$/.exec(utility)) && match[1]! in FONT_WEIGHTS) return ((text.fontWeight = FONT_WEIGHTS[match[1] as keyof typeof FONT_WEIGHTS]), true);
  if ((match = /^tracking-(.+)$/.exec(utility)) && match[1]! in TRACKING) return ((text.letterSpacing = TRACKING[match[1] as keyof typeof TRACKING]), true);
  if (utility === "uppercase" || utility === "lowercase" || utility === "capitalize") return ((text.textTransform = utility), true);
  if ((match = /^(from|to)-(.+)$/.exec(utility))) {
    const value = colour(match[2]!, theme);
    if (value === undefined) return false;
    const stops = [...(look.gradient ?? ["transparent", "transparent"])] as [string, string];
    stops[match[1] === "from" ? 0 : 1] = value;
    look.gradient = stops;
    return true;
  }
  return false;
}

/** `tracking-*` is in em; React Native wants points. */
function finish(look: NativeLook): NativeLook {
  for (const part of [look, look.disabled, look.on]) {
    if (part.text.letterSpacing !== undefined) part.text.letterSpacing = part.text.letterSpacing * (part.text.fontSize ?? look.text.fontSize ?? 14);
  }
  return look;
}

export type NativeRecipe = {
  /** The looks of each slot (`base` for a recipe without slots) for these variants, on this theme. */
  resolve: (props: Props, theme: ThemeColors) => Record<string, NativeLook>;
};

/** The native side of a recipe (`defineRecipe`): what its variants look like on a theme. */
export function nativeRecipe(config: Config): NativeRecipe {
  return {
    resolve(props, theme) {
      const looks: Record<string, NativeLook> = {};
      for (const [slot, classes] of Object.entries(classesFor(config, props))) {
        const look = empty();
        for (const cls of classes) if (!apply(look, cls, theme)) look.ignored.push(cls);
        looks[slot] = finish(look);
      }
      return looks;
    },
  };
}
