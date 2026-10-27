"use client";

/* The stage's playground: the component itself (not an example), its controls read from the registry (a union of strings
   is a segmented choice, a boolean a switch), the text and the number one may change, and the JSX of what is shown,
   to copy. Every control is a component of @krizaka/ui. */

import { format } from "@krizaka/i18n";
import { Chip } from "@krizaka/ui/chip";
import { CodeBlock } from "@krizaka/ui/code-block";
import { Input } from "@krizaka/ui/field";
import { Slider } from "@krizaka/ui/slider";
import { Switch } from "@krizaka/ui/switch";
import { type ComponentType, lazy, Suspense, useId, useState } from "react";

import { type PlaygroundControl, playgroundJsx, type PlaygroundName,PLAYGROUNDS } from "@/lib/ui-playgrounds";

type AnyComponent = ComponentType<Record<string, unknown>>;

/** The component of each playground, loaded with the page that shows it. */
const LOADERS: Record<PlaygroundName, () => Promise<AnyComponent>> = {
  button: () => import("@krizaka/ui/button").then((m) => m.Button as AnyComponent),
  badge: () => import("@krizaka/ui/badge").then((m) => m.Badge as AnyComponent),
  progress: () => import("@krizaka/ui/progress").then((m) => m.Progress as AnyComponent),
  meter: () => import("@krizaka/ui/meter").then((m) => m.Meter as AnyComponent),
  switch: () => import("@krizaka/ui/switch").then((m) => m.Switch as AnyComponent),
  chip: () => import("@krizaka/ui/chip").then((m) => m.Chip as unknown as AnyComponent),
  "verified-badge": () => import("@krizaka/ui/verified-badge").then((m) => m.VerifiedBadge as AnyComponent),
  loader: () => import("@krizaka/ui/loader").then((m) => m.Loader as unknown as AnyComponent),
  card: () => import("@krizaka/ui/card").then((m) => m.CardRoot as unknown as AnyComponent),
  checkbox: () => import("@krizaka/ui/checkbox").then((m) => m.Checkbox as unknown as AnyComponent),
  kbd: () => import("@krizaka/ui/kbd").then((m) => m.Kbd as unknown as AnyComponent),
  pagination: () => import("@krizaka/ui/pagination").then((m) => m.Pagination as unknown as AnyComponent),
  "search-field": () => import("@krizaka/ui/search-field").then((m) => m.SearchField as unknown as AnyComponent),
  slider: () => import("@krizaka/ui/slider").then((m) => m.Slider as unknown as AnyComponent),
  spinner: () => import("@krizaka/ui/spinner").then((m) => m.Spinner as unknown as AnyComponent),
};

/* One lazy component per playground, made once at load: its module is fetched when the first one is drawn, in a Suspense. */
const LAZY_PLAYGROUNDS = Object.fromEntries(
  (Object.keys(LOADERS) as PlaygroundName[]).map((name) => [name, lazy(async () => ({ default: await LOADERS[name]() }))]),
) as unknown as Record<PlaygroundName, AnyComponent>;

export interface PlaygroundWords {
  controls: string;
  text: string;
  number: string;
  code: string;
  copy: string;
  copied: string;
}

export function Playground({ name, controls, words }: { name: PlaygroundName; controls: PlaygroundControl[]; words: PlaygroundWords }) {
  const spec = PLAYGROUNDS[name];
  const id = useId();
  const [values, setValues] = useState<Record<string, string | boolean>>(() =>
    Object.fromEntries(controls.map((c) => [c.prop, ("start" in spec ? (spec.start as Record<string, string | boolean>)[c.prop] : undefined) ?? c.initial])),
  );
  const [text, setText] = useState("text" in spec ? spec.text.value : "");
  const [number, setNumber] = useState("number" in spec ? spec.number.value : 0);
  const Component = LAZY_PLAYGROUNDS[name];

  const props: Record<string, unknown> = { ...spec.base, ...values };
  if ("text" in spec) props[spec.text.prop] = text;
  if ("number" in spec) props[spec.number.prop] = number;
  const jsx = playgroundJsx(spec, controls, values, text, number);

  return (
    <div className="kz-play">
      <div className="kz-play-canvas" aria-live="polite">
        <Suspense fallback={<span className="kz-play-wait" aria-hidden />}>
          <Component key={String(values.variant ?? "")} {...props} />
        </Suspense>
      </div>
      <div role="group" className="kz-play-controls" aria-label={words.controls}>
        {controls.map((control) =>
          control.kind === "enum" ? (
            <div key={control.prop} className="kz-play-row">
              <span className="kz-play-label" id={`${id}-${control.prop}`}>
                {control.prop}
              </span>
              {/* @ephemeral: a playground control, it edits a live preview and is never an address */}
              <Chip.Group type="single" required size="sm" label={control.prop} value={String(values[control.prop])} onValueChange={(v) => v && setValues((s) => ({ ...s, [control.prop]: v }))}>
                {control.options.map((option) => (
                  <Chip key={option} value={option}>
                    {option}
                  </Chip>
                ))}
              </Chip.Group>
            </div>
          ) : (
            <div key={control.prop} className="kz-play-row kz-play-row-inline">
              <span className="kz-play-label">{control.prop}</span>
              <Switch size="sm" label={control.prop} checked={Boolean(values[control.prop])} onCheckedChange={(on) => setValues((s) => ({ ...s, [control.prop]: on }))} />
            </div>
          ),
        )}
        {"text" in spec && (
          <label className="kz-play-row">
            <span className="kz-play-label">{format(words.text, { prop: spec.text.prop })}</span>
            <Input value={text} onChange={(event) => setText(event.target.value)} maxLength={40} />
          </label>
        )}
        {"number" in spec && (
          <div className="kz-play-row">
            <span className="kz-play-label">{format(words.number, { prop: spec.number.prop })}</span>
            <Slider label={spec.number.prop} min={spec.number.min} max={spec.number.max} value={number} onValueChange={(v) => setNumber(v)} />
          </div>
        )}
      </div>
      <div className="kz-play-code">
        <CodeBlock code={jsx} language="tsx" copyLabel={words.copy} copiedLabel={words.copied} aria-label={words.code} />
      </div>
    </div>
  );
}
