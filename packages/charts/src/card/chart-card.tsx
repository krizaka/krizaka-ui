"use client";
// One frame for every chart of a screen: the kit's Card with the Krizaka hierarchy — title, one line that says what the
// chart shows (the insight), the chart, a footer — and the chart's actions menu (⋯) at the top right, beside the
// controls you pass (a period switch). The chart inside needs no title of its own: the card hands it its heading.
import { Card } from "@krizaka/ui/card";
import type { ReactNode } from "react";

import { ChartCardProvider } from "../web/context";
import { cx } from "../web/parts";
import { ChartStyles } from "../web/styles";

export interface ChartCardProps {
  /** What the chart shows, in a few words (a heading and the chart's accessible name). */
  title: string;
  /** One line that says what the chart shows: “100 jobs · +100 % vs last week”. Written by the app, from its data. */
  insight?: ReactNode;
  /** The period, the unit, the source — under the insight. */
  description?: ReactNode;
  /** Controls beside the actions menu: a period switch, a filter. */
  actions?: ReactNode;
  /** A line under the chart: the source, the freshness, a link. */
  footer?: ReactNode;
  /** The chart (`LineChart`, `BarChart`, `DonutChart`…), without its own title. */
  children: ReactNode;
  /** A class on the card (layout: grid placement). */
  className?: string;
  /** The id of the card. */
  id?: string;
}

/** The frame of a chart: title, insight, actions, chart, footer — used everywhere a chart is shown. */
export function ChartCard({ title, insight, description, actions, footer, children, className, id }: ChartCardProps) {
  return (
    <ChartCardProvider value={{ title, insight, description, extra: actions }}>
      <Card.Root id={id} className={cx("kzc-card", className)}>
        <ChartStyles />
        <Card.Body padding="lg">
          {children}
          {footer ? <p className="kzc-card-foot">{footer}</p> : null}
        </Card.Body>
      </Card.Root>
    </ChartCardProvider>
  );
}
