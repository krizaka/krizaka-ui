// The charts' own stylesheet: plain CSS with `kzc-` classes on the --kz-* roles, so a chart needs nothing but the
// tokens an app already loads (no Tailwind source to declare, no CSS import). Rendered once per document through
// React 19's stylesheet hoisting (`<style href precedence>`, deduplicated, server-rendered in <head>).
//
// The palette is `light-dark()`: it follows the `color-scheme` the tokens set (`:root`/`.theme-dark` dark,
// `html.light`/`.theme-light` light) — a theme switch repaints every chart with no JavaScript. The brand's order comes
// from a `.brand-<id>` ancestor or the chart's own `data-brand`.
import { HUES, ORDERS } from "../core/palette";
import type { BrandId } from "../core/types";

const slots = (brand: BrandId) =>
  ORDERS[brand].map((hue, i) => `--kzc-${i + 1}:light-dark(${HUES[hue].light},${HUES[hue].dark});`).join("");

const PALETTE = [
  `[data-kzc]{${slots("krizaka")}--kzc-low:light-dark(${HUES.blue.light},${HUES.blue.dark});--kzc-high:light-dark(${HUES.red.light},${HUES.red.dark});}`,
  ...(["orazaka", "orochia", "krizaka"] as const).map((brand) => `:where(.brand-${brand}) [data-kzc]{${slots(brand)}}`),
  ...(["orazaka", "orochia", "krizaka"] as const).map((brand) => `[data-kzc][data-brand=${brand}]{${slots(brand)}}`),
].join("");

const tone = (name: string, value: string) => `.kzc [data-tone=${name}]{--kzc-tone:${value}}`;

export const CSS = `${PALETTE}
.kzc{--kzc-text:var(--kz-text-primary);--kzc-text-2:var(--kz-text-secondary);--kzc-text-3:var(--kz-text-muted);--kzc-grid:var(--kz-border-subtle);--kzc-axis:var(--kz-border-default);--kzc-surface:var(--kz-surface-1);--kzc-tone:var(--kz-text-secondary);margin:0;min-width:0;display:flex;flex-direction:column;gap:8px;color:var(--kzc-text);font-family:var(--kz-font-sans,system-ui,sans-serif);font-variant-numeric:tabular-nums}
${tone("neutral", "var(--kz-text-secondary)")}${tone("accent", "var(--kz-accent)")}${tone("success", "var(--kz-success)")}${tone("warning", "var(--kz-warning)")}${tone("danger", "var(--kz-danger)")}${tone("info", "var(--kz-info)")}
.kzc-head{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:4px 12px}
.kzc-heading{display:flex;flex-direction:column;gap:2px;min-width:0}
.kzc-title{margin:0;font-family:var(--kz-font-display,inherit);font-size:14px;font-weight:600;line-height:20px;color:var(--kzc-text)}
.kzc-desc{margin:0;font-size:13px;line-height:18px;color:var(--kzc-text-2)}
.kzc-tools{display:flex;flex-wrap:wrap;gap:4px}
.kzc-btn{appearance:none;display:inline-flex;align-items:center;gap:4px;height:28px;padding:0 10px;border:1px solid var(--kz-border-default);border-radius:var(--kz-radius-md,8px);background:transparent;color:var(--kzc-text-2);font:inherit;font-size:12px;font-weight:500;cursor:pointer;transition:background-color .15s,color .15s}
.kzc-btn:hover{background:var(--kz-surface-2);color:var(--kzc-text)}
.kzc-btn:focus-visible,.kzc-plot:focus-visible{outline:2px solid var(--kz-ring);outline-offset:2px}
.kzc-btn[aria-pressed=true]{background:var(--kz-surface-3);color:var(--kzc-text)}
.kzc-plot{position:relative;width:100%;border-radius:var(--kz-radius-md,8px);outline:none}
.kzc-plot svg{display:block;overflow:visible}
.kzc-svg text{fill:var(--kzc-text-2);font-size:11px;font-family:inherit}
.kzc-svg .kzc-strong{fill:var(--kzc-text);font-weight:600}
.kzc-grid{stroke:var(--kzc-grid);stroke-width:1;shape-rendering:crispEdges}
.kzc-axis{stroke:var(--kzc-axis);stroke-width:1;shape-rendering:crispEdges}
.kzc-threshold{stroke:var(--kzc-tone);stroke-width:1.5;stroke-dasharray:6 4}
.kzc-threshold-label{fill:var(--kzc-text)!important;font-weight:600;paint-order:stroke;stroke:var(--kzc-surface);stroke-width:3px;stroke-linejoin:round}
.kzc-cursor{stroke:var(--kzc-axis);stroke-width:1}
.kzc-line{fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}
.kzc-area{stroke:none;opacity:.14}
.kzc-dot{stroke:var(--kzc-surface);stroke-width:2}
.kzc-mark{transition:opacity .15s}
.kzc[data-active] .kzc-mark[data-dim]{opacity:.35}
.kzc-legend{display:flex;flex-wrap:wrap;gap:4px 14px;margin:0;padding:0;list-style:none;font-size:12px;color:var(--kzc-text-2)}
.kzc-legend li{display:inline-flex;align-items:center;gap:6px}
.kzc-key{width:10px;height:10px;border-radius:3px;flex:none}
.kzc-key[data-shape=line]{height:3px;border-radius:2px;width:14px}
.kzc-tip{position:absolute;z-index:2;pointer-events:none;min-width:140px;max-width:260px;padding:8px 10px;border:1px solid var(--kz-border-default);border-radius:var(--kz-radius-lg,10px);background:var(--kz-surface-2);color:var(--kzc-text);box-shadow:var(--kz-shadow-lg);font-size:12px;line-height:18px}
.kzc-tip-title{margin:0 0 4px;font-weight:600;color:var(--kzc-text)}
.kzc-tip-row{display:flex;align-items:center;gap:8px;margin:0}
.kzc-tip-row span:nth-child(2){flex:1;color:var(--kzc-text-2)}
.kzc-tip-row b{font-weight:600}
.kzc-tip-note{margin:4px 0 0;color:var(--kzc-text-3)}
.kzc-summary{margin:0;font-size:12px;line-height:18px;color:var(--kzc-text-2)}
.kzc-sr{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
.kzc-table-wrap{max-height:320px;overflow:auto;border:1px solid var(--kz-border-subtle);border-radius:var(--kz-radius-md,8px)}
.kzc-table{width:100%;border-collapse:collapse;font-size:12px}
.kzc-table caption{padding:8px 10px;text-align:left;font-weight:600;color:var(--kzc-text)}
.kzc-table th,.kzc-table td{padding:6px 10px;border-top:1px solid var(--kz-border-subtle);text-align:right;white-space:nowrap}
.kzc-table th[scope=row],.kzc-table thead th:first-child{text-align:left;font-weight:500;color:var(--kzc-text)}
.kzc-table thead th{position:sticky;top:0;background:var(--kz-surface-1);color:var(--kzc-text-2);font-weight:500}
.kzc-state{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:16px;text-align:center;font-size:13px;color:var(--kzc-text-2);border:1px dashed var(--kz-border-default);border-radius:var(--kz-radius-lg,10px)}
.kzc-state[data-state=error]{color:var(--kz-danger-text,var(--kzc-text))}
.kzc-skeleton{position:absolute;inset:0;display:flex;align-items:flex-end;gap:6%;padding:12px 4% 24px;border-radius:var(--kz-radius-lg,10px);overflow:hidden}
.kzc-skeleton i{flex:1;border-radius:4px 4px 0 0;background:var(--kz-surface-2)}
.kzc-live{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
.kzc-host{position:absolute;inset:0}
.kzc-host>div{border-radius:inherit}
@media (prefers-reduced-motion:no-preference){
.kzc-skeleton i{animation:kzc-pulse 1.6s ease-in-out infinite}
.kzc[data-inview] .kzc-enter-line{stroke-dasharray:1;stroke-dashoffset:1;animation:kzc-draw .9s var(--kz-ease,ease-out) forwards}
.kzc[data-inview] .kzc-enter-fade{opacity:0;animation:kzc-fade .6s .3s var(--kz-ease,ease-out) forwards}
.kzc[data-inview] .kzc-enter-grow{transform:scaleY(0);transform-box:fill-box;transform-origin:bottom;animation:kzc-grow .6s var(--kz-ease,ease-out) forwards}
.kzc[data-inview] .kzc-enter-grow[data-negative]{transform-origin:top}
.kzc[data-inview] .kzc-enter-growx{transform:scaleX(0);transform-box:fill-box;transform-origin:left;animation:kzc-growx .6s var(--kz-ease,ease-out) forwards}
.kzc[data-inview] .kzc-enter-growx[data-negative]{transform-origin:right}
.kzc[data-inview] .kzc-enter-pop{opacity:0;transform:scale(.92);transform-box:view-box;transform-origin:center;animation:kzc-pop .6s var(--kz-ease,ease-out) forwards}
.kzc:not([data-inview]) .kzc-enter-line,.kzc:not([data-inview]) .kzc-enter-fade,.kzc:not([data-inview]) .kzc-enter-grow,.kzc:not([data-inview]) .kzc-enter-growx,.kzc:not([data-inview]) .kzc-enter-pop{visibility:hidden}
.kzc[data-live] *{animation:none!important}
}
@keyframes kzc-draw{to{stroke-dashoffset:0}}
@keyframes kzc-fade{to{opacity:1}}
@keyframes kzc-grow{to{transform:scaleY(1)}}
@keyframes kzc-growx{to{transform:scaleX(1)}}
@keyframes kzc-pop{to{opacity:1;transform:none}}
@keyframes kzc-pulse{50%{opacity:.5}}
@media (forced-colors:active){.kzc-line{stroke:CanvasText}.kzc-key{forced-color-adjust:none}}
`.replace(/\n/g, "");

/** The stylesheet, once per document (React 19 hoists and deduplicates it, on the server too). */
export function ChartStyles() {
  return (
    <style href="krizaka-charts" precedence="default">
      {CSS}
    </style>
  );
}
