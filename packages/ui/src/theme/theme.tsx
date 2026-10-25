// Client. ONE mechanism for the whole organisation: dark by default, `html.light` for light, `html.theme-<name>` for a
// named theme, persisted in localStorage (`kz-theme` for the mode, `kz-theme-name` for the named theme).
import * as React from "react";

import { type ButtonVariants, buttonVariants } from "../button/button";

export type Mode = "dark" | "light" | "system";

const MODE_KEY = "kz-theme";
const NAME_KEY = "kz-theme-name";
const ACCENT_KEY = "kz-accent";
const DENSITY_KEY = "kz-density";
const MODES: readonly Mode[] = ["dark", "light", "system"];
const DARK_QUERY = "(prefers-color-scheme: dark)";

const isMode = (value: unknown): value is Mode => MODES.includes(value as Mode);

// Storage blocked (private mode, sandbox): the choice lives in memory for the page.
const memory = new Map<string, string>();

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

function write(key: string, value: string | null) {
  if (value === null) memory.delete(key);
  else memory.set(key, value);
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // storage blocked: memory holds it
  }
}

// The persisted choice is an external store: every provider and tab reads the same value, the server reads none.
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());
function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function applyMode(mode: Mode) {
  const dark = window.matchMedia(DARK_QUERY).matches;
  document.documentElement.classList.toggle("light", mode === "light" || (mode === "system" && !dark));
}

function applyName(previous: string | null, next: string | null) {
  const classes = document.documentElement.classList;
  if (previous) classes.remove(`theme-${previous}`);
  if (next) classes.add(`theme-${next}`);
}

export type ThemeScriptProps = {
  /** The nonce of a strict Content-Security-Policy (`script-src 'nonce-…'`). */
  nonce?: string;
  /**
   * The mode before the visitor chooses one — pass the same value as `ThemeProvider`'s `defaultMode`. A persisted
   * choice (`kz-theme`) always wins.
   * @default "system"
   */
  defaultMode?: Mode;
};

/**
 * In <head>, before anything renders: applies the persisted mode (else `defaultMode`) and named theme, so the page
 * never flashes. `nonce` for a strict Content-Security-Policy.
 */
export function ThemeScript({ nonce, defaultMode = "system" }: ThemeScriptProps) {
  const fallback = isMode(defaultMode) ? defaultMode : "system";
  const js =
    `(function(){try{var m=localStorage.getItem("${MODE_KEY}");if(m!=="dark"&&m!=="light"&&m!=="system")m="${fallback}";` +
    `var n=localStorage.getItem("${NAME_KEY}");var d=matchMedia("${DARK_QUERY}").matches;var c=document.documentElement.classList;` +
    `c.toggle("light",m==="light"||(m==="system"&&!d));if(n)c.add("theme-"+n);var a=localStorage.getItem("${ACCENT_KEY}");if(a)document.documentElement.setAttribute("data-accent",a);var y=localStorage.getItem("${DENSITY_KEY}");if(y)document.documentElement.setAttribute("data-density",y)}catch(e){}})()`;
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: js }} />;
}

export type ThemeContextValue = {
  /** The chosen mode: dark, light or follow the system. */
  mode: Mode;
  setMode: (mode: Mode) => void;
  /** The named theme (`html.theme-<name>`), or null. */
  theme: string | null;
  setTheme: (theme: string | null) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export type ThemeProviderProps = {
  children: React.ReactNode;
  /**
   * The mode before the visitor chooses one (nothing persisted as `kz-theme`) — pass the same value to `ThemeScript`.
   * @default "system"
   */
  defaultMode?: Mode;
};

export function ThemeProvider({ children, defaultMode = "system" }: ThemeProviderProps) {
  // Before hydration the server knows nothing persisted (ThemeScript has already applied it to <html>).
  const stored = React.useSyncExternalStore(subscribe, () => read(MODE_KEY), () => null);
  const mode: Mode = isMode(stored) ? stored : defaultMode;
  const theme = React.useSyncExternalStore(subscribe, () => read(NAME_KEY), () => null);

  // The same resolution as ThemeScript (a no-op after it), for an app that renders the provider without the script.
  React.useEffect(() => {
    const persisted = read(MODE_KEY);
    applyMode(isMode(persisted) ? persisted : defaultMode);
  }, [defaultMode]);

  // "system" follows the operating system while the page is open.
  React.useEffect(() => {
    if (mode !== "system") return;
    const query = window.matchMedia(DARK_QUERY);
    const onChange = () => applyMode("system");
    query.addEventListener?.("change", onChange);
    return () => query.removeEventListener?.("change", onChange);
  }, [mode]);

  const setMode = React.useCallback((next: Mode) => {
    write(MODE_KEY, next);
    applyMode(next);
    notify();
  }, []);

  const setTheme = React.useCallback((next: string | null) => {
    applyName(read(NAME_KEY), next);
    write(NAME_KEY, next);
    notify();
  }, []);

  const value = React.useMemo(() => ({ mode, setMode, theme, setTheme }), [mode, setMode, theme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error("useTheme: wrap the app in <ThemeProvider>");
  return context;
}

const ICONS: Record<Mode, React.ReactNode> = {
  dark: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
  light: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  system: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
};

export type ThemeToggleProps = Omit<React.ComponentProps<"button">, "onClick" | "children"> &
  Pick<ButtonVariants, "variant" | "shape"> & {
    /** Any `Button` variant. */
    variant?: ButtonVariants["variant"];
    /**
     * rounded · pill.
     * @default "rounded"
     */
    shape?: ButtonVariants["shape"];
    /** The accessible name — a string, or one per current mode (e.g. `(mode) => t("theme." + mode)`). */
    label: string | ((mode: Mode) => string);
  };

/**
 * An icon button (styled as `IconButton`, without its Slot) that cycles dark → light → system. Needs a
 * <ThemeProvider> above it. State: `data-mode`.
 */
export function ThemeToggle({ label, variant = "ghost", shape, className, ...props }: ThemeToggleProps) {
  const { mode, setMode } = useTheme();
  const next = MODES[(MODES.indexOf(mode) + 1) % MODES.length] as Mode;
  const name = typeof label === "function" ? label(mode) : label;
  return (
    <button
      type="button"
      aria-label={name}
      title={name}
      data-mode={mode}
      onClick={() => setMode(next)}
      className={buttonVariants({ variant, shape, size: "icon", className })}
      {...props}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {ICONS[mode]}
      </svg>
    </button>
  );
}

/** The choices of the Appearance block (ADR-006 §4): the theme (`system · light · dark`, then a surface set), the accent, the density. */
export type AppearanceState = {
  /** `system`, `light`, `dark`, or the surface set (`blueprint`, `carbone`) — which is dark. */
  themeId: string;
  setThemeId: (id: string) => void;
  /** A brand's accent (`data-accent` on `<html>`), or null: the product's own. */
  accent: string | null;
  setAccent: (accent: string | null) => void;
  /** `standard` or `compact` (`data-density` on `<html>`, the token layer: rows and gaps one step down). */
  density: string;
  setDensity: (density: string) => void;
};

function applyAttribute(name: string, value: string | null) {
  if (value === null) document.documentElement.removeAttribute(name);
  else document.documentElement.setAttribute(name, value);
}

/**
 * The state of the Appearance block, applied at once and kept in the browser (`kz-theme`, `kz-theme-name`, `kz-accent`,
 * `kz-density`; `ThemeScript` restores them before paint). A product with an account also saves what `onChange` of the block
 * reports, so the choice follows the person. Needs a `ThemeProvider`.
 * @param surfaceSets the themes that are a dark surface set (default `blueprint`, `carbone`)
 */
export function useAppearance(surfaceSets: readonly string[] = ["blueprint", "carbone"]): AppearanceState {
  const { mode, setMode, theme, setTheme } = useTheme();
  const accent = React.useSyncExternalStore(subscribe, () => read(ACCENT_KEY), () => null);
  const density = React.useSyncExternalStore(subscribe, () => read(DENSITY_KEY), () => null) ?? "standard";
  const themeId = theme && surfaceSets.includes(theme) && mode === "dark" ? theme : mode;
  const setThemeId = React.useCallback(
    (id: string) => {
      if (surfaceSets.includes(id)) {
        setMode("dark");
        setTheme(id);
      } else {
        setTheme(null);
        setMode(id as Mode);
      }
    },
    [setMode, setTheme, surfaceSets],
  );
  const setAccent = React.useCallback((next: string | null) => {
    applyAttribute("data-accent", next);
    write(ACCENT_KEY, next);
    notify();
  }, []);
  const setDensity = React.useCallback((next: string) => {
    applyAttribute("data-density", next === "standard" ? null : next);
    write(DENSITY_KEY, next === "standard" ? null : next);
    notify();
  }, []);
  return { themeId, setThemeId, accent, setAccent, density, setDensity };
}
