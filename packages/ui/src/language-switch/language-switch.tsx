// Client (a disclosure). The one language switch of the family: a globe and the current code (FR), opening a short list of
// the languages by their own names — links with `hreflang` that keep the page. A disclosure, not a Radix menu: the items
// are navigation, and the bar must not pay for a menu engine (Escape, outside press, focus-out and the arrows are here).
import * as React from "react";
import { tv } from "tailwind-variants";

import type { Language } from "./href";

export const languageSwitch = tv({
  slots: {
    root: "relative inline-flex",
    trigger:
      "group/language inline-flex h-9 shrink-0 select-none items-center gap-1.5 rounded-full px-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-fg-secondary transition-colors " +
      "hover:bg-surface-3 hover:text-fg aria-expanded:bg-surface-3 aria-expanded:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
    glyph: "h-4 w-4 shrink-0",
    panel:
      "kz-pop absolute right-0 top-full z-50 mt-2 grid min-w-44 max-w-[calc(100vw-2rem)] gap-0.5 rounded-xl border border-border-default bg-surface-1 p-1.5 shadow-lg",
    heading: "px-2.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-secondary",
    item:
      "flex min-h-9 items-center justify-between gap-6 rounded-lg px-2.5 py-2 text-sm font-medium text-fg no-underline outline-hidden transition-colors " +
      "hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:ring-2 focus-visible:ring-ring aria-[current=true]:bg-accent-soft",
    check: "h-4 w-4 shrink-0 text-fg-accent",
    inline: "inline-flex items-center gap-1 rounded-full border border-border-subtle bg-surface-2/60 p-0.5",
    inlineLink:
      "inline-flex min-h-9 items-center rounded-full px-3 text-sm font-medium text-fg-secondary no-underline transition-colors hover:text-fg " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring aria-[current=true]:bg-surface-3 aria-[current=true]:text-fg",
  },
});
const s = languageSwitch();

export type LanguageSwitchProps = {
  /** The control's accessible name (“Language”, “Langue”) — passed translated. */
  label: string;
  /** The code of the page's language (`fr`). */
  current: string;
  /** The languages offered, each with its name in its own language and the address of the same page (`languagesFor`). */
  languages: readonly Language[];
  /**
   * `menu`: a globe and the code, opening a menu (the bar). `inline`: every language in a row (a mobile panel, a settings page).
   * @default "menu"
   */
  variant?: "menu" | "inline";
  /** Your router's `<Link>` (it receives `href`, `hrefLang`, `lang`). A plain `<a>` otherwise. */
  linkAs?: React.ElementType;
  /** Opens the menu at first render (a story, a screenshot). */
  defaultOpen?: boolean;
  /** Classes of the control. */
  className?: string;
};

const Globe = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
  </svg>
);

/**
 * The language switch, the same on every Krizaka site and app: a compact control — a globe and the current code
 * (`FR`) — that opens a menu of the languages named in their own language (Français · English), each a link with
 * `hreflang` to the same page. It shows the language you are in, never the “other” one. `variant="inline"` lays the
 * languages in a row for a phone's panel or a settings page.
 */
export function LanguageSwitch({ label, current, languages, variant = "menu", linkAs, defaultOpen = false, className }: LanguageSwitchProps) {
  const Link = linkAs ?? "a";
  const id = React.useId();
  const [open, setOpen] = React.useState(defaultOpen);
  const root = React.useRef<HTMLDivElement>(null);
  const trigger = React.useRef<HTMLButtonElement>(null);
  const active = languages.find((l) => l.code === current);

  React.useEffect(() => {
    if (!open) return;
    // A press outside closes it (the page under it stays usable).
    const onPress = (e: PointerEvent) => {
      if (e.target instanceof Node && !root.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPress);
    return () => document.removeEventListener("pointerdown", onPress);
  }, [open]);

  if (variant === "inline") {
    return (
      <div role="group" aria-label={label} className={s.inline({ className })}>
        {languages.map((l) => (
          <Link key={l.code} href={l.href} hrefLang={l.code} lang={l.code} aria-current={l.code === current ? "true" : undefined} className={s.inlineLink()}>
            {l.name}
          </Link>
        ))}
      </div>
    );
  }

  const links = () => [...(root.current?.querySelectorAll<HTMLElement>("[data-language]") ?? [])];
  const close = (focus: boolean) => {
    setOpen(false);
    if (focus) trigger.current?.focus();
  };
  return (
    <div
      ref={root}
      className={s.root({ className })}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          close(true);
        }
        if (open && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Home" || e.key === "End")) {
          e.preventDefault();
          const all = links();
          const at = all.indexOf(document.activeElement as HTMLElement);
          const next = e.key === "Home" ? 0 : e.key === "End" ? all.length - 1 : (at + (e.key === "ArrowDown" ? 1 : -1) + all.length) % all.length;
          all[next]?.focus();
        }
      }}
      // Tab out of the switch closes it.
      onBlur={(e) => {
        if (open && !root.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-label={active ? `${label}: ${active.name}` : label}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            requestAnimationFrame(() => (links().find((l) => l.getAttribute("aria-current") === "true") ?? links()[0])?.focus());
          }
        }}
        className={s.trigger()}
      >
        <Globe className={s.glyph()} />
        <span aria-hidden>{current}</span>
      </button>
      {open && (
        <div id={id} role="group" aria-label={label} className={s.panel()}>
          <p aria-hidden className={s.heading()}>
            {label}
          </p>
          {languages.map((l) => (
            <Link key={l.code} data-language="" href={l.href} hrefLang={l.code} lang={l.code} aria-current={l.code === current ? "true" : undefined} className={s.item()}>
              {l.name}
              {l.code === current && (
                <svg viewBox="0 0 24 24" className={s.check()} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
