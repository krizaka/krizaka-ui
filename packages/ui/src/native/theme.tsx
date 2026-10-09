// The native theme: the @krizaka/tokens roles (dark, light), a product's overrides on top, the mode chosen by the app
// or followed from the system. Same names as the web `./theme` (`mode`, `setMode`, `ThemeProvider`, `useTheme`).
import { motion as tokenMotion, radius as tokenRadius, themes as tokenThemes } from "@krizaka/tokens/native";
import * as React from "react";
import { AccessibilityInfo, useColorScheme } from "react-native";

// The token values are inlined in dist/native.js (no dependency for the app); their types are spelled out here so the
// declarations stand alone. theme.test.tsx checks that they match @krizaka/tokens/native both ways.
export type ThemeName = "dark" | "light";

/** The colour roles of one theme (the @krizaka/tokens roles). */
export type Theme = {
  readonly surface0: string;
  readonly surface1: string;
  readonly surface2: string;
  readonly surface3: string;
  readonly media: string;
  readonly borderSubtle: string;
  readonly borderDefault: string;
  readonly borderStrong: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly textMuted: string;
  readonly textOnMedia: string;
  readonly accent: string;
  readonly accentHover: string;
  readonly accentSoft: string;
  readonly accent2: string;
  readonly onAccent: string;
  readonly ring: string;
  readonly success: string;
  readonly warning: string;
  readonly danger: string;
  readonly info: string;
  readonly scrim: string;
  readonly scrimStrong: string;
  readonly overlay: string;
};

/** Corner radii, in points. */
export type Radius = { readonly sm: number; readonly md: number; readonly lg: number; readonly xl: number; readonly full: number };
/** Motion: the cubic-bezier control points of the platform's ease (`Easing.bezier(...motion.ease)`). */
export type Motion = { readonly ease: readonly [number, number, number, number] };

const themes: Readonly<Record<ThemeName, Theme>> = tokenThemes;
const radius: Radius = tokenRadius;
const motion: Motion = tokenMotion;

export type Mode = "dark" | "light" | "system";

/** A product's colour roles per theme (e.g. `nativeTheme` of a product design system): only the roles it changes. */
export type ThemeOverrides = { readonly dark?: Partial<Theme>; readonly light?: Partial<Theme> };

/** Font families, when the app has loaded them (`expo-font`…). Absent: the system font. */
export type ThemeFonts = { readonly sans?: string; readonly display?: string; readonly mono?: string };

export type ThemeContextValue = {
  /** The chosen mode: dark, light or follow the system. */
  mode: Mode;
  setMode: (mode: Mode) => void;
  /** The resolved scheme: what `mode` gives on this device right now. */
  scheme: ThemeName;
  /** The colour roles of the resolved scheme, overrides applied. */
  theme: Theme;
  radius: Radius;
  motion: Motion;
  fonts: ThemeFonts;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function resolve(mode: Mode, system: string | null | undefined): ThemeName {
  if (mode === "system") return system === "light" ? "light" : "dark";
  return mode;
}

export type ThemeProviderProps = {
  children: React.ReactNode;
  /** Controlled mode (with `onModeChange`). */
  mode?: Mode;
  /** Uncontrolled: the mode before the user picks one. Default: follow the system. */
  defaultMode?: Mode;
  /** Every change of mode — the app persists it (no storage dependency here). */
  onModeChange?: (mode: Mode) => void;
  /** The product's roles over the platform's, per theme. */
  overrides?: ThemeOverrides;
  fonts?: ThemeFonts;
};

/** Once, at the root of the app. Without it, `useTheme()` follows the system with the platform's roles. */
export function ThemeProvider({ children, mode: controlled, defaultMode = "system", onModeChange, overrides, fonts }: ThemeProviderProps) {
  const system = useColorScheme();
  const [own, setOwn] = React.useState<Mode>(defaultMode);
  const mode = controlled ?? own;
  const setMode = React.useCallback(
    (next: Mode) => {
      if (controlled === undefined) setOwn(next);
      onModeChange?.(next);
    },
    [controlled, onModeChange],
  );
  const scheme = resolve(mode, system);
  const override = overrides?.[scheme];
  const theme = React.useMemo(() => (override ? { ...themes[scheme], ...override } : themes[scheme]), [scheme, override]);
  const value = React.useMemo<ThemeContextValue>(
    () => ({ mode, setMode, scheme, theme, radius, motion, fonts: fonts ?? {} }),
    [mode, setMode, scheme, theme, fonts],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

const noop = () => undefined;

/** The current theme: `{ mode, setMode, scheme, theme, radius, motion, fonts }`. */
export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  const system = useColorScheme();
  if (context) return context;
  const scheme = resolve("system", system);
  return { mode: "system", setMode: noop, scheme, theme: themes[scheme], radius, motion, fonts: {} };
}

/** True while the system asks to reduce motion: every loop and transition of /native stops. */
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => {
    let alive = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (alive) setReduce(value);
    });
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduce);
    return () => {
      alive = false;
      subscription.remove();
    };
  }, []);
  return reduce;
}

/** A role at a lower opacity (`#rrggbb` → `rgba()`): the soft tints of the status tones. Other forms pass through. */
export function alpha(color: string, opacity: number): string {
  const hex = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(color);
  if (!hex) return color;
  const [r, g, b] = hex.slice(1).map((part) => parseInt(part, 16));
  return `rgba(${r},${g},${b},${opacity})`;
}

/** An id usable in an SVG `url(#…)` reference, unique per instance. */
export function useSvgId(prefix: string): string {
  return `${prefix}${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}
