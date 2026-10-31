"use client";

// Our own shop composer (ADR-007 §5): three panes on a laptop — the outline of the sections, the live preview of the product's own
// public page, the inspector of the selected section — and two steps on a phone (the list, then the section; the preview behind a
// « View » button). Every change is a command on a reducer (⌘Z / ⇧⌘Z, 100 steps), saved to the draft after 800 ms of calm; « Publish »
// shows what changes and refuses while a setting is invalid. Every action has a keyboard path. No third-party editor: Puck was weighed
// and not adopted (the model is a list, not a canvas).
import { Button } from "@krizaka/ui/button";
import { Dialog } from "@krizaka/ui/dialog";
import { RadioGroup } from "@krizaka/ui/radio-group";
import * as React from "react";

import { cn } from "../cn";
import { SECTION_DEFINITIONS, type SectionType } from "../shop/catalogue";
import { postToPreview } from "../shop/preview";
import { parseShopPage, type ShopPage } from "../shop/schema";
import { type Command } from "./commands";
import { type DiffEntry, diffPages } from "./diff";
import { canRedo, canUndo, createHistory, type History, redo, run, undo } from "./history";
import { Inspector } from "./inspector";
import { newKey } from "./keys";
import { LookPicker } from "./look-picker";
import { defaultShopComposerMessages, fill, type ShopComposerMessages } from "./messages";
import { Outline, sectionLabel } from "./outline";
import { usePanels } from "./panels";

/** How long the draft waits for calm before it is saved. */
// @fixed: ADR-007 §5 — the autosave debounce of the editor, 800 ms; not a shop setting.
export const AUTOSAVE_MS = 800;

export type ShopComposerPreset = {
  id: string;
  version: number;
  name: string;
  density: "compact" | "airy";
  variants: Readonly<Record<string, string>>;
  /** A look's (`look-*`): the accent it starts with and the tested list the owner chooses from. Presets without a list are trade presets (the « Style » select). */
  accent?: string;
  accents?: readonly string[];
};

export type ShopComposerProps = {
  /** The draft to edit. The composer keeps its own history from it. */
  value: ShopPage;
  /** Change it to load another document (another draft): the history and the selection start again. */
  resetKey?: string | number;
  /** Called with a valid draft after 800 ms without a change: save it. A rejection says « Not saved ». */
  onChange?: (page: ShopPage) => void | Promise<void>;
  /** Called with the draft once the person confirmed the diff. */
  onPublish: (page: ShopPage) => void | Promise<void>;
  /** The discard of the draft (the product asks first, in its own dialog). Absent: no such button. */
  onDiscard?: () => void;
  /** What is live now, for the diff of « Publish ». Absent: the document the composer was opened with. */
  published?: ShopPage;
  /** The page of the product, in an iframe: its own route with `?draft=<id>`. Its origin is the bridge's. */
  previewUrl: string;
  /** The look presets of the shop's trade. */
  presets: readonly ShopComposerPreset[];
  /** The section types the trade does not use: folded under « … » in the catalogue. */
  foldedTypes?: readonly SectionType[];
  /** The words, translated. Default: English. */
  messages?: ShopComposerMessages;
  /** Classes merged on the root (its height: `h-[100dvh]`). */
  className?: string;
};

type State = { history: History; epoch: number };
type Action = { type: "run"; cmd: Command; merge?: string } | { type: "undo" } | { type: "redo" } | { type: "reset"; page: ShopPage };

function reducer(state: State, a: Action): State {
  switch (a.type) {
    case "run": {
      const history = run(state.history, a.cmd, a.merge);
      return history === state.history ? state : { ...state, history };
    }
    case "undo": {
      const history = undo(state.history);
      return history === state.history ? state : { history, epoch: state.epoch + 1 };
    }
    case "redo": {
      const history = redo(state.history);
      return history === state.history ? state : { history, epoch: state.epoch + 1 };
    }
    case "reset":
      return { history: createHistory(a.page), epoch: state.epoch + 1 };
  }
}

function PreviewFrame({ src, title, phone, frame }: { src: string; title: string; phone: boolean; frame: React.Ref<HTMLIFrameElement> }) {
  return (
    <div className="flex h-full min-h-0 justify-center overflow-auto bg-surface-2 p-3">
      <iframe ref={frame} src={src || undefined} title={title} data-device={phone ? "phone" : "desktop"} className={phone ? "h-full min-h-[34rem] w-[390px] max-w-full rounded-xl border border-border-default bg-surface-0" : "h-full min-h-[34rem] w-full rounded-xl border border-border-default bg-surface-0"} />
    </div>
  );
}

// The three columns on a laptop, by panel state: a folded panel is a 3rem rail with its button, so the preview keeps the room.
const COLUMNS: Record<string, string> = {
  "true-true": "lg:grid-cols-[15rem_minmax(0,1fr)_20rem]",
  "true-false": "lg:grid-cols-[15rem_minmax(0,1fr)_3rem]",
  "false-true": "lg:grid-cols-[3rem_minmax(0,1fr)_20rem]",
  "false-false": "lg:grid-cols-[3rem_minmax(0,1fr)_3rem]",
};

/** The grid of the three panes for the two panels' state (kept out of the className call). */
function columnsFor(p: { outline: boolean; inspector: boolean }): string {
  return COLUMNS[`${p.outline}-${p.inspector}`] ?? "";
}

/** The fold button of a side panel (laptop only): it stays in the rail when the panel is folded. */
function PanelToggle({ open, name, messages: m, onToggle, end }: { open: boolean; name: string; messages: ShopComposerMessages; onToggle: () => void; end?: boolean }) {
  const label = fill(open ? m.hidePanel : m.showPanel, { name });
  const arrow = open === !end ? "‹" : "›";
  return (
    <Button variant="ghost" size="sm" aria-expanded={open} aria-label={label} title={label} className={cn("hidden shrink-0 lg:inline-flex", end ? "self-end" : "self-start")} onClick={onToggle}>
      <span aria-hidden>{arrow}</span>
    </Button>
  );
}

/** The shop composer. */
export function ShopComposer({ value, resetKey, onChange, onPublish, onDiscard, published, previewUrl, presets, foldedTypes = [], messages = defaultShopComposerMessages, className }: ShopComposerProps) {
  const m = messages;
  const [{ history, epoch }, dispatch] = React.useReducer(reducer, value, (v): State => ({ history: createHistory(v), epoch: 0 }));
  const page = history.present;
  const [baseline, setBaseline] = React.useState(published ?? value);
  const [selected, setSelected] = React.useState<string | null>(page.sections[0]?.key ?? null);
  const [step, setStep] = React.useState<"list" | "section">("list");
  const [live, setLive] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "saving" | "saved" | "error">("idle");
  const [adding, setAdding] = React.useState(false);
  const [publishing, setPublishing] = React.useState(false);
  const [device, setDevice] = React.useState<"phone" | "desktop">("desktop");
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [invalid, setInvalid] = React.useState<ReadonlySet<string>>(new Set());
  const [focusRequest, setFocusRequest] = React.useState<{ key: string } | null>(null);
  const frame = React.useRef<HTMLIFrameElement | null>(null);
  const { panels, chosen, set: setPanels } = usePanels();
  const origin = React.useMemo(() => {
    try {
      return new URL(previewUrl, typeof location === "undefined" ? undefined : location.href).origin;
    } catch {
      return "";
    }
  }, [previewUrl]);

  // A `data:` or `about:` preview has an opaque origin (« null »): nothing can be addressed to it.
  const hasOrigin = origin !== "" && origin !== "null";

  // A new document from outside (another draft): history and selection start again.
  const first = React.useRef(true);
  const saved = React.useRef(page);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    saved.current = value;
    dispatch({ type: "reset", page: value });
    setInvalid(new Set());
    setBaseline(published ?? value);
    setSelected(value.sections[0]?.key ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only a new `resetKey` reloads the document
  }, [resetKey]);

  const parsed = React.useMemo(() => parseShopPage(page), [page]);
  const looks = React.useMemo(() => presets.filter((p) => p.id.startsWith("look-")), [presets]);
  const styles = React.useMemo(() => presets.filter((p) => !p.id.startsWith("look-")), [presets]);
  const announce = React.useCallback((message: string) => setLive((prev) => (prev === message ? message + String.fromCodePoint(0x200b) : message)), []);
  const exec = React.useCallback((cmd: Command, merge?: string) => dispatch({ type: "run", cmd, merge }), []);
  const selectedSection = page.sections.find((s) => s.key === selected) ?? null;
  const selectedIndex = selectedSection ? page.sections.indexOf(selectedSection) : -1;

  // Autosave to the draft: a valid document, after a calm of 800 ms; the preview refreshes once it is saved.
  React.useEffect(() => {
    if (page === saved.current || !parsed.ok || !onChange) return;
    const timer = setTimeout(async () => {
      setStatus("saving");
      try {
        await onChange(page);
        saved.current = page;
        setStatus("saved");
        if (hasOrigin) postToPreview(frame.current?.contentWindow, origin, { source: "krizaka-shop-composer", type: "refresh" });
      } catch {
        setStatus("error");
      }
    }, AUTOSAVE_MS);
    return () => clearTimeout(timer);
  }, [page, parsed.ok, onChange, origin, hasOrigin]);

  // The preview follows the selection: outline and scroll.
  React.useEffect(() => {
    if (selected && hasOrigin) postToPreview(frame.current?.contentWindow, origin, { source: "krizaka-shop-composer", type: "scroll", key: selected });
  }, [selected, origin, hasOrigin]);

  const select = (key: string) => {
    setSelected(key);
    setStep("section");
    // Whoever never chose: picking a section opens its inspector. A person who folded it keeps it folded.
    if (!chosen) setPanels({ inspector: true });
  };

  const addSection = (type: SectionType) => {
    const def = SECTION_DEFINITIONS.find((d) => d.type === type)!;
    const preferred = presets.find((p) => p.id === page.preset.id)?.variants[type];
    const variant = preferred && (def.variants as readonly string[]).includes(preferred) ? preferred : undefined;
    const key = newKey("s");
    const at = type === "hero" ? 0 : page.sections.length;
    exec({ type: "addSection", sectionType: type, key, variant, at });
    setAdding(false);
    setSelected(key);
    setFocusRequest({ key });
    announce(fill(m.announceAdded, { name: m.sectionNames[type], n: at + 1 }));
  };

  // Undo and redo hand the form a document it did not write: what it said was invalid is no longer true.
  const step_ = (direction: "undo" | "redo") => {
    dispatch({ type: direction });
    setInvalid(new Set());
    announce(direction === "undo" ? m.announceUndone : m.announceRedone);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "z") return;
    const el = e.target as HTMLElement;
    if (el.closest("input, textarea, select, [contenteditable=true]")) return;
    e.preventDefault();
    step_(e.shiftKey ? "redo" : "undo");
  };

  const changes: DiffEntry[] = publishing ? diffPages(baseline, page) : [];
  const nameOfKey = (key: string) => {
    const i = page.sections.findIndex((s) => s.key === key);
    if (i >= 0) return sectionLabel(page.sections, i, m);
    const was = baseline.sections.findIndex((s) => s.key === key);
    return was >= 0 ? sectionLabel(baseline.sections, was, m) : key;
  };
  const problems = [
    ...[...invalid].filter((key) => page.sections.some((s) => s.key === key)).map((key) => ({ key, text: fill(m.problemIn, { name: nameOfKey(key) }) })),
    ...(!parsed.ok ? parsed.issues.map((i) => ({ key: i.path, text: `${i.path}: ${i.message}` })) : []),
  ];
  const describe = (d: DiffEntry): string => {
    const name = "key" in d ? nameOfKey(d.key) : "";
    const t = m.diff[d.kind];
    switch (d.kind) {
      case "moved": return fill(t, { name, from: d.from + 1, to: d.to + 1 });
      case "variant": return fill(t, { name, from: m.variantNames[`${d.type}.${d.from}`] ?? d.from, to: m.variantNames[`${d.type}.${d.to}`] ?? d.to });
      case "preset": return fill(t, { from: presets.find((p) => p.id === d.from)?.name ?? d.from, to: presets.find((p) => p.id === d.to)?.name ?? d.to });
      case "density": return fill(t, { from: d.from ?? "—", to: d.to ?? "—" });
      default: return fill(t, { name });
    }
  };

  const status_ = status === "saving" ? m.saving : status === "saved" ? m.saved : status === "error" ? m.saveFailed : "";

  return (
    <div className={cn("kz-composer flex min-h-0 flex-col gap-3", className)} onKeyDown={onKeyDown} data-step={step}>
      <header className="flex flex-wrap items-center gap-2 border-b border-border-subtle pb-2">
        <h2 className="m-0 me-auto text-base font-semibold text-fg">{m.title}</h2>
        <span role="status" aria-live="polite" className="text-xs text-fg-secondary">{status_}</span>
        <Button variant="ghost" size="sm" disabled={!canUndo(history)} onClick={() => step_("undo")} aria-keyshortcuts="Control+Z Meta+Z">{m.undo}</Button>
        <Button variant="ghost" size="sm" disabled={!canRedo(history)} onClick={() => step_("redo")} aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z">{m.redo}</Button>
        {onDiscard && <Button variant="ghost" size="sm" onClick={onDiscard}>{m.discard}</Button>}
        <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setPreviewOpen(true)}>{m.viewPreview}</Button>
        <Button variant="primary" size="sm" onClick={() => setPublishing(true)}>{m.publish}</Button>
      </header>
      {/* One polite live region says every move, add, remove, undo. */}
      <p role="status" aria-live="polite" className="sr-only">{live}</p>

      <div data-panels={`${panels.outline ? "outline" : ""} ${panels.inspector ? "inspector" : ""}`.trim()} className={cn("grid min-h-0 flex-1 gap-4", columnsFor(panels))}>
        <aside aria-label={m.sections} className={cn("flex min-h-0 flex-col gap-4 overflow-y-auto", step === "section" && "hidden lg:flex")}>
          <PanelToggle open={panels.outline} name={m.sections} messages={m} onToggle={() => setPanels({ outline: !panels.outline })} />
          <div className={cn("flex min-h-0 flex-col gap-4", !panels.outline && "lg:hidden")}>
          <Outline sections={page.sections} selected={selected} onSelect={select} run={exec} messages={m} announce={announce} onAdd={() => setAdding(true)} focusRequest={focusRequest} />
          <details className="rounded-lg border border-border-default p-3" open>
            <summary className="min-h-9 cursor-pointer text-sm font-semibold text-fg">{m.look}</summary>
            <div className="mt-2 grid gap-3">
              {looks.length > 0 && <LookPicker looks={looks} page={page} messages={m} run={exec} announce={announce} />}
              {styles.length > 0 && <label className="grid gap-1 text-xs font-semibold text-fg-secondary">
                {m.preset}
                <select
                  className="min-h-10 rounded-md border border-border-control bg-surface-1 px-2 text-sm font-normal text-fg"
                  value={page.preset.id}
                  onChange={(e) => {
                    const p = presets.find((x) => x.id === e.target.value);
                    if (p) exec({ type: "setPreset", preset: { id: p.id, version: p.version }, density: null });
                  }}
                >
                  {styles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </label>}
              <RadioGroup.Root label={m.density} variant="segmented" value={page.density ?? presets.find((p) => p.id === page.preset.id)?.density ?? "compact"} onValueChange={(d) => exec({ type: "setDensity", density: d as "compact" | "airy" })}>
                <RadioGroup.Segment value="compact">{m.densityCompact}</RadioGroup.Segment>
                <RadioGroup.Segment value="airy">{m.densityAiry}</RadioGroup.Segment>
              </RadioGroup.Root>
            </div>
          </details>
          </div>
        </aside>

        <section aria-label={m.preview} className="hidden min-h-0 flex-col gap-2 lg:flex">
          <RadioGroup.Root label={m.preview} variant="segmented" value={device} onValueChange={(d) => setDevice(d as "phone" | "desktop")} className="self-start">
            <RadioGroup.Segment value="desktop">{m.desktop}</RadioGroup.Segment>
            <RadioGroup.Segment value="phone">{m.phone}</RadioGroup.Segment>
          </RadioGroup.Root>
          <PreviewFrame src={previewUrl} title={m.previewTitle} phone={device === "phone"} frame={frame} />
        </section>

        <aside aria-label={m.inspector} className={cn("flex min-h-0 flex-col gap-4 overflow-y-auto", step === "list" && "hidden lg:flex")}>
          <PanelToggle open={panels.inspector} name={m.inspector} messages={m} end onToggle={() => setPanels({ inspector: !panels.inspector })} />
          <Button variant="ghost" size="sm" className="self-start lg:hidden" onClick={() => setStep("list")}>← {m.backToSections}</Button>
          <div className={cn("flex min-h-0 flex-col gap-4", !panels.inspector && "lg:hidden")}>
          {selectedSection ? (
            <Inspector
              section={selectedSection}
              name={sectionLabel(page.sections, selectedIndex, m)}
              messages={m}
              run={exec}
              epoch={epoch}
              announce={announce}
              onInvalid={(key, bad) => setInvalid((prev) => { const next = new Set(prev); if (bad) next.add(key); else next.delete(key); return next.size === prev.size && next.has(key) === prev.has(key) ? prev : next; })}
              preset={page.preset.id}
              density={page.density}
            />
          ) : (
            <p className="m-0 text-sm text-fg-secondary">{m.noSelection}</p>
          )}
          </div>
        </aside>
      </div>

      <Dialog.Root open={adding} onOpenChange={setAdding}>
        <Dialog.Content closeLabel={m.cancel}>
          <Dialog.Header>
            <Dialog.Title>{m.addSection}</Dialog.Title>
            <Dialog.Description>{m.addSectionHint}</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            {[SECTION_DEFINITIONS.filter((d) => !foldedTypes.includes(d.type)), SECTION_DEFINITIONS.filter((d) => foldedTypes.includes(d.type))].map((group, g) => {
              const list = (
                <ul className="m-0 grid list-none gap-1 p-0">
                  {group.map((d) => (
                    <li key={d.type}>
                      <Button variant="ghost" className="w-full justify-start" disabled={d.type === "hero" && page.sections.some((s) => s.type === "hero")} onClick={() => addSection(d.type)}>
                        {m.sectionNames[d.type]}
                      </Button>
                    </li>
                  ))}
                </ul>
              );
              return group.length === 0 ? null : g === 0 ? <React.Fragment key={g}>{list}</React.Fragment> : <details key={g} className="mt-3"><summary className="min-h-9 cursor-pointer text-sm text-fg-secondary">…</summary>{list}</details>;
            })}
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root open={publishing} onOpenChange={setPublishing}>
        <Dialog.Content closeLabel={m.cancel}>
          <Dialog.Header>
            <Dialog.Title>{m.publishTitle}</Dialog.Title>
            <Dialog.Description>{m.publishWhat}</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            {problems.length > 0 && (
              <div role="alert" className="mb-3 rounded-md border border-border-control bg-surface-2 p-3">
                <p className="m-0 text-sm font-semibold text-fg">{fill(m.problemsTitle, { n: problems.length })}</p>
                <ul className="m-0 mt-1 list-disc ps-5 text-sm text-fg-secondary">{problems.map((p) => <li key={p.key}>{p.text}</li>)}</ul>
              </div>
            )}
            {changes.length === 0 ? (
              <p className="m-0 text-sm text-fg-secondary">{m.publishNothing}</p>
            ) : (
              <ul className="m-0 list-disc ps-5 text-sm text-fg">{changes.map((d, i) => <li key={i}>{describe(d)}</li>)}</ul>
            )}
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close asChild><Button variant="ghost">{m.cancel}</Button></Dialog.Close>
            <Button variant="primary" disabled={problems.length > 0 || !parsed.ok} onClick={async () => { await onPublish(page); setBaseline(page); setPublishing(false); }}>{m.publishConfirm}</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root open={previewOpen} onOpenChange={setPreviewOpen}>
        <Dialog.Content closeLabel={m.closePreview} size="lg">
          <Dialog.Header><Dialog.Title>{m.preview}</Dialog.Title></Dialog.Header>
          <Dialog.Body className="p-0">
            {previewOpen && <PreviewFrame src={previewUrl} title={m.previewTitle} phone frame={frame} />}
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
