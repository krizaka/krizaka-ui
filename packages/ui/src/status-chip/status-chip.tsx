// Client (a Radix menu). A state of a status set (krizaka-ts#89, `@krizaka/organize`): the set says the states (label in
// both languages, tone, final) and the transitions (who may move, whether a second press confirms, which reasons may be
// picked). Read-only when the set is derived (an invoice's « paid » comes from the ledger), when no move is allowed to
// the role, or when nobody listens (`onMove`); otherwise a menu of the moves the role may make, in the set's order. A
// reason is picked from a list, never typed. The tone is a tint and a dot: the label always says the state.
import { movesFrom, stateOf,type StatusSet, type StatusTone, type StatusTransition } from "@krizaka/organize/contract";
import { DropdownMenu as MenuPrimitive } from "radix-ui";
import * as React from "react";

import { badgeVariants } from "../badge";
import { cn } from "../cn";
import { DropdownMenu } from "../dropdown-menu";
import { ChevronGlyph } from "../glyphs";

export type { StatusSet, StatusTone, StatusTransition };

export type StatusMove = {
  /** The transition the person chose. */
  transition: StatusTransition;
  /** The key of the reason picked from the transition's list, or null when it has none. */
  reason: string | null;
};

export type StatusChipLabels = {
  /** The menu's accessible name: `(state) => "Change the status, now " + state`. */
  menu: (state: string) => string;
  /** The item that waits for a second press: `(target) => "Confirm: " + target`. */
  confirm: (target: string) => string;
  /** The submenu that asks for a reason: `(target) => target + " — pick a reason"`. */
  reason: (target: string) => string;
};

const defaultLabels: StatusChipLabels = {
  menu: (state) => `Change the status, now ${state}`,
  confirm: (target) => `Confirm: ${target}`,
  reason: (target) => `${target} — pick a reason`,
};

export type StatusChipProps = {
  /** The kind's status set (`KindConfig.status`). */
  set: StatusSet;
  /** The key of the entity's state. */
  state: string;
  /** The role of the person: the moves are the ones this role may make. */
  role: string;
  /** The language the labels are read in. */
  locale: "fr" | "en";
  /** Called when a move is chosen (confirmed, with its reason when it asks for one). Without it the chip is read-only. */
  onMove?: (move: StatusMove) => void;
  /** The words of the menu, passed translated. */
  labels?: Partial<StatusChipLabels>;
  /**
   * sm · md.
   * @default "sm"
   */
  size?: "sm" | "md";
  /** Classes merged on the badge. */
  className?: string;
};

/** The state of a status set as a badge; a menu of the allowed moves when the set, the role and `onMove` allow it. */
export function StatusChip({ set, state, role, locale, onMove, labels: given, size = "sm", className }: StatusChipProps) {
  const labels = { ...defaultLabels, ...given };
  const current = stateOf(set, state);
  const text = current ? current.label[locale] : state;
  const tone = current?.tone ?? "neutral";
  const moves = onMove && set.mode === "editable" ? movesFrom(set, state, role) : [];
  const [armed, setArmed] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const label = (key: string) => stateOf(set, key)?.label[locale] ?? key;

  if (moves.length === 0) {
    return (
      <span data-status={state} data-tone={tone} className={badgeVariants({ tone, size, className })}>
        <span data-dot="" aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
        {text}
      </span>
    );
  }

  const choose = (move: StatusTransition, reason: string | null) => {
    setArmed(null);
    setOpen(false);
    onMove?.({ transition: move, reason });
  };

  return (
    <MenuPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setArmed(null);
      }}
      modal={false}
    >
      <MenuPrimitive.Trigger
        aria-label={labels.menu(text)}
        data-status={state}
        data-tone={tone}
        className={cn(
          badgeVariants({ tone, size }),
          "cursor-pointer transition-colors hover:brightness-110 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
      >
        <span data-dot="" aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
        {text}
        <ChevronGlyph className="-mr-0.5 h-3.5 w-3.5" />
      </MenuPrimitive.Trigger>
      <DropdownMenu.Content align="start" aria-label={labels.menu(text)}>
        {moves.map((move) => {
          const target = label(move.to);
          const reasons = move.reasons ?? [];
          if (reasons.length > 0) {
            return (
              <DropdownMenu.Sub key={move.to}>
                <DropdownMenu.SubTrigger aria-label={labels.reason(target)}>{target}</DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  {reasons.map((reason) => (
                    <DropdownMenu.Item key={reason.key} onSelect={() => choose(move, reason.key)}>
                      {reason.label[locale]}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
            );
          }
          const waiting = move.confirm && armed === move.to;
          return (
            <DropdownMenu.Item
              key={move.to}
              data-armed={waiting ? "" : undefined}
              className={waiting ? "font-semibold text-fg-accent" : undefined}
              onSelect={(event) => {
                if (move.confirm && !waiting) {
                  // The first press asks, the second one moves: the menu stays open and says so.
                  event.preventDefault();
                  setArmed(move.to);
                  return;
                }
                choose(move, null);
              }}
            >
              <span aria-live="polite">{waiting ? labels.confirm(target) : target}</span>
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </MenuPrimitive.Root>
  );
}
