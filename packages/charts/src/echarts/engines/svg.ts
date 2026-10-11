// The SVG renderer (default): crisp at any zoom, server-friendly, exportable as SVG, readable by the browser's tools.
import { use as register } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";

/**
 * Registers what this chart needs. A function, not a side effect of the import: the package is `sideEffects: false`,
 * and a bundler drops a module imported only for its side effects.
 */
export function install(): void {
  register([SVGRenderer]);
}
export { init } from "echarts/core";
