// The look of the page (akinaza#478): a radio group of the six looks as swatches (name, the look's own surface and its accent
// chips), then the accent within the chosen look's tested list. It applies to the draft only; publishing goes through the diff.
import { RadioGroup } from "@krizaka/ui/radio-group";

import { cn } from "../cn";
import type { ShopPage } from "../shop/schema";
import type { Command } from "./commands";
import type { ShopComposerPreset } from "./composer";
import { fill, type ShopComposerMessages } from "./messages";

export type LookPickerProps = {
  looks: readonly ShopComposerPreset[];
  page: ShopPage;
  messages: ShopComposerMessages;
  run: (cmd: Command) => void;
  announce: (message: string) => void;
};

/** The accent chips of a look, drawn by its own tokens. */
function Chips({ look }: { look: ShopComposerPreset }) {
  return (
    <span aria-hidden className="inline-flex gap-1">
      {(look.accents ?? [look.accent ?? "krizaka"]).map((a) => (
        <span key={a} data-shop-preset={look.id} data-shop-accent={a} className="kz-look-chip">
          <i />
        </span>
      ))}
    </span>
  );
}

export function LookPicker({ looks, page, messages: m, run, announce }: LookPickerProps) {
  const current = looks.find((l) => l.id === page.preset.id);
  const accents = current?.accents ?? [];
  return (
    <div className="grid gap-3">
      <RadioGroup.Root
        label={m.lookChoice}
        variant="cards"
        value={current?.id ?? ""}
        onValueChange={(id) => {
          const look = looks.find((l) => l.id === id);
          if (!look) return;
          run({ type: "applyLook", look });
          announce(fill(m.lookApplied, { name: look.name }));
        }}
        className="grid-cols-2"
      >
        {looks.map((l) => (
          <RadioGroup.Card key={l.id} value={l.id} className="p-2 pr-9">
            <span data-shop-preset={l.id} className={cn("kz-look-swatch")}>
              <span className="min-w-0 max-w-full truncate text-sm font-semibold">{l.name}</span>
              <Chips look={l} />
            </span>
          </RadioGroup.Card>
        ))}
      </RadioGroup.Root>
      {accents.length > 1 && (
        <RadioGroup.Root label={m.accentChoice} variant="buttons" value={page.accent ?? current?.accent ?? accents[0]} onValueChange={(a) => run({ type: "setAccent", accent: a === current?.accent ? undefined : a })}>
          {accents.map((a) => (
            <RadioGroup.Button key={a} value={a}>
              {m.accentNames[a] ?? a}
            </RadioGroup.Button>
          ))}
        </RadioGroup.Root>
      )}
    </div>
  );
}
