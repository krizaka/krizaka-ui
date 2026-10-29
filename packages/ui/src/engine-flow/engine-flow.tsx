// Client (the node a visitor points at or focuses). An engine at the hub and the apps it serves around it: one conduit
// per app, and photons that travel it — towards the hub (`in`: requests), back (`out`: results) or both — in the app's
// brand colour going in and the hub's coming back. A planned app is drawn dim, its conduit dashed and still.
//
// Motion is the Krizaka signature's (motion.css): CSS animations of `stroke-dashoffset`, no animation frame, no canvas;
// paused off screen (`data-motion-scope` → MotionObserver's `data-offscreen`), held while the page settles (`kz-loop`),
// a still frame under reduced motion and Save-Data (the photons rest along their conduit). The stage keeps its aspect ratio and the
// detail line its height: no layout shift.
//
// Anchoring: a conduit runs between the centres of the node's circle and of the hub's ring (the label and the caption hang
// below them, out of the box), and both circles are opaque and drawn over it — so every conduit meets the circle at the point
// facing the other end, whatever the layout and the number of nodes.
//
// Accessible: the drawing is hidden from assistive technology; every node is a real button named by its label, and the
// detail line (polite live region) says the chosen node's description with its link. Pair it with a text version (a
// list) in the page: the figure is a picture of it.
import * as React from "react";

import { cn } from "../cn";
import { type FlowConduit, flowGeometry, type FlowLayout } from "./geometry";

export interface EngineFlowNode {
  /** A stable id (`yomizaka`). */
  id: string;
  /** Its name, the button's accessible name ("Yomizaka"). */
  label: string;
  /** Its mark (a `ProductLogo`), decorative. */
  mark?: React.ReactNode;
  /** One line: what it uses the engine for — shown when the node is pointed at or focused. */
  description?: React.ReactNode;
  /** Where it lives (its site). */
  href?: string;
  /** The link's words ("Visit dev.yomizaka.com"); defaults to the label. */
  linkLabel?: React.ReactNode;
  /** Opens the link in a new tab. */
  external?: boolean;
  /** What travels: `in` towards the hub, `out` back from it, `both`.
   * @default "in" */
  flow?: "in" | "out" | "both";
  /** Not wired yet: drawn dim, its conduit dashed and still, no photon. */
  planned?: boolean;
  /** A word beside the name in the detail line ("planned"), passed translated. */
  status?: React.ReactNode;
  /** Its brand scope (`brand-yomizaka`): its conduit, photons and ring take its `--kz-accent`. */
  className?: string;
}

export interface EngineFlowHub {
  /** The engine's name ("Orazaka"). */
  label: string;
  /** Its mark, decorative. */
  mark?: React.ReactNode;
  /** A line under the name ("the engine"). */
  caption?: React.ReactNode;
  /** Its brand scope; the photons coming back take its accent. */
  className?: string;
}

export type EngineFlowProps = Omit<React.ComponentProps<"figure">, "children"> & {
  /** What the figure shows ("Orazaka and the products it powers"), passed translated. */
  label: string;
  /** The engine, at the hub. */
  hub: EngineFlowHub;
  /** The apps around it. */
  nodes: readonly EngineFlowNode[];
  /** How the nodes sit around the hub.
   * @default "radial" */
  layout?: FlowLayout;
  /** The layout under a 560 px wide container (a phone); `false` keeps `layout` everywhere.
   * @default "top-to-bottom" */
  compactLayout?: FlowLayout | false;
  /** `photons` travel the conduits; `none` draws them still.
   * @default "photons" */
  particles?: "photons" | "none";
  /** The conduits' shape.
   * @default "bezier" */
  conduit?: FlowConduit;
  /** The detail line before a node is chosen ("Point at a product"). */
  hint?: React.ReactNode;
  /** The node shown in the detail line at first. */
  defaultActive?: string;
  /** Photon speed, in units per second (the stage is 100 units wide).
   * @default 16 */
  speed?: number;
  /** How many photons share a conduit: `sparse` one or two, `normal` two to four, `dense` four to eight.
   * @default "normal" */
  density?: FlowDensity;
  /** When the photons travel: `always`; `hover` only while the pointer or focus is on the figure (they rest along the
   * conduits otherwise); `active` only on the conduit of the chosen node (the others show nothing). Off screen they
   * are always paused, and still under reduced motion.
   * @default "always" */
  trigger?: FlowTrigger;
  /** The photons' timing function: `linear` (a steady stream), `ease-in-out` (a pulse that swells and settles), or any
   * CSS `<easing-function>` (`cubic-bezier(.2,0,0,1)`, `steps(6)`).
   * @default "linear" */
  easing?: FlowEasing;
  /** Milliseconds between one conduit's photons and the next's: 0 sends them all together.
   * @default 300 */
  stagger?: number;
  /** The engine's mark swells slowly (a loop, still under reduced motion).
   * @default true */
  breathe?: boolean;
  /** The calm level, for a small frame (a tile of a home page): sparse photons at a low rate, a slow breath, no hint and
   * no detail line, nothing to tune. It plays only on screen and once the page has settled, and stays still under
   * reduced motion and Save-Data. Overrides `speed`, `density`, `stagger` and `trigger`.
   * @default false */
  calm?: boolean;
};

/** The calm level's pace: units per second, photons per conduit, milliseconds between conduits. */
export const CALM_FLOW = { speed: 4, density: "sparse", stagger: 1200 } as const satisfies { speed: number; density: FlowDensity; stagger: number };

const subscribeSaveData = (onChange: () => void) => {
  const c = (navigator as Navigator & { connection?: EventTarget }).connection;
  c?.addEventListener?.("change", onChange);
  return () => c?.removeEventListener?.("change", onChange);
};
const readSaveData = () => (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;


export type FlowDensity = "sparse" | "normal" | "dense";
export type FlowTrigger = "always" | "hover" | "active";
export type FlowEasing = "linear" | "ease-in-out" | (string & {});

/** How many photons a conduit of this length carries (evenly spaced, so the gap is `length / count`). */
export function photonCount(length: number, density: FlowDensity = "normal"): number {
  const base = Math.round(length / 16);
  if (density === "sparse") return Math.min(2, Math.max(1, Math.round(base / 2)));
  if (density === "dense") return Math.min(8, Math.max(4, base * 2));
  return Math.min(4, Math.max(2, base));
}

function Stage({
  layout,
  variant,
  nodes,
  hub,
  conduit,
  particles,
  speed,
  density,
  easing,
  stagger,
  breathe,
  active,
  onActive,
  detailId,
}: {
  layout: FlowLayout;
  variant: "wide" | "compact";
  nodes: readonly EngineFlowNode[];
  hub: EngineFlowHub;
  conduit: FlowConduit;
  particles: "photons" | "none";
  speed: number;
  density: FlowDensity;
  easing: FlowEasing;
  stagger: number;
  breathe: boolean;
  active: string | undefined;
  onActive: (id: string) => void;
  detailId: string | undefined;
}) {
  const g = flowGeometry(layout, nodes.length, conduit);
  const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;
  return (
    <div className="kz-flow-stage" data-variant={variant} data-layout={layout} style={{ aspectRatio: `${g.width} / ${g.height}` }}>
      <svg viewBox={`0 0 ${g.width} ${g.height}`} aria-hidden="true" focusable="false">
        {nodes.map((node, i) => {
          const flow = node.flow ?? "in";
          const length = g.lengths[i] ?? 0;
          // Photons per conduit (`density`), evenly spaced; the same speed on every conduit.
          const gap = length / photonCount(length, density);
          const period = gap / speed;
          const timing = (dir: "in" | "out") =>
            ({
              "--kz-flow-gap": gap.toFixed(3),
              animationDuration: `${period.toFixed(2)}s`,
              // Each conduit starts `stagger` ms after the previous (a negative delay: already under way); the way back is half a period behind.
              animationDelay: `${(-(((i * stagger) / 1000 + (dir === "out" ? period / 2 : 0)) % period)).toFixed(2)}s`,
              ...(easing !== "linear" ? { animationTimingFunction: easing } : {}),
            }) as React.CSSProperties;
          const lanes = node.planned || particles === "none" ? [] : flow === "both" ? (["in", "out"] as const) : [flow];
          return (
            <g
              key={node.id}
              className={cn("kz-flow-link", node.className)}
              data-flow={flow}
              data-planned={node.planned ? "" : undefined}
              data-active={active === node.id ? "" : undefined}
            >
              <path className="kz-flow-wire" d={g.paths[i]} />
              {lanes.map((dir) => (
                <React.Fragment key={dir}>
                  <path className="kz-flow-photon kz-loop" data-dir={dir} data-halo="" d={g.paths[i]} style={timing(dir)} />
                  <path className="kz-flow-photon kz-loop" data-dir={dir} d={g.paths[i]} style={timing(dir)} />
                </React.Fragment>
              ))}
            </g>
          );
        })}
      </svg>
      <div className={cn("kz-flow-hub", hub.className)} style={{ left: pct(g.hub.x, g.width), top: pct(g.hub.y, g.height) }}>
        {hub.mark ? <span className={cn("kz-flow-hub-mark", breathe && "kz-loop")}>{hub.mark}</span> : null}
        <span className="kz-flow-hub-text">
          <span className="kz-flow-hub-label">{hub.label}</span>
          {hub.caption ? <span className="kz-flow-hub-caption">{hub.caption}</span> : null}
        </span>
      </div>
      <ul className="kz-flow-nodes">
        {nodes.map((node, i) => {
          const p = g.nodes[i]!;
          const on = active === node.id;
          return (
            <li key={node.id} style={{ left: pct(p.x, g.width), top: pct(p.y, g.height) }}>
              <button
                type="button"
                className={cn("kz-flow-node", node.className)}
                data-active={on ? "" : undefined}
                data-planned={node.planned ? "" : undefined}
                aria-pressed={on}
                aria-controls={detailId}
                onPointerEnter={() => onActive(node.id)}
                onFocus={() => onActive(node.id)}
                onClick={() => onActive(node.id)}
              >
                {node.mark ? (
                  <span className="kz-flow-node-mark" aria-hidden="true">
                    {node.mark}
                  </span>
                ) : null}
                <span className="kz-flow-node-label">{node.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type FlowDataInput = { chosen: boolean; calm: boolean; saveData: boolean; trigger: string; density: string; compact: boolean };

/** The figure's data attributes: the CSS reads the state from them. */
function flowData({ chosen, calm, saveData, trigger, density, compact }: FlowDataInput) {
  return {
    "data-active": chosen ? "" : undefined,
    "data-calm": calm ? "" : undefined,
    "data-still": saveData ? "" : undefined,
    "data-trigger": calm || trigger === "always" ? undefined : trigger,
    "data-density": calm ? "sparse" : density === "normal" ? undefined : density,
    "data-compact": compact ? "" : undefined,
  };
}

/** What the chosen node says, or the hint when none is chosen. */
function FlowDetail({ id, chosen, hint }: { id: string; chosen: EngineFlowNode | undefined; hint: React.ReactNode }) {
  return (
    <figcaption id={id} className={cn("kz-flow-detail", chosen?.className)} aria-live="polite">
      {chosen ? (
        <>
          <strong>{chosen.label}</strong>
          {chosen.status ? <span className="kz-flow-status">{chosen.status}</span> : null}
          {chosen.description ? <span> {chosen.description}</span> : null}
          {chosen.href ? (
            <>
              {" "}
              <a href={chosen.href} {...(chosen.external ? { target: "_blank", rel: "noopener" } : {})}>
                {chosen.linkLabel ?? chosen.label}
                <span aria-hidden="true"> →</span>
              </a>
            </>
          ) : null}
        </>
      ) : (
        hint
      )}
    </figcaption>
  );
}

/** An engine at the hub and the apps it serves, with what travels between them. */
export function EngineFlow({
  label,
  hub,
  nodes,
  layout = "radial",
  compactLayout = "top-to-bottom",
  particles = "photons",
  conduit = "bezier",
  hint,
  defaultActive,
  speed = 16,
  density = "normal",
  trigger = "always",
  easing = "linear",
  stagger = 300,
  breathe = true,
  calm = false,
  className,
  ...props
}: EngineFlowProps) {
  const [active, setActive] = React.useState<string | undefined>(defaultActive);
  const detailId = `${React.useId()}-detail`;
  const chosen = nodes.find((n) => n.id === active);
  const compact = compactLayout && compactLayout !== layout ? compactLayout : undefined;
  // Save-Data: the calm and the full levels both rest (a still frame, like reduced motion).
  const saveData = React.useSyncExternalStore(subscribeSaveData, readSaveData, () => false);
  const pace = calm ? CALM_FLOW : { speed: Math.max(1, speed), density, stagger: Math.max(0, stagger) };
  const stage = { nodes, hub, conduit, particles, ...pace, easing, breathe, active, onActive: setActive, detailId: calm ? undefined : detailId };
  return (
    <figure
      aria-label={label}
      className={cn("kz-flow", className)}
      data-motion-scope=""
      {...flowData({ chosen: Boolean(chosen), calm, saveData, trigger, density, compact: Boolean(compact) })}
      {...props}
    >
      <Stage layout={layout} variant="wide" {...stage} />
      {compact ? <Stage layout={compact} variant="compact" {...stage} /> : null}
      {calm ? null : <FlowDetail id={detailId} chosen={chosen} hint={hint} />}
    </figure>
  );
}
