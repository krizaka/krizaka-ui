"use client";
import { Cartesian, type CartesianProps } from "../cartesian/cartesian";
import type { Datum } from "../core/types";

export interface BarChartProps<T extends Datum> extends CartesianProps<T> {
  /** Stack the series in one bar per category (a total and its parts); default: grouped side by side. */
  stacked?: boolean;
  /** Bars grow to the right, the categories down the side: long labels, rankings. */
  horizontal?: boolean;
  /** Write each value at the tip of its bar (one series, up to 16 bars). Default true. */
  valueLabels?: boolean;
}

/** Compare amounts across categories: grouped, stacked or horizontal bars, each value at its tip. */
export function BarChart<T extends Datum>({ stacked, horizontal, valueLabels = true, ...props }: BarChartProps<T>) {
  return <Cartesian props={props} options={{ kind: "bar", mode: "bar", stacked, horizontal, valueLabels }} />;
}
