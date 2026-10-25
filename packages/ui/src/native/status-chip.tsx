// A state of a status set on the phone (krizaka-ts#89). The state as a badge (a tint, a dot, its label — the tone is never the
// only signal); with `moves` and `onMove` a press opens the sheet of the moves the role may make, in the set's order. The
// words come resolved (the label in the language, the moves from `movesFrom` of `@krizaka/organize/contract`): /native adds
// no dependency. A move that asks to be confirmed shows « Confirm: … » on a second press; a reason is picked from a list.
import * as React from "react";
import { Pressable } from "react-native";

import { ActionSheet } from "./action-sheet";
import { Badge, type BadgeTone } from "./badge";

export type StatusMoveOption = {
  /** The key of the target state. */
  key: string;
  /** The target's label, in the language of the person. */
  label: string;
  /** A second press confirms. */
  confirm?: boolean;
  /** The reasons to pick from (never typed), in the language of the person. */
  reasons?: readonly { key: string; label: string }[];
};

export type StatusChipProps = {
  /** The state's label, in the language of the person. */
  label: string;
  /** The state's tone: a badge tone. */
  tone?: Exclude<BadgeTone, "scrim">;
  /** The moves the role may make from this state (empty or missing: the chip is read-only). */
  moves?: readonly StatusMoveOption[];
  /** Called with the target and the reason picked (or null). */
  onMove?: (to: string, reason: string | null) => void;
  /** The sheet's title and the button's name: `(state) => "Change the status, now " + state`. */
  menuLabel?: (state: string) => string;
  /** The second press: `(target) => "Confirm: " + target`. */
  confirmLabel?: (target: string) => string;
  /** The sheet of reasons: `(target) => target + " — pick a reason"`. */
  reasonLabel?: (target: string) => string;
  /** The sheet's cancel button ("Cancel"). */
  cancelLabel?: string;
  /** sm (default) · md. */
  size?: "sm" | "md";
};

/** The state of a status set; a sheet of the allowed moves when there are some. */
export function StatusChip({
  label,
  tone = "neutral",
  moves = [],
  onMove,
  menuLabel = (state) => `Change the status, now ${state}`,
  confirmLabel = (target) => `Confirm: ${target}`,
  reasonLabel = (target) => `${target} — pick a reason`,
  cancelLabel = "Cancel",
  size = "sm",
}: StatusChipProps) {
  const [open, setOpen] = React.useState(false);
  const [armed, setArmed] = React.useState<string | null>(null);
  const [asking, setAsking] = React.useState<StatusMoveOption | null>(null);
  const badge = (
    <Badge tone={tone} size={size} dot>
      {label}
    </Badge>
  );
  if (!onMove || moves.length === 0) return badge;
  return (
    <>
      <Pressable role="button" aria-label={menuLabel(label)} aria-haspopup="menu" hitSlop={8} onPress={() => setOpen(true)} style={{ alignSelf: "flex-start" }}>
        {badge}
      </Pressable>
      <ActionSheet
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setArmed(null);
        }}
        title={menuLabel(label)}
        cancelLabel={cancelLabel}
        actions={moves.map((move) => ({
          label: move.confirm && armed === move.key ? confirmLabel(move.label) : move.label,
          onPress: () => {
            if (move.reasons && move.reasons.length > 0) {
              setAsking(move);
              return;
            }
            if (move.confirm && armed !== move.key) {
              // The first press asks: the sheet comes back saying « Confirm: … ».
              setArmed(move.key);
              setTimeout(() => setOpen(true), 0);
              return;
            }
            setArmed(null);
            onMove(move.key, null);
          },
        }))}
      />
      <ActionSheet
        open={asking !== null}
        onOpenChange={(next) => !next && setAsking(null)}
        title={asking ? reasonLabel(asking.label) : ""}
        cancelLabel={cancelLabel}
        actions={(asking?.reasons ?? []).map((reason) => ({
          label: reason.label,
          onPress: () => {
            const to = asking?.key;
            setAsking(null);
            if (to) onMove(to, reason.key);
          },
        }))}
      />
    </>
  );
}
