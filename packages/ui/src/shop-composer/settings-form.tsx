"use client";

// The settings of a section, as a form generated from the zod schema of its type (ADR-007 §5): the form is `@krizaka/ui/form`
// (TanStack Form behind the facade), the fields are the ones the schema describes (`fields.ts`). Every valid change is committed to
// the document at once (so undo and the preview follow); an invalid value is said next to its field, stays in the field, and is
// reported to the composer, which refuses to publish until it is fixed.
import { createKrizakaForm, FormField, Switch, TextArea, TextField, useFormContext } from "@krizaka/ui/form";
import { RadioGroup } from "@krizaka/ui/radio-group";
import * as React from "react";

import { type SectionDefinition, sectionDefinition } from "../shop/catalogue";
import type { Section } from "../shop/schema";
import { describeSettings, type FieldSpec } from "./fields";
import type { ShopComposerMessages } from "./messages";

type Factory = ReturnType<typeof createKrizakaForm>;
// One form per section type, defined once (schema + defaults), as the facade asks.
const factories = new Map<string, Factory>();
function factoryFor(def: SectionDefinition): Factory {
  let f = factories.get(def.type);
  if (!f) {
    f = createKrizakaForm({ schema: def.settings as never, defaultValues: def.settingsDefault as never }) as unknown as Factory;
    factories.set(def.type, f);
  }
  return f;
}

const nameOf = (m: ShopComposerMessages, key: string) => m.settingNames[key] ?? key;
const optionName = (m: ShopComposerMessages, o: string | number) => m.optionNames[String(o)] ?? String(o);

function Choice({ spec, m }: { spec: Extract<FieldSpec, { kind: "choice" }>; m: ShopComposerMessages }) {
  return (
    <FormField name={spec.name}>
      {(f) => (
        <div className="grid gap-1.5">
        <span aria-hidden className="text-xs font-semibold text-fg-secondary">{nameOf(m, spec.name)}</span>
        <RadioGroup.Root label={nameOf(m, spec.name)} variant="segmented" value={String(f.value)} onValueChange={(v) => f.setValue(spec.options.find((o) => String(o) === v))} onBlur={f.onBlur}>
          {spec.options.map((o) => (
            <RadioGroup.Segment key={String(o)} value={String(o)}>{optionName(m, o)}</RadioGroup.Segment>
          ))}
        </RadioGroup.Root>
        </div>
      )}
    </FormField>
  );
}

function Multi({ spec, m }: { spec: Extract<FieldSpec, { kind: "multi" }>; m: ShopComposerMessages }) {
  return (
    <FormField name={spec.name}>
      {(f) => {
        const value = (f.value as string[] | undefined) ?? [];
        return (
          <fieldset className="m-0 flex flex-col gap-1.5 border-0 p-0">
            <legend className="mb-1 text-xs font-semibold text-fg-secondary">{nameOf(m, spec.name)}</legend>
            {spec.options.map((o) => (
              <label key={o} className="flex min-h-9 items-center gap-2 text-sm text-fg">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-accent"
                  checked={value.includes(o)}
                  onChange={(e) => f.setValue(e.target.checked ? [...value, o] : value.filter((x) => x !== o))}
                />
                {optionName(m, o)}
              </label>
            ))}
          </fieldset>
        );
      }}
    </FormField>
  );
}

function Field({ spec, m }: { spec: FieldSpec; m: ShopComposerMessages }) {
  switch (spec.kind) {
    case "choice":
      return <Choice spec={spec} m={m} />;
    case "multi":
      return <Multi spec={spec} m={m} />;
    case "toggle":
      return <Switch name={spec.name} label={nameOf(m, spec.name)} />;
    case "text":
      return <TextField name={spec.name} label={nameOf(m, spec.name)} />;
    case "localized":
      return (
        <div className="flex flex-col gap-2">
          <TextArea name={`${spec.name}.fr`} label={`${nameOf(m, spec.name)} — ${m.french}`} rows={3} maxLength={600} />
          <TextArea name={`${spec.name}.en`} label={`${nameOf(m, spec.name)} — ${m.english}`} rows={3} maxLength={600} />
        </div>
      );
  }
}

/** What the schema is asked: an emptied text is an absent setting (an optional id), an emptied language an absent language. */
function normalise(values: unknown): unknown {
  if (Array.isArray(values)) return values;
  if (typeof values !== "object" || values === null) return values;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(values)) {
    if (v === "") continue;
    const inner = typeof v === "object" && v !== null && !Array.isArray(v) ? normalise(v) : v;
    out[k] = inner;
  }
  return out;
}

/** Reports the form's values: a valid set goes to `onValid`, an invalid one to `onInvalid` (and never reaches the document). */
function Commit({ def, onValid, onInvalid }: { def: SectionDefinition; onValid: (settings: Record<string, unknown>) => void; onInvalid: (invalid: boolean) => void }) {
  const { api } = useFormContext();
  const latest = React.useRef({ onValid, onInvalid });
  React.useEffect(() => {
    latest.current = { onValid, onInvalid };
  });
  React.useEffect(() => {
    const sub = (api.store as { subscribe: (cb: () => void) => unknown }).subscribe(() => {
      const result = def.settings.safeParse(normalise(api.state.values));
      latest.current.onInvalid(!result.success);
      if (result.success) latest.current.onValid(result.data as Record<string, unknown>);
    });
    return () => {
      const s = sub as { unsubscribe?: () => void } | (() => void);
      if (typeof s === "function") s();
      else s?.unsubscribe?.();
    };
  }, [api, def]);
  return null;
}

export type SettingsFormProps = {
  section: Section;
  messages: ShopComposerMessages;
  /** A valid set of settings: the composer commits it. */
  onValid: (settings: Record<string, unknown>) => void;
  /** Whether the form holds a value the schema refuses (publish waits). */
  onInvalid: (invalid: boolean) => void;
};

/** The form of a section's settings: remount it (a `key`) when the document is changed from outside (undo, redo). */
export function SettingsForm({ section, messages: m, onValid, onInvalid }: SettingsFormProps) {
  const def = sectionDefinition(section.type);
  const factory = factoryFor(def);
  const form = factory.useForm({ defaultValues: section.settings as never }) as unknown as { Form: (p: { "aria-label": string; className?: string; children: React.ReactNode }) => React.ReactElement };
  const specs = describeSettings(def.settings);
  if (specs.length === 0) return null;
  return (
    <form.Form aria-label={m.settings} className="flex flex-col gap-4">
      {specs.map((spec) => (
        <Field key={spec.name} spec={spec} m={m} />
      ))}
      <Commit def={def} onValid={onValid} onInvalid={onInvalid} />
    </form.Form>
  );
}
