import { SankeyChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { use as register } from "echarts/core";

/**
 * Registers what this chart needs. A function, not a side effect of the import: the package is `sideEffects: false`,
 * and a bundler drops a module imported only for its side effects.
 */
export function install(): void {
  register([SankeyChart, TooltipComponent]);
}
