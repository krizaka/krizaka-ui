import { HeatmapChart } from "echarts/charts";
import { CalendarComponent, GridComponent, TooltipComponent, VisualMapComponent } from "echarts/components";
import { use as register } from "echarts/core";

/**
 * Registers what this chart needs. A function, not a side effect of the import: the package is `sideEffects: false`,
 * and a bundler drops a module imported only for its side effects.
 */
export function install(): void {
  register([HeatmapChart, GridComponent, CalendarComponent, VisualMapComponent, TooltipComponent]);
}
