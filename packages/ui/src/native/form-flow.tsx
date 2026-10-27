// Native — a form told in steps: the step's title and fields, the position in words, the main action pinned above the
// keyboard and clear of the home indicator. One question or one group of fields per step; Back never loses what was typed
// (the fields are the app's).
import * as React from "react";
import { StyleSheet, View } from "react-native";

import { Button } from "./button";
import { Screen } from "./screen";
import { StepProgress } from "./step-progress";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export type FormFlowStep = {
  id: string;
  /** The step's question or name, passed translated. */
  title: string;
  /** One line under it. */
  description?: string;
  /** The fields of the step (`TextField`, `Select`, `DateField`…): the app owns their values. */
  content: React.ReactNode;
  /** `false` while the step cannot go on: the main action is dimmed (and says why in its state). Default true. */
  valid?: boolean;
};

export type FormFlowProps = {
  /** The steps, in order. */
  steps: readonly FormFlowStep[];
  /** The words — passed translated. */
  labels: {
    /** The main action on a step that is not the last (“Next”). */
    next: string;
    /** The main action on the last step (“Create my account”). */
    done: string;
    /** The back button (“Back”). */
    back: string;
    /** The position, for screen readers and the head: `(n, total) => "Step 2 of 4"`. */
    position: (n: number, total: number) => string;
  };
  /** The current step, from 0, when the app drives it. */
  step?: number;
  /** The step to start on when the flow drives itself (default 0). */
  defaultStep?: number;
  /** Called with the new step (from 0) when Next or Back moves it. */
  onStepChange?: (step: number) => void;
  /** The main action on the last step. */
  onDone: () => void;
  /** Back on the first step: leave the flow. Without it the first step has no back button. */
  onExit?: () => void;
  /** The main action is working (the request is on its way). */
  loading?: boolean;
};

/** A multi-step form on a `Screen`: head, the step, the pinned action. */
export function FormFlow({ steps, labels, step: controlled, defaultStep = 0, onStepChange, onDone, onExit, loading }: FormFlowProps) {
  const { insets, theme } = useTheme();
  const [own, setOwn] = React.useState(defaultStep);
  const index = Math.min(Math.max(controlled ?? own, 0), steps.length - 1);
  const current = steps[index];
  const last = index === steps.length - 1;
  const go = (next: number) => {
    if (controlled === undefined) setOwn(next);
    onStepChange?.(next);
  };
  if (!current) return null;
  return (
    <Screen
      header={<StepProgress step={index + 1} total={steps.length} label={labels.position} backLabel={index > 0 || onExit ? labels.back : undefined} onBack={index > 0 ? () => go(index - 1) : onExit} />}
      footer={
        <View style={[styles.footer, { paddingBottom: Math.max(12, insets.bottom), borderTopColor: theme.borderSubtle }]}>
          <Button label={last ? labels.done : labels.next} variant="primary" size="lg" disabled={current.valid === false} loading={loading} onPress={() => (last ? onDone() : go(index + 1))} />
        </View>
      }
    >
      <View style={styles.head} accessibilityLiveRegion="polite">
        <Txt variant="title">{current.title}</Txt>
        {current.description ? (
          <Txt tone="secondary">{current.description}</Txt>
        ) : null}
      </View>
      {current.content}
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { gap: 4 },
  footer: { paddingHorizontal: 16, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
});
