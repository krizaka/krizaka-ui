// Every chart and component of ECharts: what `<Chart>` loads when it is not told which modules an option needs.
import * as echarts from "echarts";

/** Nothing to register: the full build registers everything. Exported so the module is used, not only imported. */
export function install(): typeof echarts {
  return echarts;
}
