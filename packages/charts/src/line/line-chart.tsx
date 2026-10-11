"use client";
import { Cartesian, type CartesianProps } from "../cartesian/cartesian";
import type { Curve } from "../core/shape";
import type { Datum } from "../core/types";

export interface LineChartProps<T extends Datum> extends CartesianProps<T> {
  /** The shape between points: `monotone` (default, never overshoots), `linear`, `step` (a value that holds). */
  curve?: Curve;
  /** A dot on every point (short series). Default false: the end of each line carries one. */
  dots?: boolean;
  /** Write the last value at the end of each line (up to three series). Default true. */
  endLabels?: boolean;
}

/** Change over time: one line per series, the last value written at its end, a crosshair tooltip, the keyboard. */
export function LineChart<T extends Datum>({ curve, dots, endLabels = true, ...props }: LineChartProps<T>) {
  return <Cartesian props={props} options={{ kind: "line", mode: "line", curve, dots, endLabels }} />;
}

export interface AreaChartProps<T extends Datum> extends LineChartProps<T> {
  /** Stack the series: a total and its parts over time. */
  stacked?: boolean;
}

/** A volume over time: a line over a soft wash (stacked: the parts of a total). */
export function AreaChart<T extends Datum>({ curve, dots, endLabels = true, stacked, ...props }: AreaChartProps<T>) {
  return <Cartesian props={props} options={{ kind: "area", mode: "area", curve, dots, endLabels: endLabels && !stacked, stacked }} />;
}
