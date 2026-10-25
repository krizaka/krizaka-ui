// Client (radio groups). How the workspace looks (ADR-006 §4, krizaka-ui#657): theme cards — a radio group of live miniatures
// drawn from the tokens' own colours, one check on the chosen card —, then rows for the accent, the density, the language and, when the
// product offers it, the sound (off by default, never under reduced motion). Driven by data: the product passes the themes it offers
// (a subset of `appearance.themes` of @krizaka/tokens, at least system · light · dark), the accents that read on all of them, the values
// and `onChange`s. It changes nothing by itself: `useAppearance()` of `@krizaka/ui/theme` applies the choice at once and keeps it in
// the browser; the product saves it in the account too. Paper themes never belong here.
import * as React from "react";

import { Field } from "../field";
import { RadioGroup } from "../radio-group";
import { SettingsRow } from "../settings-layout";
import { Switch } from "../switch";
import { type LanguageOption, LanguagePicker } from "./language-picker";

/** The colours a theme's miniature is drawn with (`appearance.themes[i].preview` of @krizaka/tokens). */
export type ThemePreview = { surface0: string; surface1: string; surface2: string; text: string; muted: string };

export type ThemeCardOption = {
  /** `system`, `light`, `dark`, `blueprint`, `carbone`. */
  id: string;
  /** Its name, passed translated. */
  label: string;
  /** One line: what it is, passed translated. */
  description?: string;
  /** Its colours; null for `system`, whose miniature is half light, half dark. */
  preview: ThemePreview | null;
  /** The two halves of the System miniature (`appearance.themes` light and dark previews). */
  halves?: readonly [ThemePreview, ThemePreview];
};

export type AccentOption = {
  /** The brand id (`data-accent`). */
  id: string;
  /** Its name, passed translated ("Forest green"). */
  label: string;
  /** Its fill, for the swatch (`appearance.accents[i].dark.accent`). */
  color: string;
};

export type AppearanceLabels = {
  /** The theme row: its name. */
  theme: string;
  /** One line under it. */
  themeHint: string;
  /** The accent row: its name. */
  accent: string;
  /** One line under it. */
  accentHint: string;
  /** The density row: its name. */
  density: string;
  /** One line under it. */
  densityHint: string;
  /** The language row: its name. */
  language: string;
  /** One line under it. */
  languageHint: string;
  /** The sound row: its name. */
  sound: string;
  /** One line under it. */
  soundHint: string;
};

export const appearanceLabels: AppearanceLabels = {
  theme: "Theme",
  themeHint: "The look of the workspace. System follows your device.",
  accent: "Accent colour",
  accentHint: "The colour of buttons and highlights.",
  density: "Density",
  densityHint: "How much fits on a screen.",
  language: "Language",
  languageHint: "The whole interface.",
  sound: "Sound",
  soundHint: "Small sounds when something is done. Off unless you turn it on, and never with reduced motion.",
};

export type AppearanceSettingsProps = {
  /** The themes offered: at least system, light and dark. */
  themes: readonly ThemeCardOption[];
  /** The id of the theme chosen. */
  theme: string;
  /** Called with the id chosen. */
  onThemeChange: (id: string) => void;
  /** The accents offered (the product's own first). Without it the row is not shown. */
  accents?: readonly AccentOption[];
  /** The id of the accent chosen; null for the product's own. */
  accent?: string | null;
  /** Called with the id chosen. */
  onAccentChange?: (id: string) => void;
  /** The densities offered, with their names (`standard`, `compact`). */
  densities?: readonly { value: string; label: string }[];
  /** The density chosen. */
  density?: string;
  /** Called with the density chosen. */
  onDensityChange?: (density: string) => void;
  /** The languages offered, each named in its own language. */
  languages?: readonly LanguageOption[];
  /** The code of the language chosen. */
  language?: string;
  /** Called with the code chosen. */
  onLanguageChange?: (code: string) => void;
  /** Shown only when given: the sound is opt-in. */
  sound?: boolean;
  /** Called with the new state. */
  onSoundChange?: (on: boolean) => void;
  /** The words, passed translated (English by default). */
  labels?: Partial<AppearanceLabels>;
  /** Classes merged on the root. */
  className?: string;
};

function Miniature({ preview }: { preview: ThemePreview }) {
  return (
    <span
      aria-hidden
      className="flex h-16 w-full overflow-hidden rounded-md border border-border-default"
      style={{ background: preview.surface0 }}
    >
      <span className="m-1.5 flex w-1/3 flex-col gap-1 rounded-sm p-1" style={{ background: preview.surface1 }}>
        <span className="h-1 w-3/4 rounded-full" style={{ background: preview.text }} />
        <span className="h-1 w-1/2 rounded-full" style={{ background: preview.muted }} />
      </span>
      <span className="my-1.5 mr-1.5 flex flex-1 flex-col gap-1 rounded-sm p-1.5" style={{ background: preview.surface2 }}>
        <span className="h-1.5 w-2/3 rounded-full" style={{ background: preview.text }} />
        <span className="h-1 w-full rounded-full" style={{ background: preview.muted }} />
        <span className="h-1 w-5/6 rounded-full" style={{ background: preview.muted }} />
        <span className="mt-auto h-2 w-1/3 rounded-sm bg-accent" />
      </span>
    </span>
  );
}

/** The appearance rows of a settings page: theme cards, accent, density, language, sound. */
export function AppearanceSettings({
  themes,
  theme,
  onThemeChange,
  accents,
  accent,
  onAccentChange,
  densities,
  density,
  onDensityChange,
  languages,
  language,
  onLanguageChange,
  sound,
  onSoundChange,
  labels: given,
  className,
}: AppearanceSettingsProps) {
  const labels = { ...appearanceLabels, ...given };
  const id = React.useId();
  return (
    <div className={className}>
      <SettingsRow label={labels.theme} description={labels.themeHint}>
        <RadioGroup.Root variant="cards" label={labels.theme} value={theme} onValueChange={onThemeChange} className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
          {themes.map((option) => (
            <RadioGroup.Card key={option.id} value={option.id} aria-describedby={option.description ? `${id}-${option.id}` : undefined}>
              {option.preview ? (
                <Miniature preview={option.preview} />
              ) : option.halves ? (
                <span aria-hidden className="grid h-16 w-full grid-cols-2 overflow-hidden rounded-md border border-border-default">
                  <Miniature preview={option.halves[0]} />
                  <Miniature preview={option.halves[1]} />
                </span>
              ) : null}
              <span className="font-semibold text-fg">{option.label}</span>
              {option.description ? (
                <span id={`${id}-${option.id}`} className="text-xs font-normal text-fg-secondary">
                  {option.description}
                </span>
              ) : null}
            </RadioGroup.Card>
          ))}
        </RadioGroup.Root>
      </SettingsRow>
      {accents && accents.length > 0 && onAccentChange ? (
        <SettingsRow label={labels.accent} description={labels.accentHint} htmlFor={`${id}-accent`}>
          <span className="flex items-center gap-2">
            <span aria-hidden className="h-4 w-4 rounded-full border border-border-default" style={{ background: accents.find((a) => a.id === accent)?.color ?? accents[0]?.color }} />
            <Field.Root>
              <select
                id={`${id}-accent`}
                value={accent ?? accents[0]?.id}
                onChange={(event) => onAccentChange(event.target.value)}
                className="h-10 rounded-lg border border-border-control bg-surface-2 px-3 text-sm text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              >
                {accents.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field.Root>
          </span>
        </SettingsRow>
      ) : null}
      {densities && densities.length > 0 && onDensityChange ? (
        <SettingsRow label={labels.density} description={labels.densityHint}>
          <RadioGroup.Root variant="segmented" label={labels.density} value={density} onValueChange={onDensityChange}>
            {densities.map((option) => (
              <RadioGroup.Segment key={option.value} value={option.value}>
                {option.label}
              </RadioGroup.Segment>
            ))}
          </RadioGroup.Root>
        </SettingsRow>
      ) : null}
      {languages && languages.length > 0 && onLanguageChange ? (
        <SettingsRow label={labels.language} description={labels.languageHint}>
          <LanguagePicker label={labels.language} showLabel={false} languages={languages} value={language ?? ""} onValueChange={onLanguageChange} />
        </SettingsRow>
      ) : null}
      {onSoundChange ? (
        <SettingsRow label={labels.sound} description={labels.soundHint}>
          <Switch label={labels.sound} checked={Boolean(sound)} onCheckedChange={onSoundChange} />
        </SettingsRow>
      ) : null}
    </div>
  );
}
