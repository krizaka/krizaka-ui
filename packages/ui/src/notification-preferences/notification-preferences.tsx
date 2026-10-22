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

/** Category id → channel id → on. A channel a category does not use is left out. */
export type NotificationMatrix = Record<string, Record<string, boolean>>;

export type NotificationChannel = {
  id: string;
  /** The column's name (`In the app`, `By e-mail`). */
  label: string;
  /** The whole column is inert (e-mail is off for the account). */
  disabled?: boolean;
};

export type NotificationCategory = {
  id: string;
  label: string;
  /** What these notifications are, one line. */
  description?: string;
  /** Always on, and shown so (security): the switches are inert and `lockedNote` replaces the description. */
  locked?: boolean;
  lockedNote?: string;
};

export type NotificationPreset = {
  id: string;
  label: string;
  /** What the preset does, one sentence, shown while it is the one in force. */
  hint: string;
  /** The matrix it sets (locked categories stay on whatever it says). */
  value: NotificationMatrix;
};

export type NotificationPreferencesProps = {
  /** The group's accessible name (`Notification settings`). */
  label: string;
  channels: readonly NotificationChannel[];
  categories: readonly NotificationCategory[];
  value: NotificationMatrix;
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

const same = (a: NotificationMatrix, b: NotificationMatrix, categories: readonly NotificationCategory[], channels: readonly NotificationChannel[]) =>
  categories.every((c) => c.locked || channels.every((ch) => Boolean(a[c.id]?.[ch.id]) === Boolean(b[c.id]?.[ch.id])));

/** The preset in force, or null for a custom matrix. */
export function presetInForce(value: NotificationMatrix, presets: readonly NotificationPreset[], categories: readonly NotificationCategory[], channels: readonly NotificationChannel[]): string | null {
  return presets.find((p) => same(value, p.value, categories, channels))?.id ?? null;
}

export function NotificationPreferences({ label, channels, categories, value, onValueChange, presets, presetsLabel, customHint, className }: NotificationPreferencesProps) {
  const s = notificationPreferences();
  const inForce = presets ? presetInForce(value, presets, categories, channels) : null;
  const set = (category: string, channel: string, on: boolean) => onValueChange({ ...value, [category]: { ...value[category], [channel]: on } });
  return (
    <div className={s.root({ className })} role="group" aria-label={label}>
      {presets && presets.length > 0 && (
        <div>
          <Chip.Group type="single" required label={presetsLabel ?? label} value={inForce ?? ""} onValueChange={(id) => { const p = presets.find((x) => x.id === id); if (p) onValueChange(p.value); }}>
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
                  <Switch label={`${c.label} — ${ch.label}`} checked={c.locked || Boolean(value[c.id]?.[ch.id])} disabled={c.locked || ch.disabled} onCheckedChange={(on) => set(c.id, ch.id, on)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
