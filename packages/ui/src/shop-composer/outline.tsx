"use client";

// The outline (ADR-007 §5): the sections in order — name, the variant as a mono note, a visibility switch, a menu. Drag is an
// extra the page does not need: the path is the keyboard — focus a row, `Alt+↑` / `Alt+↓` (or the row's menu: Move up, Move
// down, Move to top). Every move is announced (« Reviews moved to position 3 of 8 ») and focus stays on the moved row.
import { Button } from "@krizaka/ui/button";
import { DropdownMenu } from "@krizaka/ui/dropdown-menu";
import { Switch } from "@krizaka/ui/switch";
import * as React from "react";

import type { Section } from "../shop/schema";
import type { Command } from "./commands";
import { fill, type ShopComposerMessages } from "./messages";

export type OutlineProps = {
  sections: readonly Section[];
  selected: string | null;
  onSelect: (key: string) => void;
  run: (cmd: Command, merge?: string) => void;
  messages: ShopComposerMessages;
  announce: (message: string) => void;
  onAdd: () => void;
  /** A request to focus a row (a new section): a new object each time; consumed once, after the render that drew the row. */
  focusRequest?: { key: string } | null;
};

/** « Photos », « Photos 2 » when a type appears twice. */
export function sectionLabel(sections: readonly Section[], index: number, messages: ShopComposerMessages): string {
  const s = sections[index]!;
  const same = sections.filter((x) => x.type === s.type);
  const base = messages.sectionNames[s.type];
  return same.length > 1 ? `${base} ${same.indexOf(s) + 1}` : base;
}

const ICON = "h-4 w-4";

export function Outline({ sections, selected, onSelect, run, messages: m, announce, onAdd, focusRequest }: OutlineProps) {
  const rows = React.useRef(new Map<string, HTMLButtonElement>());
  // After a move (or a menu action) the moved row keeps the focus: the DOM may have reordered under it. A request is consumed once —
  // never on the next change of the document, which may be typing somewhere else.
  const wanted = React.useRef<string | null>(null);
  const [tick, setTick] = React.useState(0);
  const want = (key: string) => {
    wanted.current = key;
    setTick((t) => t + 1);
  };
  React.useLayoutEffect(() => {
    if (focusRequest) wanted.current = focusRequest.key;
  }, [focusRequest]);
  React.useLayoutEffect(() => {
    const key = wanted.current;
    wanted.current = null;
    if (key) rows.current.get(key)?.focus();
  }, [tick, focusRequest]);

  const move = (index: number, to: number) => {
    const s = sections[index]!;
    const name = sectionLabel(sections, index, m);
    const lo = sections[0]?.type === "hero" ? 1 : 0;
    const clamped = Math.min(Math.max(to, lo), sections.length - 1);
    if (s.type === "hero" || clamped === index) {
      announce(fill(m.announceCannotMove, { name }));
      return;
    }
    run({ type: "moveSection", key: s.key, to: clamped });
    want(s.key);
    announce(fill(m.announceMoved, { name, n: clamped + 1, total: sections.length }));
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault();
      move(index, index + (e.key === "ArrowUp" ? -1 : 1));
    } else if (!e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      const next = sections[index + (e.key === "ArrowUp" ? -1 : 1)];
      if (next) {
        e.preventDefault();
        rows.current.get(next.key)?.focus();
      }
    }
  };

  return (
    <nav aria-label={m.sections} className="flex min-h-0 flex-col gap-3">
      <ol className="m-0 flex list-none flex-col gap-1 p-0">
        {sections.map((s, i) => {
          const name = sectionLabel(sections, i, m);
          const isHero = s.type === "hero";
          const lo = sections[0]?.type === "hero" ? 1 : 0;
          return (
            <li key={s.key} data-selected={selected === s.key ? "" : undefined} data-disabled={s.disabled ? "" : undefined} className="flex items-center gap-1 rounded-lg border border-transparent data-[selected]:border-accent data-[selected]:bg-accent-soft">
              <button
                type="button"
                ref={(el) => {
                  if (el) rows.current.set(s.key, el);
                  else rows.current.delete(s.key);
                }}
                aria-current={selected === s.key ? "true" : undefined}
                aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown"
                onClick={() => onSelect(s.key)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="flex min-h-11 min-w-0 flex-1 flex-col items-start justify-center rounded-lg px-3 py-1.5 text-start focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
              >
                <span className="flex w-full items-baseline gap-2">
                  <span className={s.disabled ? "truncate text-sm font-semibold text-fg-secondary line-through decoration-1" : "truncate text-sm font-semibold text-fg"}>{name}</span>
                  {s.disabled && <span className="font-mono text-[11px] text-fg-secondary">{m.hiddenNote}</span>}
                </span>
                <span className="font-mono text-xs text-fg-secondary">{m.variantNames[`${s.type}.${s.variant}`] ?? s.variant}</span>
              </button>
              <Switch
                size="sm"
                label={fill(m.toggleVisible, { name })}
                checked={!s.disabled}
                onCheckedChange={(on) => {
                  run({ type: "toggleDisabled", key: s.key });
                  announce(fill(on ? m.announceShown : m.announceHidden, { name }));
                }}
              />
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button variant="ghost" size="icon" aria-label={fill(m.sectionMenu, { name })}>
                    <svg viewBox="0 0 16 16" className={ICON} fill="currentColor" aria-hidden>
                      <circle cx="8" cy="3" r="1.4" />
                      <circle cx="8" cy="8" r="1.4" />
                      <circle cx="8" cy="13" r="1.4" />
                    </svg>
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                  onCloseAutoFocus={(e) => {
                    e.preventDefault();
                    rows.current.get(s.key)?.focus();
                  }}
                >
                  <DropdownMenu.Item disabled={isHero || i <= lo} onSelect={() => move(i, i - 1)}>{m.moveUp}</DropdownMenu.Item>
                  <DropdownMenu.Item disabled={isHero || i >= sections.length - 1} onSelect={() => move(i, i + 1)}>{m.moveDown}</DropdownMenu.Item>
                  <DropdownMenu.Item disabled={isHero || i <= lo} onSelect={() => move(i, lo)}>{m.moveTop}</DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    tone="danger"
                    disabled={sections.length <= 1}
                    onSelect={() => {
                      run({ type: "removeSection", key: s.key });
                      announce(fill(m.announceRemoved, { name }));
                      const next = sections[i + 1] ?? sections[i - 1];
                      if (next) want(next.key);
                    }}
                  >
                    {m.remove}
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </li>
          );
        })}
      </ol>
      <Button variant="outline" onClick={onAdd}>{m.addSection}</Button>
    </nav>
  );
}
