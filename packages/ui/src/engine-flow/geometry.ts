// Server-safe, pure. The geometry of EngineFlow: where the hub and the nodes sit in a box 100 units wide, and the
// conduit from each node to the hub (an SVG path drawn node → hub, and its length, so photons travel at one speed on
// every conduit). No DOM: the same numbers on the server and in the browser.

/** How the nodes are placed around the hub. */
export type FlowLayout = "radial" | "top-to-bottom" | "left-to-right";
/** The shape of a conduit: an S-shaped cubic Bézier, or a straight line. */
export type FlowConduit = "bezier" | "straight";

export interface FlowPoint {
  x: number;
  y: number;
}

export interface FlowGeometry {
  /** The box: 100 units wide, `height` units high (the stage keeps this aspect ratio, so nothing is distorted). */
  width: number;
  height: number;
  hub: FlowPoint;
  nodes: FlowPoint[];
  /** One path per node, from the node to the hub. */
  paths: string[];
  /** The length of each path, in units. */
  lengths: number[];
}

/** The box height per layout (the width is always 100). */
export const FLOW_HEIGHT: Record<FlowLayout, number> = { radial: 60, "top-to-bottom": 92, "left-to-right": 56 };

const r2 = (n: number) => Math.round(n * 100) / 100;
const pt = (p: FlowPoint) => `${r2(p.x)} ${r2(p.y)}`;

function cubicLength(a: FlowPoint, b: FlowPoint, c: FlowPoint, d: FlowPoint): number {
  let length = 0;
  let prev = a;
  for (let i = 1; i <= 32; i++) {
    const t = i / 32;
    const u = 1 - t;
    const p = {
      x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
      y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y,
    };
    length += Math.hypot(p.x - prev.x, p.y - prev.y);
    prev = p;
  }
  return length;
}

/** The positions of `count` nodes around the hub. */
export function flowPositions(layout: FlowLayout, count: number): { hub: FlowPoint; nodes: FlowPoint[] } {
  const height = FLOW_HEIGHT[layout];
  const n = Math.max(0, count);
  if (layout === "top-to-bottom") {
    return { hub: { x: 50, y: 72 }, nodes: Array.from({ length: n }, (_, i) => ({ x: ((i + 0.5) * 100) / n, y: 13 })) };
  }
  if (layout === "left-to-right") {
    return { hub: { x: 80, y: height / 2 }, nodes: Array.from({ length: n }, (_, i) => ({ x: 12, y: ((i + 0.5) * height) / n })) };
  }
  // Radial: on an ellipse around the centre; an even count puts two nodes level with the hub (more room for labels).
  const hub = { x: 50, y: height / 2 };
  const start = n % 2 === 0 ? -90 + 180 / Math.max(n, 1) : -90;
  return {
    hub,
    nodes: Array.from({ length: n }, (_, i) => {
      const a = ((start + (360 / n) * i) * Math.PI) / 180;
      return { x: hub.x + 37 * Math.cos(a), y: hub.y + 20 * Math.sin(a) };
    }),
  };
}

/** The whole geometry of a flow: positions, conduits (node → hub) and their lengths. */
export function flowGeometry(layout: FlowLayout, count: number, conduit: FlowConduit = "bezier"): FlowGeometry {
  const { hub, nodes } = flowPositions(layout, count);
  const paths: string[] = [];
  const lengths: number[] = [];
  for (const p of nodes) {
    // Each conduit lands on its own point of the hub (a fan), so the lines stay apart where they meet.
    const end =
      layout === "top-to-bottom"
        ? { x: hub.x + (p.x - hub.x) * 0.18, y: hub.y }
        : layout === "left-to-right"
          ? { x: hub.x, y: hub.y + (p.y - hub.y) * 0.18 }
          : hub;
    if (conduit === "straight") {
      paths.push(`M${pt(p)} L${pt(end)}`);
      lengths.push(Math.hypot(end.x - p.x, end.y - p.y));
      continue;
    }
    let c1: FlowPoint;
    let c2: FlowPoint;
    if (layout === "top-to-bottom") {
      const mid = (p.y + end.y) / 2;
      c1 = { x: p.x, y: mid };
      c2 = { x: end.x, y: mid };
    } else if (layout === "left-to-right") {
      const mid = (p.x + end.x) / 2;
      c1 = { x: mid, y: p.y };
      c2 = { x: mid, y: end.y };
    } else {
      // An S: leave the node bending one way, reach the hub bending the other.
      const dx = end.x - p.x;
      const dy = end.y - p.y;
      const len = Math.hypot(dx, dy) || 1;
      const k = 0.14 * len;
      const nx = -dy / len;
      const ny = dx / len;
      c1 = { x: p.x + dx * 0.35 + nx * k, y: p.y + dy * 0.35 + ny * k };
      c2 = { x: p.x + dx * 0.65 - nx * k, y: p.y + dy * 0.65 - ny * k };
    }
    paths.push(`M${pt(p)} C${pt(c1)} ${pt(c2)} ${pt(end)}`);
    lengths.push(cubicLength(p, c1, c2, end));
  }
  return { width: 100, height: FLOW_HEIGHT[layout], hub, nodes, paths, lengths };
}
