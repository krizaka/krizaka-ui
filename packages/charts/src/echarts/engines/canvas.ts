// The canvas renderer: for large volumes (tens of thousands of points), where one DOM node per mark would be too many.
import { use as register } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

/**
 * Registers what this chart needs. A function, not a side effect of the import: the package is `sideEffects: false`,
 * and a bundler drops a module imported only for its side effects.
 */
export function install(): void {
  register([CanvasRenderer]);
}
export { init } from "echarts/core";
