// Keyboard shortcuts for an application: a combination (`mod+k`, `shift+/`, `alt+arrowup`) or a sequence (`g d`: press G,
// then D). `mod` is ⌘ on Apple devices and Ctrl elsewhere. Plain keys and sequences stay out of text fields; a combination
// with `mod` works in an input (not in a rich-text editor, where ⌘B is bold). Nothing is decided here about the words.
import * as React from "react";

import { useLatest } from "../media";

export type ShortcutMap = Readonly<Record<string, ((event: KeyboardEvent) => void) | undefined>>;

const isApple = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

const ALIASES: Record<string, string> = { esc: "escape", return: "enter", space: " ", spacebar: " ", up: "arrowup", down: "arrowdown", left: "arrowleft", right: "arrowright", del: "delete", plus: "+" };
type Modifier = "mod" | "ctrl" | "alt" | "shift" | "meta";

type Combo = { key: string; mod: boolean; ctrl: boolean; alt: boolean; shift: boolean; meta: boolean };

/** `"mod+shift+k"` → its parts. A lone `+` key is written `plus`. */
export function parseCombo(combo: string): Combo {
  const parts = combo.toLowerCase().split("+").filter(Boolean);
  const key = ALIASES[parts.at(-1) ?? ""] ?? parts.at(-1) ?? "";
  const has = (name: Modifier) => parts.slice(0, -1).includes(name);
  return { key, mod: has("mod"), ctrl: has("ctrl"), alt: has("alt"), shift: has("shift"), meta: has("meta") };
}

/** Whether a key event is this combination: its modifiers exactly (`mod` is ⌘ or Ctrl by platform), then its key. */
export function matchesCombo(event: Pick<KeyboardEvent, "key" | "metaKey" | "ctrlKey" | "altKey" | "shiftKey">, combo: string, apple = isApple()): boolean {
  const want = parseCombo(combo);
  const meta = want.meta || (want.mod && apple);
  const ctrl = want.ctrl || (want.mod && !apple);
  if (event.metaKey !== meta || event.ctrlKey !== ctrl || event.altKey !== want.alt) return false;
  // Shift is only checked when the binding names it: `?` and `/` need it on most layouts.
  if (want.shift && !event.shiftKey) return false;
  return event.key.toLowerCase() === want.key;
}

/** The keys of a shortcut to show on a keycap: `["⌘", "K"]` on a Mac, `["Ctrl", "K"]` elsewhere; a sequence `g d` is `["G", "D"]`. */
export function formatShortcut(shortcut: string, apple = isApple()): string[] {
  if (shortcut.includes(" ")) return shortcut.split(/\s+/).map((key) => key.toUpperCase());
  const parts = shortcut.split("+").filter(Boolean);
  const key = parts.at(-1) ?? "";
  const names: Record<string, [string, string]> = { mod: ["⌘", "Ctrl"], meta: ["⌘", "Win"], ctrl: ["⌃", "Ctrl"], alt: ["⌥", "Alt"], shift: ["⇧", "Shift"] };
  const shown = parts.slice(0, -1).map((part) => names[part.toLowerCase()]?.[apple ? 0 : 1] ?? part);
  const glyph: Record<string, string> = { escape: "Esc", enter: "↵", arrowup: "↑", arrowdown: "↓", arrowleft: "←", arrowright: "→", " ": "Space" };
  const last = glyph[ALIASES[key.toLowerCase()] ?? key.toLowerCase()] ?? key.toUpperCase();
  return [...shown, last];
}

/**
 * The accelerator of a combination for a desktop app's native menu bar (Tauri's `MenuItem`, Electron's — ADR-002):
 * `mod+k` → `CmdOrCtrl+K`, `shift+mod+/` → `Shift+CmdOrCtrl+/`. The menu and the shell then answer the same keys, and the
 * menu shows them. A sequence (`g d`) has none: a menu item takes one chord.
 */
export function acceleratorOf(shortcut: string): string | undefined {
  if (shortcut.trim().includes(" ")) return undefined;
  const parts = shortcut.split("+").filter(Boolean);
  const names: Record<string, string> = { mod: "CmdOrCtrl", meta: "Super", ctrl: "Ctrl", alt: "Alt", shift: "Shift" };
  const raw = (parts.at(-1) ?? "").toLowerCase();
  const key = ALIASES[raw] ?? raw;
  const keys: Record<string, string> = { escape: "Escape", enter: "Enter", " ": "Space", arrowup: "Up", arrowdown: "Down", arrowleft: "Left", arrowright: "Right", delete: "Delete", backspace: "Backspace", tab: "Tab", "+": "Plus" };
  const last = keys[key] ?? (key.length === 1 ? key.toUpperCase() : key.charAt(0).toUpperCase() + key.slice(1));
  return [...parts.slice(0, -1).map((part) => names[part.toLowerCase()] ?? part), last].join("+");
}

const noop = () => () => undefined;

/** Whether the person is on an Apple device — `false` on the server and in the first client render (no mismatch), then right. */
export function useApple(): boolean {
  return React.useSyncExternalStore(noop, isApple, () => false);
}

/** The `aria-keyshortcuts` of a combination (`Control+K`, `Meta+K` on a Mac); a sequence has none (it is not a chord). */
export function ariaKeyShortcuts(shortcut: string, apple = isApple()): string | undefined {
  if (shortcut.includes(" ")) return undefined;
  const parts = shortcut.split("+").filter(Boolean);
  const names: Record<string, string> = { mod: apple ? "Meta" : "Control", meta: "Meta", ctrl: "Control", alt: "Alt", shift: "Shift" };
  const key = parts.at(-1) ?? "";
  return [...parts.slice(0, -1).map((part) => names[part.toLowerCase()] ?? part), key.length === 1 ? key.toUpperCase() : key.charAt(0).toUpperCase() + key.slice(1)].join("+");
}

/** Whether a key press happens in something you type in. */
function isEditable(target: EventTarget | null): { field: boolean; rich: boolean } {
  const element = target instanceof HTMLElement ? target : null;
  if (!element) return { field: false, rich: false };
  const rich = element.isContentEditable;
  return { field: rich || /^(input|textarea|select)$/i.test(element.tagName), rich };
}

/**
 * Binds shortcuts for as long as the component lives (`enabled` turns them off). Each key is a combination or a sequence,
 * each value runs when it is pressed; the handler may change on every render. A shortcut that fires is `preventDefault`ed.
 * A sequence waits `timeout` ms for its next key.
 */
export function useShortcuts(map: ShortcutMap, { enabled = true, timeout = 900 }: { enabled?: boolean; timeout?: number } = {}) {
  const latest = useLatest(map);
  const names = Object.keys(map).sort((a, b) => a.localeCompare(b)).join("\n");
  React.useEffect(() => {
    if (!enabled) return;
    const bindings = names.split("\n").filter(Boolean);
    let buffer: { key: string; at: number }[] = [];
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || event.repeat || !event.key) return;
      const editing = isEditable(event.target);
      const chord = event.metaKey || event.ctrlKey || event.altKey;
      const now = Date.now();
      buffer = [...buffer.filter((entry) => now - entry.at <= timeout), { key: event.key.toLowerCase(), at: now }].slice(-4);
      for (const binding of bindings) {
        const handler = latest.current[binding];
        if (!handler) continue;
        const keys = binding.toLowerCase().split(/\s+/).map((key) => ALIASES[key] ?? key);
        const fired =
          keys.length > 1
            ? !chord && !editing.field && buffer.length >= keys.length && keys.every((key, i) => buffer[buffer.length - keys.length + i]?.key === key)
            : matchesCombo(event, binding) && (chord ? !editing.rich : !editing.field);
        if (!fired) continue;
        event.preventDefault();
        buffer = [];
        handler(event);
        return;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [enabled, names, latest, timeout]);
}
