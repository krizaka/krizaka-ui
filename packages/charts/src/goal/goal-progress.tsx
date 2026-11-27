"use client";
// A pot towards its goal (a creator's challenge, a crowdfunded request): the amount raised in money minor units on a
// gauge whose arc fills towards the goal, “raised of $500” under it, the supporters and the time left beside the
// title, the success tone once the goal is reached (and the amount past it still written). A Gauge preset.
import type { ReactNode } from "react";

import { valueFormatter } from "../core/format";
import { Gauge, type GaugeProps } from "../gauge/gauge";
import { GOAL_LABELS, type GoalLabels } from "../needs/labels";
import { fillIn, roundMoney } from "../needs/model";
import { useSettings } from "../web/frame";

export interface GoalProgressProps extends Omit<GaugeProps, "value" | "min" | "max" | "format" | "caption" | "target" | "zones" | "tone" | "labels"> {
  /** The amount raised, in **minor units** (cents). */
  raised: number;
  /** The goal, in minor units. */
  goal: number;
  /** The ISO 4217 currency. */
  currency: string;
  /** How many people chipped in. */
  supporters?: number;
  /** The time left, written by the app (a `Countdown`, “2 days”). */
  timeLeft?: ReactNode;
  /** The words, passed translated; English by default. */
  labels?: Partial<GoalLabels>;
}

function formatTimeLeft(timeLeft: ReactNode, template: string): ReactNode {
  return typeof timeLeft === "string" ? fillIn(template, { time: timeLeft }) : timeLeft;
}

function buildGoalLine(facts: readonly string[], timeLeft: ReactNode, leftTemplate: string): ReactNode {
  if (facts.length === 0 && !timeLeft) {
    return null;
  }
  const leftNode = timeLeft ? formatTimeLeft(timeLeft, leftTemplate) : null;
  return (
    <>
      {facts.join(" · ")}
      {facts.length > 0 && timeLeft ? " · " : null}
      {leftNode}
    </>
  );
}

function joinGoalDescription(description: ReactNode, line: ReactNode): ReactNode {
  if (!description && !line) {
    return undefined;
  }
  return (
    <>
      {description}
      {description && line ? " · " : null}
      {line}
    </>
  );
}

/** A pot towards its goal, in money: the arc fills, the words say how much of what, and who chipped in. */
export function GoalProgress({ raised, goal, currency, supporters, timeLeft, labels: given, description, ...props }: Readonly<GoalProgressProps>) {
  const words = { ...GOAL_LABELS, ...given };
  const { locale } = useSettings(props);
  const format = roundMoney(currency);
  const reached = goal > 0 && raised >= goal;
  const facts: string[] = [];
  if (supporters != null) {
    facts.push(fillIn(words.supporters, { count: valueFormatter("integer", locale)(supporters) }));
  }
  if (reached) {
    facts.push(words.reached);
  }
  const line = buildGoalLine(facts, timeLeft, words.left);
  return (
    <Gauge
      {...props}
      value={raised}
      max={goal}
      format={format}
      caption={fillIn(words.raised, { goal: valueFormatter(format, locale)(goal) })}
      tone={reached ? "success" : "accent"}
      description={joinGoalDescription(description, line)}
    />
  );
}
