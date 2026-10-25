// The admin's editors of a kind's vocabulary on the phone and the Mac-less tablet (krizaka-ts#89): the same value in / onChange out
// as the web's, over the same pure changes (kind-config-editor/model.ts) and the same words (labels.ts). The product posts the
// save; `problems` (from `kindConfigProblems`) are shown in place. Reorder with the up and down buttons.
import type { Marker, StatusSet, StatusTone } from "@krizaka/organize/contract";
import * as React from "react";
import { StyleSheet, View } from "react-native";

import { type EditorRole, STATUS_TONES, type StatusSetEditorLabels, statusSetEditorLabels, type TagSetEditorLabels, tagSetEditorLabels } from "../kind-config-editor/labels";
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
} from "../kind-config-editor/model";
import { Button, IconButton } from "./button";
import { Chip } from "./chip";
import { Select } from "./combobox";
import { TextField } from "./field";
import { Switch } from "./switch";
import { MarkerPicker, TagMarker } from "./tag-chip";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export type { EditorRole, Lang, StatusSetEditorLabels, TagSetEditorLabels, TagSetValue };
export { statusSetEditorLabels, tagSetEditorLabels };

function Problems({ title, problems }: { title: string; problems?: readonly string[] }) {
  const { theme, radius } = useTheme();
  if (!problems || problems.length === 0) return null;
  return (
    <View role="alert" style={[styles.problems, { borderColor: theme.danger, backgroundColor: theme.dangerSoft, borderRadius: radius.md }]}>
      <Txt variant="label" tone="danger">
        {title}
      </Txt>
      {problems.map((problem) => (
        <Txt key={problem} variant="caption">
          {`• ${problem}`}
        </Txt>
      ))}
    </View>
  );
}

const Glyph = ({ children }: { children: string }) => (
  <Txt variant="label" aria-hidden>
    {children}
  </Txt>
);

export type TagSetEditorProps = {
  /** The `tags` of the kind's configuration. */
  value: TagSetValue;
  /** Called with the whole descriptor after every change. */
  onChange: (value: TagSetValue) => void;
  /** The variant whose presets are edited (a trade, or `default`). */
  variant: string;
  /** The roles of the product. */
  roles: readonly EditorRole[];
  /** What `kindConfigProblems` found, shown in place. */
  problems?: readonly string[];
  /** The words, passed translated (English by default). */
  labels?: Partial<TagSetEditorLabels>;
  /** Not available. */
  disabled?: boolean;
};

/** The admin's tag set: the presets of a variant (name, colour, order), who writes, whether people add their own, the most. */
export function TagSetEditor({ value, onChange, variant, roles, problems, labels: given, disabled }: TagSetEditorProps) {
  const labels: TagSetEditorLabels = { ...tagSetEditorLabels, ...given, markerNames: { ...tagSetEditorLabels.markerNames, ...given?.markerNames } };
  const presets = value.presets[variant] ?? [];
  const twins = duplicatePresetNames(presets);
  const [draft, setDraft] = React.useState("");
  const [draftMarker, setDraftMarker] = React.useState<Marker>("blue");
  const add = () => {
    const next = addPreset(value, variant, draft, draftMarker);
    if (next === value) return;
    onChange(next);
    setDraft("");
  };
  return (
    <View style={styles.root}>
      <Problems title={labels.problems} problems={problems} />
      <Txt variant="title">{labels.presets}</Txt>
      {presets.length === 0 ? <Txt tone="secondary">{labels.empty}</Txt> : null}
      {presets.map((preset, index) => {
        const shown = preset.name || String(index + 1);
        return (
          <View key={index} style={styles.card}>
            <View style={styles.line}>
              <TagMarker marker={preset.marker} />
              <TextField
                label={labels.name(index + 1)}
                value={preset.name}
                disabled={disabled}
                error={twins.has(index) ? labels.duplicate : undefined}
                onValueChange={(name) => onChange(renamePreset(value, variant, index, name))}
                style={styles.grow}
              />
            </View>
            <MarkerPicker label={labels.marker(shown)} names={labels.markerNames} value={preset.marker} disabled={disabled} onValueChange={(marker) => onChange(recolorPreset(value, variant, index, marker))} />
            <View style={styles.line}>
              <IconButton variant="ghost" size="sm" label={labels.moveUp(shown)} icon={<Glyph>↑</Glyph>} disabled={disabled || index === 0} onPress={() => onChange(movePreset(value, variant, index, index - 1))} />
              <IconButton variant="ghost" size="sm" label={labels.moveDown(shown)} icon={<Glyph>↓</Glyph>} disabled={disabled || index === presets.length - 1} onPress={() => onChange(movePreset(value, variant, index, index + 1))} />
              <IconButton variant="ghost" size="sm" label={labels.remove(shown)} icon={<Glyph>×</Glyph>} disabled={disabled} onPress={() => onChange(removePreset(value, variant, index))} />
            </View>
          </View>
        );
      })}
      <View style={styles.card}>
        <TextField label={labels.add} value={draft} maxLength={80} disabled={disabled} onValueChange={setDraft} onSubmitEditing={add} returnKeyType="done" />
        <MarkerPicker label={labels.marker(draft.trim() || labels.add)} names={labels.markerNames} value={draftMarker} disabled={disabled} onValueChange={setDraftMarker} />
        <Button label={labels.addButton} size="sm" disabled={disabled || !draft.trim()} onPress={add} />
      </View>
      <Txt variant="label">{labels.writers}</Txt>
      <Txt variant="caption" tone="secondary">
        {labels.writersHint}
      </Txt>
      <Chip.Group type="multiple" size="sm" aria-label={labels.writers} value={value.writers} disabled={disabled} onValueChange={(writers) => onChange({ ...value, writers })}>
        {roles.map((role) => (
          <Chip key={role.key} value={role.key}>
            {role.label}
          </Chip>
        ))}
      </Chip.Group>
      <Switch showLabel label={labels.userTags} description={labels.userTagsHint} checked={value.userTags} disabled={disabled} onCheckedChange={(userTags) => onChange({ ...value, userTags })} />
      <TextField
        label={labels.max}
        hint={labels.maxHint}
        keyboardType="number-pad"
        value={String(value.max)}
        disabled={disabled}
        error={!Number.isInteger(value.max) || value.max < 1 || value.max > 200 ? labels.maxHint : undefined}
        onValueChange={(text) => onChange({ ...value, max: text === "" ? 0 : Number(text.replace(/\D/g, "")) })}
        onBlur={() => onChange({ ...value, max: clampMax(value.max) })}
      />
    </View>
  );
}

export type StatusSetEditorProps = {
  /** The kind's status set. */
  value: StatusSet;
  /** Called with the whole descriptor after every change. */
  onChange: (value: StatusSet) => void;
  /** The roles of the product. */
  roles: readonly EditorRole[];
  /** The language the states are named in elsewhere in the editor. */
  locale?: Lang;
  /** What `kindConfigProblems` found, shown in place. */
  problems?: readonly string[];
  /** The words, passed translated (English by default). */
  labels?: Partial<StatusSetEditorLabels>;
  /** Not available. */
  disabled?: boolean;
};

/** The admin's status set: the states in their order (FR and EN, tone, final), the initial state, and the moves from × to. */
export function StatusSetEditor({ value, onChange, roles, locale = "en", problems, labels: given, disabled }: StatusSetEditorProps) {
  const labels: StatusSetEditorLabels = { ...statusSetEditorLabels, ...given };
  const [chosen, setChosen] = React.useState<{ from: string; to: string } | null>(null);
  const nameOf = (key: string) => value.states.find((s) => s.key === key)?.label[locale] || key;
  const roleLabel = (key: string) => roles.find((r) => r.key === key)?.label ?? key;
  const open = chosen && value.states.some((x) => x.key === chosen.from) && value.states.some((x) => x.key === chosen.to) ? chosen : null;
  const detail = open ? transitionOf(value, open.from, open.to) : undefined;

  if (value.mode === "derived") {
    return (
      <View style={styles.root}>
        <Problems title={labels.problems} problems={problems} />
        <Txt tone="secondary">{labels.derived}</Txt>
        {value.states.map((state) => (
          <Txt key={state.key}>{state.label[locale]}</Txt>
        ))}
      </View>
    );
  }
  return (
    <View style={styles.root}>
      <Problems title={labels.problems} problems={problems} />
      <Txt variant="title">{labels.states}</Txt>
      {value.states.map((state, index) => {
        const n = index + 1;
        const isInitial = value.initial === state.key;
        const name = state.label[locale] || String(n);
        return (
          <View key={state.key} style={styles.card}>
            {(["fr", "en"] as const).map((lang) => (
              <TextField
                key={lang}
                label={labels.stateLabel(labels.languages[lang], n)}
                value={state.label[lang]}
                maxLength={40}
                disabled={disabled}
                error={!state.label[lang].trim() ? labels.stateLabel(labels.languages[lang], n) : undefined}
                onValueChange={(text) => onChange(setStateLabel(value, state.key, lang, text))}
              />
            ))}
            <Select
              label={labels.tone(n)}
              options={STATUS_TONES.map((tone) => ({ value: tone, label: labels.tones[tone] }))}
              value={state.tone}
              disabled={disabled}
              onValueChange={(tone) => onChange(setStateTone(value, state.key, tone as StatusTone))}
            />
            <Switch showLabel size="sm" label={labels.final(n)} description={isInitial ? labels.initialNotFinal : labels.finalHint} checked={Boolean(state.final)} disabled={disabled || isInitial} onCheckedChange={(final) => onChange(setFinal(value, state.key, final))} />
            <Chip selected={isInitial} disabled={disabled || Boolean(state.final)} aria-label={labels.initial(n)} onSelectedChange={() => onChange(setInitial(value, state.key))}>
              {labels.initial(n)}
            </Chip>
            <View style={styles.line}>
              <IconButton variant="ghost" size="sm" label={labels.moveUp(name)} icon={<Glyph>↑</Glyph>} disabled={disabled || index === 0} onPress={() => onChange(moveState(value, index, index - 1))} />
              <IconButton variant="ghost" size="sm" label={labels.moveDown(name)} icon={<Glyph>↓</Glyph>} disabled={disabled || index === value.states.length - 1} onPress={() => onChange(moveState(value, index, index + 1))} />
              <IconButton variant="ghost" size="sm" label={labels.remove(name)} icon={<Glyph>×</Glyph>} disabled={disabled || value.states.length <= 2} onPress={() => onChange(removeState(value, state.key))} />
            </View>
          </View>
        );
      })}
      <Button label={labels.addState} size="sm" disabled={disabled || value.states.length >= 12} onPress={() => onChange(addState(value, labels.newState))} />

      <Txt variant="title">{labels.moves}</Txt>
      <Txt variant="caption" tone="secondary">
        {labels.movesHint}
      </Txt>
      {value.states.map((from) => (
        <View key={from.key} role="group" aria-label={labels.from(nameOf(from.key))} style={styles.card}>
          <Txt variant="label">{nameOf(from.key)}</Txt>
          {from.final ? (
            <Txt variant="caption" tone="secondary">
              {labels.noWayOut}
            </Txt>
          ) : (
            <View style={styles.wrap}>
              {value.states
                .filter((to) => to.key !== from.key)
                .map((to) => {
                  const move = transitionOf(value, from.key, to.key);
                  const summary = move ? move.roles.map(roleLabel).join(", ") : labels.none;
                  const on = open?.from === from.key && open.to === to.key;
                  return (
                    <Chip key={to.key} selected={on} disabled={disabled} aria-label={labels.move(nameOf(from.key), nameOf(to.key), summary)} onSelectedChange={() => setChosen(on ? null : { from: from.key, to: to.key })}>
                      {`→ ${nameOf(to.key)} · ${summary}`}
                    </Chip>
                  );
                })}
            </View>
          )}
        </View>
      ))}
      {open ? (
        <View role="group" aria-label={labels.moveDetail(nameOf(open.from), nameOf(open.to))} style={styles.card}>
          <Txt variant="label">{labels.moveDetail(nameOf(open.from), nameOf(open.to))}</Txt>
          <Txt variant="caption" tone="secondary">
            {labels.roles}
          </Txt>
          <Chip.Group
            type="multiple"
            size="sm"
            aria-label={labels.roles}
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
          {detail ? (
            <>
          <Switch showLabel size="sm" label={labels.confirm} checked={Boolean(detail?.confirm)} disabled={disabled} onCheckedChange={(on) => onChange(setTransitionConfirm(value, open.from, open.to, on))} />
          <Txt variant="caption" tone="secondary">
            {labels.reasons}
          </Txt>
          {(detail?.reasons ?? []).map((reason, at) => (
            <View key={reason.key} style={styles.card}>
              {(["fr", "en"] as const).map((lang) => (
                <TextField
                  key={lang}
                  label={labels.reasonLabel(labels.languages[lang], at + 1)}
                  value={reason.label[lang]}
                  maxLength={40}
                  disabled={disabled}
                  onValueChange={(text) => onChange(setTransitionReasons(value, open.from, open.to, (detail?.reasons ?? []).map((r) => (r.key === reason.key ? { ...r, label: { ...r.label, [lang]: text } } : r))))}
                />
              ))}
              <IconButton variant="ghost" size="sm" label={labels.removeReason(at + 1)} icon={<Glyph>×</Glyph>} disabled={disabled} onPress={() => onChange(setTransitionReasons(value, open.from, open.to, (detail?.reasons ?? []).filter((r) => r.key !== reason.key)))} />
            </View>
          ))}
          <Button label={labels.addReason} size="sm" disabled={disabled || (detail?.reasons?.length ?? 0) >= 12} onPress={() => onChange(addReason(value, open.from, open.to, { fr: "", en: "" }))} />
            </>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 12 },
  card: { gap: 8 },
  line: { flexDirection: "row", alignItems: "center", gap: 8 },
  grow: { flex: 1 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  problems: { borderWidth: 1, padding: 10, gap: 4 },
});
