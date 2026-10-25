// Client (state, drag). The admin's editors of a kind's vocabulary (krizaka-ts#89, ADR-003 of krizaka-ts: « admin configures
// everything »): the tag set (the presets of a variant, who writes, may people add their own, the most) and the status set
// (the states in their order, each in French and English, its tone, final; the initial state; the moves from × to with the
// roles, a confirmation and the reasons). Each takes the descriptor and gives it back (`value` / `onChange`) and never holds the
// save logic: the product posts it, with the `version` it read. `problems` (from `kindConfigProblems`, the server's own rules)
// are shown in place. What the contract forbids is kept by construction (model.ts): a final state has no way out, the initial
// state is never final, a move goes to another state. Reorder: drag the handle, or the buttons, or Alt + ↑ ↓ in a name.
import type { Marker, StatusSet, StatusTone } from "@krizaka/organize/contract";
import * as React from "react";

import { Button } from "../button";
import { Chip, MarkerPicker, TagMarker } from "../chip";
import { cn } from "../cn";
import { Input, Select } from "../field";
import { SettingsRow } from "../settings-layout";
import { Switch } from "../switch";
import { type EditorRole, STATUS_TONES, type StatusSetEditorLabels, statusSetEditorLabels, type TagSetEditorLabels, tagSetEditorLabels } from "./labels";
import {
  addPreset,
  addReason,
  addState,
  clampMax,
  duplicatePresetNames,
  type Lang,
  movePreset,
  moveState,
  recolorPreset,
  removePreset,
  removeState,
  renamePreset,
  setFinal,
  setInitial,
  setStateLabel,
  setStateTone,
  setTransitionConfirm,
  setTransitionReasons,
  setTransitionRoles,
  type TagSetValue,
  transitionOf,
} from "./model";

export type { EditorRole, Lang, StatusSetEditorLabels, TagSetEditorLabels, TagSetValue };
export { statusSetEditorLabels, tagSetEditorLabels };


// --- shared ----------------------------------------------------------------------------------------------------------------

/** The problems the server's rules found, shown where the admin is working: a polite alert above the list. */
function Problems({ title, problems }: { title: string; problems: readonly string[] | undefined }) {
  if (!problems || problems.length === 0) return null;
  return (
    <div role="alert" className="flex flex-col gap-1 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2.5">
      <p className="m-0 text-xs font-semibold text-fg-danger">{title}</p>
      <ul className="m-0 flex list-disc flex-col gap-0.5 pl-5 text-xs text-fg">
        {problems.map((problem) => (
          <li key={problem}>{problem}</li>
        ))}
      </ul>
    </div>
  );
}

/** Drag a row by its handle, or move it with Alt + ↑ ↓ from a field: one pair of helpers for both lists. */
function useReorder(onMove: (from: number, to: number) => void) {
  const dragging = React.useRef<number | null>(null);
  return {
    row: (index: number) => ({
      onDragOver: (event: React.DragEvent) => {
        if (dragging.current !== null) event.preventDefault();
      },
      onDrop: (event: React.DragEvent) => {
        event.preventDefault();
        if (dragging.current !== null) onMove(dragging.current, index);
        dragging.current = null;
      },
    }),
    handle: (index: number) => ({
      draggable: true,
      onDragStart: (event: React.DragEvent) => {
        dragging.current = index;
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", String(index));
      },
      onDragEnd: () => {
        dragging.current = null;
      },
    }),
    keys: (index: number, last: number) => (event: React.KeyboardEvent) => {
      if (!event.altKey || (event.key !== "ArrowUp" && event.key !== "ArrowDown")) return;
      event.preventDefault();
      const to = event.key === "ArrowUp" ? index - 1 : index + 1;
      if (to < 0 || to > last) return;
      onMove(index, to);
      // The row has moved: its field is a new element, keep the focus on it for the next press.
      const field = event.currentTarget as HTMLElement;
      requestAnimationFrame(() => field.closest("ol")?.querySelectorAll<HTMLElement>(`[data-reorder-field="${field.dataset.reorderField}"]`)[to]?.focus());
    },
  };
}

const grip = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
    {[7, 12, 17].flatMap((y) => [9, 15].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" />))}
  </svg>
);
const arrow = (up: boolean) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={up ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
  </svg>
);
const IconButton = ({ label, className, ...props }: React.ComponentProps<"button"> & { label: string }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className={cn(
      "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-fg-secondary transition-colors hover:bg-surface-3 hover:text-fg",
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30",
      className,
    )}
    {...props}
  />
);
const Cross = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

// --- the tag set -----------------------------------------------------------------------------------------------------------

export type TagSetEditorProps = {
  /** The `tags` of the kind's configuration (`KindConfig.tags`). */
  value: TagSetValue;
  /** Called with the whole set after every change. */
  onChange: (value: TagSetValue) => void;
  /** The variant whose presets are edited (a trade, or `default`). */
  variant: string;
  /** The roles of the product that can write tags. */
  roles: readonly EditorRole[];
  /** What `kindConfigProblems` found (the server's own rules), shown above the list. */
  problems?: readonly string[];
  /** The words, passed translated (English by default). */
  labels?: Partial<TagSetEditorLabels>;
  /** Not available. */
  disabled?: boolean;
  /** Classes merged on the root. */
  className?: string;
};

/** The admin's tag set: the presets of a variant (name, colour, order), who writes, whether people add their own, the most. */
export function TagSetEditor({ value, onChange, variant, roles, problems, labels: given, disabled, className }: TagSetEditorProps) {
  const labels: TagSetEditorLabels = { ...tagSetEditorLabels, ...given, markerNames: { ...tagSetEditorLabels.markerNames, ...given?.markerNames } };
  const presets = value.presets[variant] ?? [];
  const twins = duplicatePresetNames(presets);
  const [draft, setDraft] = React.useState("");
  const [draftMarker, setDraftMarker] = React.useState<Marker>("blue");
  const reorder = useReorder((from, to) => onChange(movePreset(value, variant, from, to)));
  const id = React.useId();
  const add = () => {
    const next = addPreset(value, variant, draft, draftMarker);
    if (next === value) return;
    onChange(next);
    setDraft("");
  };
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Problems title={labels.problems} problems={problems} />
      <section aria-labelledby={`${id}-presets`} className="flex flex-col gap-2">
        <h3 id={`${id}-presets`} className="m-0 text-sm font-semibold text-fg">
          {labels.presets}
        </h3>
        {presets.length === 0 ? (
          <p className="m-0 text-sm text-fg-secondary">{labels.empty}</p>
        ) : (
          <ol className="m-0 flex list-none flex-col gap-2 p-0">
            {presets.map((preset, index) => {
              const shown = preset.name || String(index + 1);
              const twin = twins.has(index);
              return (
                <li key={index} {...reorder.row(index)} className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-border-default bg-surface-1 px-2 py-1.5">
                  <span {...reorder.handle(index)} aria-hidden title={labels.drag(shown)} className="inline-flex h-9 w-6 cursor-grab items-center justify-center text-fg-muted active:cursor-grabbing max-md:hidden">
                    {grip}
                  </span>
                  <TagMarker marker={preset.marker} />
                  <div className="flex min-w-40 flex-1 flex-col gap-1">
                    <Input
                      aria-label={labels.name(index + 1)}
                      data-reorder-field="name"
                      value={preset.name}
                      disabled={disabled}
                      invalid={twin || !preset.name.trim()}
                      aria-describedby={twin ? `${id}-dup-${index}` : undefined}
                      onChange={(event) => onChange(renamePreset(value, variant, index, event.target.value))}
                      onBlur={(event) => event.target.value !== event.target.value.replace(/\s+/g, " ").trim() && onChange(renamePreset(value, variant, index, event.target.value.replace(/\s+/g, " ").trim()))}
                      onKeyDown={reorder.keys(index, presets.length - 1)}
                      className="h-9"
                    />
                    {twin ? (
                      <span id={`${id}-dup-${index}`} className="text-xs text-fg-danger">
                        {labels.duplicate}
                      </span>
                    ) : null}
                  </div>
                  <MarkerPicker label={labels.marker(shown)} names={labels.markerNames} value={preset.marker} disabled={disabled} onValueChange={(marker) => onChange(recolorPreset(value, variant, index, marker))} />
                  <IconButton label={labels.moveUp(shown)} disabled={disabled || index === 0} onClick={() => onChange(movePreset(value, variant, index, index - 1))}>
                    {arrow(true)}
                  </IconButton>
                  <IconButton label={labels.moveDown(shown)} disabled={disabled || index === presets.length - 1} onClick={() => onChange(movePreset(value, variant, index, index + 1))}>
                    {arrow(false)}
                  </IconButton>
                  <IconButton label={labels.remove(shown)} disabled={disabled} onClick={() => onChange(removePreset(value, variant, index))}>
                    <Cross />
                  </IconButton>
                </li>
              );
            })}
          </ol>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Input
            aria-label={labels.add}
            value={draft}
            maxLength={80}
            disabled={disabled}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                add();
              }
            }}
            placeholder={labels.add}
            className="h-9 min-w-40 flex-1"
          />
          <MarkerPicker label={labels.marker(draft.trim() || labels.add)} names={labels.markerNames} value={draftMarker} disabled={disabled} onValueChange={setDraftMarker} />
          <Button type="button" size="sm" variant="secondary" disabled={disabled || !draft.trim()} onClick={add}>
            {labels.addButton}
          </Button>
        </div>
      </section>
      <div className="flex flex-col">
        <SettingsRow label={labels.writers} description={labels.writersHint}>
          <Chip.Group type="multiple" size="sm" label={labels.writers} value={value.writers} disabled={disabled} onValueChange={(writers) => onChange({ ...value, writers })}>
            {roles.map((role) => (
              <Chip key={role.key} value={role.key}>
                {role.label}
              </Chip>
            ))}
          </Chip.Group>
        </SettingsRow>
        <SettingsRow label={labels.userTags} description={labels.userTagsHint}>
          <Switch label={labels.userTags} checked={value.userTags} disabled={disabled} onCheckedChange={(userTags) => onChange({ ...value, userTags })} />
        </SettingsRow>
        <SettingsRow label={labels.max} description={labels.maxHint} htmlFor={`${id}-max`}>
          <Input
            id={`${id}-max`}
            type="number"
            inputMode="numeric"
            min={1}
            max={200}
            value={value.max}
            disabled={disabled}
            invalid={!Number.isInteger(value.max) || value.max < 1 || value.max > 200}
            onChange={(event) => onChange({ ...value, max: event.target.value === "" ? 0 : Number(event.target.value) })}
            onBlur={() => onChange({ ...value, max: clampMax(value.max) })}
            className="h-9 w-24"
          />
        </SettingsRow>
      </div>
    </div>
  );
}

// --- the status set --------------------------------------------------------------------------------------------------------

export type StatusSetEditorProps = {
  /** The kind's status set (`KindConfig.status`). */
  value: StatusSet;
  /** Called with the whole set after every change. */
  onChange: (value: StatusSet) => void;
  /** The roles of the product that can make a move. */
  roles: readonly EditorRole[];
  /** The language the states are named in elsewhere in the editor (the moves' names). */
  locale?: Lang;
  /** What `kindConfigProblems` found (the server's own rules), shown above the list. */
  problems?: readonly string[];
  /** The words, passed translated (English by default). */
  labels?: Partial<StatusSetEditorLabels>;
  /** Not available. */
  disabled?: boolean;
  /** Classes merged on the root. */
  className?: string;
};

/** The admin's status set: the states in their order (FR and EN, tone, final), the initial state, and the moves from × to. */
export function StatusSetEditor({ value, onChange, roles, locale = "en", problems, labels: given, disabled, className }: StatusSetEditorProps) {
  const labels: StatusSetEditorLabels = { ...statusSetEditorLabels, ...given };
  const [chosen, setChosen] = React.useState<{ from: string; to: string } | null>(null);
  const reorder = useReorder((from, to) => onChange(moveState(value, from, to)));
  const id = React.useId();
  const nameOf = (key: string) => value.states.find((s) => s.key === key)?.label[locale] || key;
  const roleLabel = (key: string) => roles.find((r) => r.key === key)?.label ?? key;
  const open = chosen && value.states.some((x) => x.key === chosen.from) && value.states.some((x) => x.key === chosen.to) ? chosen : null;
  const detail = open ? transitionOf(value, open.from, open.to) : undefined;

  if (value.mode === "derived") {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        <Problems title={labels.problems} problems={problems} />
        <p className="m-0 text-sm text-fg-secondary">{labels.derived}</p>
        <ol aria-label={labels.states} className="m-0 flex list-none flex-wrap gap-2 p-0">
          {value.states.map((state) => (
            <li key={state.key} className="inline-flex items-center gap-1.5 rounded-sm bg-surface-3 px-2 py-0.5 text-[11px] font-semibold text-fg-secondary" data-tone={state.tone}>
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
              {state.label[locale]}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <Problems title={labels.problems} problems={problems} />
      <section aria-labelledby={`${id}-states`} className="flex flex-col gap-2">
        <h3 id={`${id}-states`} className="m-0 text-sm font-semibold text-fg">
          {labels.states}
        </h3>
        <ol className="m-0 flex list-none flex-col gap-2 p-0">
          {value.states.map((state, index) => {
            const n = index + 1;
            const isInitial = value.initial === state.key;
            const name = state.label[locale] || String(n);
            return (
              <li key={state.key} {...reorder.row(index)} data-state-key={state.key} className="flex flex-wrap items-start gap-x-3 gap-y-2 rounded-lg border border-border-default bg-surface-1 p-2.5">
                <span {...reorder.handle(index)} aria-hidden title={labels.drag(name)} className="mt-1.5 inline-flex h-9 w-6 cursor-grab items-center justify-center text-fg-muted active:cursor-grabbing max-md:hidden">
                  {grip}
                </span>
                {(["fr", "en"] as const).map((lang) => (
                  <Input
                    key={lang}
                    aria-label={labels.stateLabel(labels.languages[lang], n)}
                    data-reorder-field={lang}
                    lang={lang}
                    value={state.label[lang]}
                    maxLength={40}
                    disabled={disabled}
                    invalid={!state.label[lang].trim()}
                    onChange={(event) => onChange(setStateLabel(value, state.key, lang, event.target.value))}
                    onKeyDown={reorder.keys(index, value.states.length - 1)}
                    className="h-9 min-w-36 flex-1"
                  />
                ))}
                <Select aria-label={labels.tone(n)} value={state.tone} disabled={disabled} onChange={(event) => onChange(setStateTone(value, state.key, event.target.value as StatusTone))} className="h-9 w-36">
                  {STATUS_TONES.map((tone) => (
                    <option key={tone} value={tone}>
                      {labels.tones[tone]}
                    </option>
                  ))}
                </Select>
                <div className="flex items-center gap-1.5 text-xs text-fg-secondary">
                  <Switch size="sm" label={labels.final(n)} checked={Boolean(state.final)} disabled={disabled || isInitial} onCheckedChange={(final) => onChange(setFinal(value, state.key, final))} />
                  <span aria-hidden>{isInitial ? labels.initialNotFinal : labels.finalHint}</span>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-fg-secondary">
                  <input type="radio" name={`${id}-initial`} aria-label={labels.initial(n)} checked={isInitial} disabled={disabled || Boolean(state.final)} onChange={() => onChange(setInitial(value, state.key))} className="h-4 w-4 accent-(--kz-accent)" />
                  <span aria-hidden>{labels.initial(n)}</span>
                </label>
                <code className="text-[11px] text-fg-muted">{state.key}</code>
                <div className="ml-auto flex">
                  <IconButton label={labels.moveUp(name)} disabled={disabled || index === 0} onClick={() => onChange(moveState(value, index, index - 1))}>
                    {arrow(true)}
                  </IconButton>
                  <IconButton label={labels.moveDown(name)} disabled={disabled || index === value.states.length - 1} onClick={() => onChange(moveState(value, index, index + 1))}>
                    {arrow(false)}
                  </IconButton>
                  <IconButton label={labels.remove(name)} disabled={disabled || value.states.length <= 2} onClick={() => onChange(removeState(value, state.key))}>
                    <Cross />
                  </IconButton>
                </div>
              </li>
            );
          })}
        </ol>
        <div>
          <Button type="button" size="sm" variant="secondary" disabled={disabled || value.states.length >= 12} onClick={() => onChange(addState(value, labels.newState))}>
            {labels.addState}
          </Button>
        </div>
      </section>

      <section aria-labelledby={`${id}-moves`} className="flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <h3 id={`${id}-moves`} className="m-0 text-sm font-semibold text-fg">
            {labels.moves}
          </h3>
          <p className="m-0 text-xs text-fg-secondary">{labels.movesHint}</p>
        </div>
        {value.states.map((from) => (
          <div key={from.key} role="group" aria-label={labels.from(nameOf(from.key))} className="flex flex-wrap items-center gap-2">
            <span className="min-w-28 text-xs font-semibold text-fg">{nameOf(from.key)}</span>
            {from.final ? (
              <span className="text-xs text-fg-secondary">{labels.noWayOut}</span>
            ) : (
              value.states
                .filter((to) => to.key !== from.key)
                .map((to) => {
                  const move = transitionOf(value, from.key, to.key);
                  const summary = move ? move.roles.map(roleLabel).join(", ") : labels.none;
                  const on = open?.from === from.key && open.to === to.key;
                  return (
                    <button
                      key={to.key}
                      type="button"
                      aria-pressed={on}
                      aria-label={labels.move(nameOf(from.key), nameOf(to.key), summary)}
                      data-on={move ? "" : undefined}
                      disabled={disabled}
                      onClick={() => setChosen(on ? null : { from: from.key, to: to.key })}
                      className={cn(
                        "inline-flex min-h-9 items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40",
                        move ? "border-accent bg-accent-soft text-fg" : "border-dashed border-border-control text-fg-secondary hover:border-border-strong",
                        on && "ring-2 ring-ring",
                      )}
                    >
                      <span aria-hidden>→</span> {nameOf(to.key)}
                      <span className="text-fg-secondary">{summary}</span>
                    </button>
                  );
                })
            )}
          </div>
        ))}

        {open && chosen ? (
          <div role="region" aria-label={labels.moveDetail(nameOf(open.from), nameOf(open.to))} className="flex flex-col gap-3 rounded-lg border border-border-default bg-surface-1 p-3">
            <h4 className="m-0 text-sm font-semibold text-fg">{labels.moveDetail(nameOf(open.from), nameOf(open.to))}</h4>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-fg-secondary">{labels.roles}</span>
              <Chip.Group
                type="multiple"
                size="sm"
                label={labels.roles}
                value={detail?.roles ? [...detail.roles] : []}
                disabled={disabled}
                onValueChange={(next) => {
                  onChange(setTransitionRoles(value, open.from, open.to, next));
                }}
              >
                {roles.map((role) => (
                  <Chip key={role.key} value={role.key}>
                    {role.label}
                  </Chip>
                ))}
              </Chip.Group>
            </div>
            {detail ? (
            <>
            <div className="flex items-center gap-2 text-xs text-fg-secondary">
              <Switch size="sm" label={labels.confirm} checked={Boolean(detail?.confirm)} disabled={disabled} onCheckedChange={(on) => onChange(setTransitionConfirm(value, open.from, open.to, on))} />
              <span aria-hidden>{labels.confirm}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-fg-secondary">{labels.reasons}</span>
              {(detail?.reasons ?? []).map((reason, at) => (
                <div key={reason.key} className="flex flex-wrap items-center gap-2">
                  {(["fr", "en"] as const).map((lang) => (
                    <Input
                      key={lang}
                      lang={lang}
                      aria-label={labels.reasonLabel(labels.languages[lang], at + 1)}
                      value={reason.label[lang]}
                      maxLength={40}
                      disabled={disabled}
                      invalid={!reason.label[lang].trim()}
                      onChange={(event) =>
                        onChange(setTransitionReasons(value, open.from, open.to, (detail?.reasons ?? []).map((r) => (r.key === reason.key ? { ...r, label: { ...r.label, [lang]: event.target.value } } : r))))
                      }
                      className="h-9 min-w-36 flex-1"
                    />
                  ))}
                  <IconButton label={labels.removeReason(at + 1)} disabled={disabled} onClick={() => onChange(setTransitionReasons(value, open.from, open.to, (detail?.reasons ?? []).filter((r) => r.key !== reason.key)))}>
                    <Cross />
                  </IconButton>
                </div>
              ))}
              <div>
                <Button type="button" size="sm" variant="secondary" disabled={disabled || (detail?.reasons?.length ?? 0) >= 12} onClick={() => onChange(addReason(value, open.from, open.to, { fr: "", en: "" }))}>
                  {labels.addReason}
                </Button>
              </div>
            </div>
            </>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
