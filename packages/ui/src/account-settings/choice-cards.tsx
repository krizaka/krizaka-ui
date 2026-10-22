// Client (a radio group). A single choice as selectable cards — an icon, a title, one line: the side of a lease, a plan, a
// way to get the answer. Built on `RadioGroup.Card`, so the arrows choose, the card is the radio, the check lights up.
import * as React from "react";

import { RadioGroup } from "../radio-group";

export interface ChoiceCardOption {
  /** The value of the choice. */
  id: string;
  /** Its name, short. */
  title: React.ReactNode;
  /** One line under the title: what it means. It describes the radio. */
  description?: React.ReactNode;
  /** A glyph before the title (decorative). */
  icon?: React.ReactNode;
  disabled?: boolean;
}

export type ChoiceCardsProps = Omit<React.ComponentProps<typeof RadioGroup.Root>, "children" | "variant" | "label"> & {
  /** The question (“Which side of the lease are you?”) — the group's accessible name, passed translated. */
  label: string;
  /** The choices. */
  options: readonly ChoiceCardOption[];
  /** The chosen id (controlled). */
  value?: string;
  /** The viewer chooses another card. */
  onValueChange?: (id: string) => void;
};

/** Cards to choose one from: a radio group where each card has an icon, a title and a description. */
export function ChoiceCards({ label, options, className, ...props }: ChoiceCardsProps) {
  const base = React.useId();
  return (
    <RadioGroup.Root variant="cards" label={label} className={["grid grid-cols-1 gap-3 sm:grid-cols-2", className].filter(Boolean).join(" ")} {...props}>
      {options.map((option) => {
        const describedBy = option.description ? `${base}-${option.id}` : undefined;
        return (
          <RadioGroup.Card key={option.id} value={option.id} disabled={option.disabled} aria-describedby={describedBy}>
            <span className="flex items-center gap-2.5 font-semibold text-fg [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-accent">
              {option.icon}
              {option.title}
            </span>
            {option.description ? (
              <span id={describedBy} className="text-sm font-normal text-fg-secondary">
                {option.description}
              </span>
            ) : null}
          </RadioGroup.Card>
        );
      })}
    </RadioGroup.Root>
  );
}
