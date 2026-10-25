// Client (a global shortcut). The top bar's search trigger: a field-like button (the glyph, the label, ⌘K) from `md`, an
// icon below. It does not search: it opens the host's palette (`CommandDialog` of @krizaka/ui/command) — on a click, on
// Enter, and on ⌘K / Ctrl+K from anywhere on the page.
import * as React from "react";
import { tv } from "tailwind-variants";

import { SearchGlyph } from "../../glyphs";
import { Kbd } from "../../kbd/kbd";

export const appHeaderSearch = tv({
  slots: {
    root:
      "inline-flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-lg text-fg-secondary transition-colors " +
      "hover:bg-surface-2 hover:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none " +
      "md:w-56 md:justify-start md:border md:border-border-default md:bg-surface-2/60 md:px-3 md:text-xs md:hover:border-border-strong lg:w-72",
    glyph: "h-5 w-5 shrink-0 md:h-4 md:w-4",
    // Hidden on a phone, still the button's name there (sr-only), so the name is the same at every width.
    label: "sr-only md:not-sr-only md:flex-1 md:truncate md:text-left",
    keys: "ml-auto hidden shrink-0 items-center gap-0.5 lg:flex",
  },
});
const s = appHeaderSearch();

const isApple = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/** Whether a keydown is the shortcut: ⌘ or Ctrl with the key, no Alt. */
export function isSearchShortcut(event: Pick<KeyboardEvent, "key" | "metaKey" | "ctrlKey" | "altKey">, key: string): boolean {
  return event.key.toLowerCase() === key.toLowerCase() && (event.metaKey || event.ctrlKey) && !event.altKey;
}

export type AppHeaderSearchProps = Omit<React.ComponentProps<"button">, "children" | "onClick"> & {
  /** What it searches (« Search files and checks ») — passed translated: the field's words from `md`, the button's name at every width. */
  label: string;
  /** Opens the palette: a click, Enter, and the shortcut. */
  onOpen: () => void;
  /**
   * The shortcut's key with ⌘ (Apple) or Ctrl (elsewhere), global to the page; `false` for none. One per page.
   * @default "k"
   */
  shortcut?: string | false;
};

/** The top bar's search trigger: a field from `md`, an icon below; it opens the host's palette, also on ⌘K. */
export function AppHeaderSearch({ label, onOpen, shortcut = "k", className, type, ...props }: AppHeaderSearchProps) {
  const [apple, setApple] = React.useState(true);
  const open = React.useRef(onOpen);
  React.useEffect(() => {
    open.current = onOpen;
  }, [onOpen]);

  React.useEffect(() => {
    if (!shortcut) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the platform is only known in the browser (no hydration mismatch)
    setApple(isApple());
    const onKey = (event: KeyboardEvent) => {
      if (!isSearchShortcut(event, shortcut)) return;
      event.preventDefault();
      open.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcut]);

  const key = shortcut ? shortcut.toUpperCase() : null;
  return (
    <button
      type={type ?? "button"}
      aria-haspopup="dialog"
      aria-keyshortcuts={key ? `Meta+${key} Control+${key}` : undefined}
      {...props}
      onClick={() => onOpen()}
      className={s.root({ className })}
    >
      <SearchGlyph className={s.glyph()} />
      <span className={s.label()}>{label}</span>
      {key && (
        <span aria-hidden className={s.keys()}>
          <Kbd size="sm">{apple ? "⌘" : "Ctrl"}</Kbd>
          <Kbd size="sm">{key}</Kbd>
        </span>
      )}
    </button>
  );
}
