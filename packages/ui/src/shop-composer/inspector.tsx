"use client";

// The inspector (ADR-007 §5): for the selected section, the variant as a radio group of live thumbnails, the settings as a form
// generated from the zod schema of its type, the owner's own words (title and line, in each language), and the blocks as a
// sortable list (Move up / Move down, no drag needed). The look of the whole page is the first tab's concern: see `LookPanel`.
import { Button } from "@krizaka/ui/button";
import { RadioGroup } from "@krizaka/ui/radio-group";
import * as React from "react";

import { sectionDefinition } from "../shop/catalogue";
import type { Section } from "../shop/schema";
import type { Command } from "./commands";
import { newKey } from "./keys";
import { fill, type ShopComposerMessages } from "./messages";
import { SettingsForm } from "./settings-form";
import { SectionThumbnail } from "./thumbnails";

export type InspectorProps = {
  section: Section;
  name: string;
  messages: ShopComposerMessages;
  run: (cmd: Command, merge?: string) => void;
  /** Bumped when the document changes from outside the form (undo, redo): the settings form remounts. */
  epoch: number;
  announce: (message: string) => void;
  onInvalid: (key: string, invalid: boolean) => void;
  /** The page's look, so a thumbnail wears it. */
  preset?: string;
  density?: "compact" | "airy";
};

function Words({ section, m, run }: Pick<InspectorProps, "section" | "run"> & { m: ShopComposerMessages }) {
  const id = React.useId();
  const text = section.text ?? {};
  const field = (name: "title" | "lead", label: string) => (
    <fieldset className="m-0 grid gap-1.5 border-0 p-0">
      <legend className="mb-1 text-xs font-semibold text-fg-secondary">{label}</legend>
      {(["fr", "en"] as const).map((lang) => (
        <div key={lang} className="flex flex-col gap-1">
          <label htmlFor={`${id}-${name}-${lang}`} className="text-xs text-fg-secondary">{lang === "fr" ? m.french : m.english}</label>
          <input
            id={`${id}-${name}-${lang}`}
            className="min-h-10 rounded-md border border-border-control bg-surface-1 px-3 text-sm text-fg focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
            maxLength={600}
            value={text[name]?.[lang] ?? ""}
            onChange={(e) => {
              const next = { ...(text[name] ?? {}), [lang]: e.target.value || undefined };
              const empty = !next.fr && !next.en;
              run({ type: "setText", key: section.key, field: name, value: empty ? undefined : next }, `text:${section.key}:${name}:${lang}`);
            }}
          />
        </div>
      ))}
    </fieldset>
  );
  return (
    <section aria-label={m.words} className="grid gap-3">
      <h3 className="m-0 text-sm font-semibold text-fg">{m.words}</h3>
      {field("title", m.titleField)}
      {field("lead", m.leadField)}
    </section>
  );
}

function Blocks({ section, m, run, announce }: Pick<InspectorProps, "section" | "run" | "announce"> & { m: ShopComposerMessages }) {
  const def = sectionDefinition(section.type);
  const blocks = ((section.blocks ?? []) as { key: string; type: string }[]);
  if (def.blockTypes.length === 0) return null;
  const label = (b: { type: string }, i: number) => `${m.blockNames[b.type] ?? b.type} ${i + 1}`;
  const move = (i: number, to: number) => {
    const b = blocks[i]!;
    if (to < 0 || to >= blocks.length) return;
    run({ type: "moveBlock", key: section.key, blockKey: b.key, to });
    announce(fill(m.announceMoved, { name: label(b, i), n: to + 1, total: blocks.length }));
  };
  return (
    <section aria-label={m.blocks} className="grid gap-2">
      <h3 className="m-0 text-sm font-semibold text-fg">{m.blocks}</h3>
      {blocks.length > 0 && (
        <ol className="m-0 grid list-none gap-1 p-0">
          {blocks.map((b, i) => (
            <li key={b.key} className="flex items-center gap-1 rounded-md border border-border-default bg-surface-1 ps-3">
              <span className="min-w-0 flex-1 truncate text-sm text-fg">{label(b, i)}</span>
              <Button size="sm" variant="ghost" disabled={i === 0} aria-label={`${m.moveUp}: ${label(b, i)}`} onClick={() => move(i, i - 1)}>↑</Button>
              <Button size="sm" variant="ghost" disabled={i === blocks.length - 1} aria-label={`${m.moveDown}: ${label(b, i)}`} onClick={() => move(i, i + 1)}>↓</Button>
              <Button size="sm" variant="ghost" aria-label={fill(m.removeBlock, { name: label(b, i) })} onClick={() => run({ type: "removeBlock", key: section.key, blockKey: b.key })}>×</Button>
            </li>
          ))}
        </ol>
      )}
      <div className="flex flex-wrap gap-2">
        {def.blockTypes.map((type) => (
          <Button key={type} size="sm" variant="outline" onClick={() => run({ type: "addBlock", key: section.key, blockKey: newKey("b"), blockType: type, settings: defaultBlockSettings(type) })}>
            {m.addBlock} · {m.blockNames[type] ?? type}
          </Button>
        ))}
      </div>
    </section>
  );
}

/** The first settings of a new block: what its schema needs to be valid (a product then fills the references). */
function defaultBlockSettings(type: string): Record<string, unknown> {
  switch (type) {
    case "fact": return { kind: "open-now" };
    case "note": return { text: "…" };
    case "flyer": return { text: "…" };
    case "photo": return { mediaId: "" };
    case "service": return { serviceId: "" };
    case "member": return { memberId: "" };
    case "reel": return { platform: "tiktok", url: "https://" };
    case "link": return { platform: "instagram", url: "https://" };
    case "question": return { question: {}, answer: {} };
    default: return {};
  }
}

export function Inspector({ section, name, messages: m, run, epoch, announce, onInvalid, preset, density }: InspectorProps) {
  const def = sectionDefinition(section.type);
  const label = React.useId();
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <section aria-labelledby={label} className="grid gap-2">
        <h3 id={label} className="m-0 text-sm font-semibold text-fg">{m.variant}</h3>
        {/* The thumbnail is a section: it holds links and buttons, so it sits beside the radio, never inside it. */}
        <RadioGroup.Root label={`${name}: ${m.variant}`} value={section.variant} onValueChange={(variant) => run({ type: "setVariant", key: section.key, variant })} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {def.variants.map((variant) => (
            <div
              key={variant}
              role="presentation"
              data-checked={section.variant === variant ? "" : undefined}
              onClick={() => run({ type: "setVariant", key: section.key, variant })}
              className="grid cursor-pointer gap-2 rounded-lg border border-border-default bg-surface-1 p-2 data-[checked]:border-accent data-[checked]:bg-accent-soft"
            >
              <SectionThumbnail type={section.type} variant={variant} preset={preset} density={density} />
              <RadioGroup.Item value={variant}>{m.variantNames[`${section.type}.${variant}`] ?? variant}</RadioGroup.Item>
            </div>
          ))}
        </RadioGroup.Root>
      </section>
      <SettingsForm
        key={`${section.key}:${epoch}`}
        section={section}
        messages={m}
        onValid={(settings) => run({ type: "patchSettings", key: section.key, patch: settings }, `settings:${section.key}`)}
        onInvalid={(invalid) => onInvalid(section.key, invalid)}
      />
      <Blocks section={section} m={m} run={run} announce={announce} />
      <Words section={section} m={m} run={run} />
    </div>
  );
}
