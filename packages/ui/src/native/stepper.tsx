import * as React from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { LoaderGlyph } from "./loader";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export type StepStatus = "done" | "current" | "upcoming" | "error";

export type Step = {
  /** Its name — passed translated. */
  title: string;
  /** One line under it (what happens, a time) — passed translated. */
  description?: string;
  /** Where it stands; by default from `current`. */
  status?: StepStatus;
  /** Between 0 and 1 for the current step: its glyph grows to it. */
  value?: number;
  /** Anything under the step while it is current or failed: a progress bar, an action. */
  content?: React.ReactNode;
};

export type StepperProps = {
  /** The steps, in order. */
  steps: readonly Step[];
  /** The index of the current step (the steps before are done). */
  current?: number;
  /** vertical (default: a job's run, a checkout) · horizontal (a few short steps across the screen). */
  orientation?: "vertical" | "horizontal";
  /** The words read after each step's title (`{ done: "done", current: "in progress", upcoming: "to come", error: "failed" }`) — passed translated. */
  statusLabels?: Partial<Record<StepStatus, string>>;
  /** The accessible name of the list (“Run of the dubbing job”). */
  "aria-label"?: string;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

const WORDS: Record<StepStatus, string> = { done: "done", current: "in progress", upcoming: "to come", error: "failed" };

/** The steps of a process, where it stands — the web `Stepper`: done steps checked, the current one tracing, a failure crossed. */
export function Stepper({ steps, current = 0, orientation = "vertical", statusLabels, "aria-label": label, style }: StepperProps) {
  const { theme } = useTheme();
  const words = { ...WORDS, ...statusLabels };
  const vertical = orientation === "vertical";
  return (
    <View role="list" aria-label={label} style={[vertical ? styles.column : styles.row, style]}>
      {steps.map((step, i) => {
        const status: StepStatus = step.status ?? (i < current ? "done" : i === current ? "current" : "upcoming");
        const last = i === steps.length - 1;
        const node =
          status === "current" ? (
            <LoaderGlyph value={step.value ?? null} size={24} />
          ) : status === "error" ? (
            <LoaderGlyph state="error" size={24} />
          ) : (
            <Svg width={24} height={24} viewBox="0 0 24 24" aria-hidden>
              <Circle cx={12} cy={12} r={10} fill={status === "done" ? theme.accent : "none"} stroke={status === "done" ? theme.accent : theme.borderStrong} strokeWidth={2} />
              {status === "done" ? <Path d="M7.5 12.3l3 3 6-6.3" stroke={theme.onAccent} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
            </Svg>
          );
        const connector = !last ? (
          <View aria-hidden style={[vertical ? styles.vLine : styles.hLine, { backgroundColor: status === "done" ? theme.accent : theme.borderDefault }]} />
        ) : null;
        return (
          <View key={i} role="listitem" accessible aria-label={`${step.title}, ${words[status]}`} style={vertical ? styles.vStep : styles.hStep}>
            <View style={vertical ? styles.vRail : styles.hRail}>
              {node}
              {connector}
            </View>
            <View style={[styles.body, vertical && !last ? { paddingBottom: 20 } : null]}>
              <Txt variant="label" tone={status === "upcoming" ? "secondary" : "text"} numberOfLines={vertical ? undefined : 2}>
                {step.title}
              </Txt>
              {step.description ? (
                <Txt variant="caption" tone="secondary">
                  {step.description}
                </Txt>
              ) : null}
              {step.content && (status === "current" || status === "error") ? <View style={styles.content}>{step.content}</View> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  column: { gap: 0 },
  row: { flexDirection: "row" },
  vStep: { flexDirection: "row", gap: 12 },
  hStep: { flex: 1, gap: 8 },
  vRail: { alignItems: "center", width: 24 },
  hRail: { flexDirection: "row", alignItems: "center" },
  vLine: { width: 2, flex: 1, marginVertical: 4, borderRadius: 1 },
  hLine: { height: 2, flex: 1, marginHorizontal: 6, borderRadius: 1 },
  body: { flex: 1, gap: 2, paddingTop: 2 },
  content: { marginTop: 8 },
});
