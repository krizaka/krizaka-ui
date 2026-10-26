// Client (the node a visitor points at or focuses). An engine at the hub and the apps it serves around it: one conduit
// per app, and photons that travel it — towards the hub (`in`: requests), back (`out`: results) or both — in the app's
// brand colour going in and the hub's coming back. A planned app is drawn dim, its conduit dashed and still.
//
// Motion is the Krizaka signature's (motion.css): CSS animations of `stroke-dashoffset`, no animation frame, no canvas;
// paused off screen (`data-motion-scope` → MotionObserver's `data-offscreen`), held while the page settles (`kz-loop`),
// a still frame under reduced motion (the photons rest along their conduit). The stage keeps its aspect ratio and the
// detail line its height: no layout shift.
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
};

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
  detailId: string;
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
        <span className="kz-flow-hub-label">{hub.label}</span>
        {hub.caption ? <span className="kz-flow-hub-caption">{hub.caption}</span> : null}
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
  className,
  ...props
}: EngineFlowProps) {
  const [active, setActive] = React.useState<string | undefined>(defaultActive);
  const detailId = `${React.useId()}-detail`;
  const chosen = nodes.find((n) => n.id === active);
  const compact = compactLayout && compactLayout !== layout ? compactLayout : undefined;
  const stage = { nodes, hub, conduit, particles, speed: Math.max(1, speed), density, easing, stagger: Math.max(0, stagger), breathe, active, onActive: setActive, detailId };
  return (
    <figure
      aria-label={label}
      className={cn("kz-flow", className)}
      data-motion-scope=""
      data-active={chosen ? "" : undefined}
      data-trigger={trigger === "always" ? undefined : trigger}
      data-density={density === "normal" ? undefined : density}
      data-compact={compact ? "" : undefined}
      {...props}
    >
      <Stage layout={layout} variant="wide" {...stage} />
      {compact ? <Stage layout={compact} variant="compact" {...stage} /> : null}
      <figcaption id={detailId} className={cn("kz-flow-detail", chosen?.className)} aria-live="polite">
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
    </figure>
  );
}
