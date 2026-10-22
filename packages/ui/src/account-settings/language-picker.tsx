// Client (a radio group). The language of the account, labelled, each language named in its own language, saved per user
// (the caller saves on change or with its section). Segmented: one light gliding to the choice.
import * as React from "react";

import { RadioGroup } from "../radio-group";

export interface LanguageOption {
  /** The BCP 47 code (`fr`, `en`): the value, and the `lang` of the name. */
  code: string;
  /** Its native name (`Français`, `English`) — never the current language's name for it. */
  name: string;
}

export type LanguagePickerProps = Omit<React.ComponentProps<typeof RadioGroup.Root>, "children" | "variant" | "label" | "aria-labelledby"> & {
  /** The visible label (“Language”) — passed translated. */
  label: React.ReactNode;
  /** One line under it: what it changes. */
  description?: React.ReactNode;
  /** The languages offered. */
  languages: readonly LanguageOption[];
  /** The chosen code (controlled). */
  value?: string;
  /** The viewer chooses another language. */
  onValueChange?: (code: string) => void;
};

/** The language control of an account page: a labelled segmented choice, native names. */
export function LanguagePicker({ label, description, languages, className, ...props }: LanguagePickerProps) {
  const id = React.useId();
  return (
    <div className={["flex flex-col gap-2", className].filter(Boolean).join(" ")}>
      <span id={`${id}-label`} className="text-sm font-medium text-fg">
        {label}
      </span>
      {description ? <span className="text-sm text-fg-secondary">{description}</span> : null}
      <RadioGroup.Root variant="segmented" aria-labelledby={`${id}-label`} {...props}>
        {languages.map((language) => (
          <RadioGroup.Segment key={language.code} value={language.code} lang={language.code}>
            {language.name}
          </RadioGroup.Segment>
        ))}
      </RadioGroup.Root>
    </div>
  );
}
