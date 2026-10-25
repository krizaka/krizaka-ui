"use client";
// Client (switches and chips). What reaches a person: categories down, channels across, a switch at each crossing, and
// presets that set the whole matrix at once. The value is controlled and plain data; the words are props.
import * as React from "react";
import { tv } from "tailwind-variants";

import { Chip } from "../chip";
import { Switch } from "../switch";

export const notificationPreferences = tv({
  slots: {
    root: "flex flex-col gap-3",
    hint: "text-xs text-fg-secondary",
    table: "w-full overflow-hidden rounded-2xl border border-border-default text-left",
    head: "bg-surface-2 text-xs font-semibold text-fg-secondary",
    channelCell: "w-16 px-2 py-2.5 text-center sm:w-24",
    cornerCell: "px-4 py-2.5",
    row: "border-t border-border-subtle",
    category: "px-4 py-3 text-left font-normal",
    name: "block text-sm font-semibold text-fg",
    note: "block text-xs text-fg-secondary",
    cell: "px-2 py-3 text-center",
  },
});

/** Category id → channel id → on. A missing entry is off; a crossing a category does not use (see `channels`) is never written. */
export type NotificationMatrix = Record<string, Record<string, boolean>>;

export type NotificationChannel = {
  /** Its key in the matrix (`app`, `email`). */
  id: string;
  /** The column's name (`In the app`, `By e-mail`). */
  label: string;
  /** The whole column is inert (e-mail is off for the account). */
  disabled?: boolean;
};

export type NotificationCategory = {
  /** Its key in the matrix (`social`, `security`). */
  id: string;
  /** The row's name. */
  label: string;
  /** What these notifications are, one line. */
  description?: string;
  /** The channels this category can use (ids); left out, every channel. Other crossings show no switch. */
  channels?: readonly string[];
  /** Always on, and shown so (security): the switches are inert and `lockedNote` replaces the description. */
  locked?: boolean;
  lockedNote?: string;
};

export type NotificationPreset = {
  /** Its key (`everything`, `essentials`). */
  id: string;
  /** The chip's words. */
  label: string;
  /** What the preset does, one sentence, shown while it is the one in force. */
  hint: string;
  /** The matrix it sets (locked categories stay on and inert channels keep their value, whatever it says). */
  value: NotificationMatrix;
};

export type NotificationPreferencesProps = {
  /** The group's accessible name (`Notification settings`). */
  label: string;
  /** The columns: where a notification can go. */
  channels: readonly NotificationChannel[];
  /** The rows: what can be sent. */
  categories: readonly NotificationCategory[];
  /** What is on, by category then channel (controlled). */
  value: NotificationMatrix;
  /** Called with the whole matrix after a switch or a preset — normalised: locked rows on, inert channels unchanged, unused crossings absent. */
  onValueChange: (next: NotificationMatrix) => void;
  /** Quick settings above the matrix (`Everything`, `Essentials`, `Nothing`). */
  presets?: readonly NotificationPreset[];
  /** The presets' own accessible name (`Presets`). Required with `presets`. */
  presetsLabel?: string;
  /** Said under the presets when the matrix matches none (`Custom`). */
  customHint?: string;
  /** Classes merged on the root. */
  className?: string;
};

const uses = (c: NotificationCategory, channel: string) => !c.channels || c.channels.includes(channel);

// Only what a preset can change counts: not the locked rows, the inert channels, or the crossings a category does not use.
const same = (a: NotificationMatrix, b: NotificationMatrix, categories: readonly NotificationCategory[], channels: readonly NotificationChannel[]) =>
  categories.every((c) => c.locked || channels.every((ch) => ch.disabled || !uses(c, ch.id) || Boolean(a[c.id]?.[ch.id]) === Boolean(b[c.id]?.[ch.id])));

/** The preset in force, or null for a custom matrix. */
export function presetInForce(value: NotificationMatrix, presets: readonly NotificationPreset[], categories: readonly NotificationCategory[], channels: readonly NotificationChannel[]): string | null {
  return presets.find((p) => same(value, p.value, categories, channels))?.id ?? null;
}

/**
 * The matrix the controls can show: every crossing a category uses, locked rows on, an inert channel keeping its
 * `current` value whatever `next` says, and nothing for the crossings a category does not use.
 */
export function normalizeMatrix(next: NotificationMatrix, current: NotificationMatrix, categories: readonly NotificationCategory[], channels: readonly NotificationChannel[]): NotificationMatrix {
  return Object.fromEntries(
    categories.map((c) => [
      c.id,
      Object.fromEntries(
        channels.filter((ch) => uses(c, ch.id)).map((ch) => [ch.id, c.locked ? true : Boolean((ch.disabled ? current : next)[c.id]?.[ch.id])]),
      ),
    ]),
  );
}

export function NotificationPreferences({ label, channels, categories, value, onValueChange, presets, presetsLabel, customHint, className }: NotificationPreferencesProps) {
  const s = notificationPreferences();
  const inForce = presets ? presetInForce(value, presets, categories, channels) : null;
  const emit = (next: NotificationMatrix) => onValueChange(normalizeMatrix(next, value, categories, channels));
  const set = (category: string, channel: string, on: boolean) => emit({ ...value, [category]: { ...value[category], [channel]: on } });
  return (
    <div className={s.root({ className })} role="group" aria-label={label}>
      {presets && presets.length > 0 && (
        <div>
          <Chip.Group type="single" required label={presetsLabel ?? label} value={inForce ?? ""} onValueChange={(id) => { const p = presets.find((x) => x.id === id); if (p) emit(p.value); }}>
            {presets.map((p) => (
              <Chip key={p.id} value={p.id}>
                {p.label}
              </Chip>
            ))}
          </Chip.Group>
          <p className={s.hint({ className: "mt-2" })}>{inForce ? presets.find((p) => p.id === inForce)?.hint : customHint}</p>
        </div>
      )}
      <table className={s.table()}>
        <thead className={s.head()}>
          <tr>
            <td className={s.cornerCell()} />
            {channels.map((ch) => (
              <th key={ch.id} scope="col" className={s.channelCell()}>
                {ch.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className={s.row()}>
              <th scope="row" className={s.category()}>
                <span className={s.name()}>{c.label}</span>
                {(c.locked ? c.lockedNote : c.description) && <span className={s.note()}>{c.locked ? c.lockedNote : c.description}</span>}
              </th>
              {channels.map((ch) => (
                <td key={ch.id} className={s.cell()}>
                  {uses(c, ch.id) ? (
                    <Switch label={`${c.label} — ${ch.label}`} checked={c.locked || Boolean(value[c.id]?.[ch.id])} disabled={c.locked || ch.disabled} onCheckedChange={(on) => set(c.id, ch.id, on)} />
                  ) : (
                    <span aria-hidden className={s.note()}>
                      –
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
