// Server-safe. One laid-out C4 view drawn as a figure of the plate (blocks.css: `kz-plate`, `kz-arch-*`): the layout
// comes from @krizaka/architecture, this file only draws it. Safe by construction: every SVG element is written here
// from typed fields; no tag or attribute name is read from the view, every word is a React text child, and a link is
// only an href the host passes, checked by `safeHref`. The drawing is an image (`role="img"`, named by `aria-label`: an
// SVG `<title>` would count as a second document title for the sites' SEO check); its full text version
// (elements, relations or the numbered steps) is a `<details>` built from the same view.
import type { ArchEdge, ArchNode, ArchView, Box, Point } from "@krizaka/architecture";
import type * as React from "react";

import { cx } from "../cx";

/* Every size of the drawing, in the layout's units (the view's pixels): the SVG scales them with its column. */
const SIZE = {
  /** The room around the view's bounds. */
  margin: 24,
  /** The offset of the paper shadow under each element. */
  shadow: 5,
  /** The title, the technology and the edge label's font sizes. */
  title: 21,
  technology: 15,
  label: 14,
  /** Line heights, as a multiple of the font size. */
  titleLeading: 1.2,
  technologyLeading: 1.3,
  /** Where the first baseline sits under the top of its line, as a multiple of the font size. */
  ascent: 0.85,
  /** The room between the title and the technology. */
  gap: 10,
  /** The words' side padding in a box, and in a queue (its rounded ends take room). */
  pad: 12,
  queuePad: 30,
  /** The average glyph width as a share of the font size, to wrap words without measuring them. */
  sansEm: 0.54,
  monoEm: 0.6,
  /** The fewest characters a wrapped line may hold. */
  minLine: 4,
  /** A person's head, a browser's bar and its three dots, a component's two tabs. */
  head: 11,
  browserBar: 20,
  browserDots: [14, 28, 42],
  browserDot: 3.5,
  tab: { width: 20, height: 14, at: [0.3, 0.55] },
  /** A cylinder's lid, and a queue's rounded ends. */
  lid: 14,
  lidRoom: 18,
  queueEnd: 16,
  /** A phone's corner and its home dot. */
  phoneCorner: 14,
  phoneDot: 4,
  /** A group's title, from its top left corner. */
  groupTitle: { dx: 18, dy: 30 },
  /** The arrowhead: its length and its half-angle (radians). */
  arrow: 16,
  arrowAngle: 0.42,
  /** The plate under an edge's label. */
  labelPad: 4,
  /** A step's numbered badge. */
  badge: 13,
  badgeText: 14,
  badgeGap: 6,
  /** The narrowest the drawing may shrink to fit its column, as a share of its own width: below, it scrolls in its frame. */
  minScale: 0.6,
} as const;

/** The shapes the component draws: anything else in the view is drawn as a box. */
type Shape = "box" | "person" | "browser" | "mobile" | "storage" | "queue" | "component";
const SHAPES: ReadonlyMap<string, Shape> = new Map([
  ["rectangle", "box"],
  ["person", "person"],
  ["browser", "browser"],
  ["mobile", "mobile"],
  ["storage", "storage"],
  ["cylinder", "storage"],
  ["queue", "queue"],
  ["component", "component"],
]);
/** The kinds drawn as outside the system (a paler body). */
const OUTSIDE: ReadonlySet<string> = new Set(["external"]);

/** The words of the text version: props, never translated here. */
export interface ArchitectureDiagramWords {
  /** The disclosure that opens the text version. @default "The diagram in words" */
  summary: string;
  /** The heading of the elements. @default "Elements" */
  elements: string;
  /** The heading of a static view's relations. @default "Relations" */
  relations: string;
  /** The heading of a dynamic view's ordered steps. @default "Steps" */
  steps: string;
}

/* The frame scrolls sideways on a narrow screen: it takes the keyboard focus so the arrow keys can scroll it (axe: scrollable-region-focusable). */
const SCROLL_FOCUS = { tabIndex: 0 } as const;

const WORDS: ArchitectureDiagramWords = {
  summary: "The diagram in words",
  elements: "Elements",
  relations: "Relations",
  steps: "Steps",
};

export type ArchitectureDiagramProps = Omit<React.HTMLAttributes<HTMLElement>, "title" | "children"> & {
  /** One laid-out view, as `@krizaka/architecture` emits it: the component draws it and lays out nothing. */
  view: ArchView;
  /** The figure's title, shown above the drawing and read as the image's name. @default view.title */
  title?: string;
  /** One line beside the title: the view's scope, its source. */
  subtitle?: React.ReactNode;
  /**
   * Links of the elements, by node id: each title of the text version becomes a link. Only `http:`/`https:` addresses
   * and same-site paths are kept (`safeHref`); any other is dropped and the title stays plain text.
   */
  links?: Readonly<Record<string, string>>;
  /** The words of the text version. */
  words?: Partial<ArchitectureDiagramWords>;
  /** Opens the text version from the start (a page where the words are the main reading). @default false */
  textOpen?: boolean;
};

const RELATIVE_BASE = "https://relative.invalid";

/**
 * The address a link may point at, or `undefined`: an `http:`/`https:` URL, a path on the same site (read from its root)
 * or an anchor of the page. Any other scheme (`javascript:`, `data:`, `mailto:`) is refused; a protocol-relative
 * `//host` is read as `https:`. The returned value is the parsed address, never the raw string.
 */
export function safeHref(href: string): string | undefined {
  if (!URL.canParse(href, RELATIVE_BASE)) return undefined;
  const url = new URL(href, RELATIVE_BASE);
  if (url.origin === RELATIVE_BASE) return href.startsWith("#") ? url.hash : `${url.pathname}${url.search}${url.hash}`;
  return url.protocol === "https:" || url.protocol === "http:" ? url.href : undefined;
}

/** Words wrapped to lines no wider than `width`, for a font of `size` whose average glyph is `em` of it. */
function wrap(text: string, width: number, size: number, em: number): string[] {
  const max = Math.max(SIZE.minLine, Math.floor(width / (size * em)));
  const rows: string[] = [];
  /* French quotes stay with their word: a line never starts with « » » nor ends with « « ». */
  const glued = text.replaceAll("« ", "« ").replaceAll(" »", " »");
  for (const word of glued.split(/\s+/).filter(Boolean)) {
    const last = rows.at(-1);
    if (last !== undefined && last.length + 1 + word.length <= max) rows[rows.length - 1] = `${last} ${word}`;
    else rows.push(word);
  }
  return rows;
}

/** The SVG path of the layout's edge points: a start, then cubic Bézier segments of three points each (else a polyline). */
function pathOf(points: readonly Point[]): string {
  const [first, ...rest] = points;
  if (!first || rest.length === 0) return "";
  const parts = [`M${first[0]},${first[1]}`];
  if (rest.length % 3 === 0) {
    for (let i = 0; i < rest.length; i += 3) parts.push(`C${rest[i]!.join(",")} ${rest[i + 1]!.join(",")} ${rest[i + 2]!.join(",")}`);
  } else {
    for (const [x, y] of rest) parts.push(`L${x},${y}`);
  }
  return parts.join(" ");
}

/** The arrowhead at the last point, pointing along the last segment. */
function arrowOf(points: readonly Point[]): string | null {
  const tip = points.at(-1);
  const from = points.at(-2);
  if (!tip || !from) return null;
  const angle = Math.atan2(tip[1] - from[1], tip[0] - from[0]);
  const wing = (da: number) => `${tip[0] - SIZE.arrow * Math.cos(angle + da)},${tip[1] - SIZE.arrow * Math.sin(angle + da)}`;
  return `${tip[0]},${tip[1]} ${wing(SIZE.arrowAngle)} ${wing(-SIZE.arrowAngle)}`;
}

/** Lines of text, one `<text>` each, centred on `x`. */
function Lines({ rows, x, y, size, leading, className }: Readonly<{ rows: string[]; x: number; y: number; size: number; leading: number; className: string }>) {
  /* A row's text is its identity: the same line twice in one block is told apart by its place. */
  return rows.map((row, i) => (
    <text key={`${i}:${row}`} x={x} y={y + i * size * leading} fontSize={size} textAnchor="middle" className={className}>
      {row}
    </text>
  ));
}

function ShapeOf({ node, shape }: Readonly<{ node: ArchNode; shape: Shape }>) {
  const { x, y, width: w, height: h } = node;
  const s = SIZE.shadow;
  const rect = <rect x={x} y={y} width={w} height={h} className="kz-arch-body" />;
  const shadow = <rect x={x + s} y={y + s} width={w} height={h} className="kz-arch-shadow" />;
  switch (shape) {
    case "person":
      return (
        <>
          {shadow}
          {rect}
          <circle cx={x + w / 2} cy={y} r={SIZE.head} className="kz-arch-body" />
        </>
      );
    case "browser":
      return (
        <>
          {shadow}
          {rect}
          <line x1={x} y1={y + SIZE.browserBar} x2={x + w} y2={y + SIZE.browserBar} className="kz-arch-detail" />
          {SIZE.browserDots.map((dx) => (
            <circle key={dx} cx={x + dx} cy={y + SIZE.browserBar / 2} r={SIZE.browserDot} className="kz-arch-dot" />
          ))}
        </>
      );
    case "mobile":
      return (
        <>
          <rect x={x + s} y={y + s} width={w} height={h} rx={SIZE.phoneCorner} className="kz-arch-shadow" />
          <rect x={x} y={y} width={w} height={h} rx={SIZE.phoneCorner} className="kz-arch-body" />
          <circle cx={x + w / 2} cy={y + h - SIZE.phoneCorner / 2} r={SIZE.phoneDot} className="kz-arch-dot" />
        </>
      );
    case "storage": {
      const ry = SIZE.lid;
      const d = `M${x},${y + ry} A${w / 2},${ry} 0 0 1 ${x + w},${y + ry} V${y + h - ry} A${w / 2},${ry} 0 0 1 ${x},${y + h - ry} Z`;
      return (
        <>
          <path d={d} transform={`translate(${s},${s})`} className="kz-arch-shadow" />
          <path d={d} className="kz-arch-body" />
          <path d={`M${x},${y + ry} A${w / 2},${ry} 0 0 0 ${x + w},${y + ry}`} className="kz-arch-detail" />
        </>
      );
    }
    case "queue": {
      const rx = SIZE.queueEnd;
      const d = `M${x + rx},${y} H${x + w - rx} A${rx},${h / 2} 0 0 1 ${x + w - rx},${y + h} H${x + rx} A${rx},${h / 2} 0 0 1 ${x + rx},${y} Z`;
      return (
        <>
          <path d={d} transform={`translate(${s},${s})`} className="kz-arch-shadow" />
          <path d={d} className="kz-arch-body" />
          <path d={`M${x + w - rx},${y} A${rx},${h / 2} 0 0 0 ${x + w - rx},${y + h}`} className="kz-arch-detail" />
        </>
      );
    }
    case "component":
      return (
        <>
          {shadow}
          {rect}
          {SIZE.tab.at.map((k) => (
            <rect
              key={k}
              x={x - SIZE.tab.width / 2}
              y={y + h * k}
              width={SIZE.tab.width}
              height={SIZE.tab.height}
              className="kz-arch-body kz-arch-tab"
            />
          ))}
        </>
      );
    case "box":
      return (
        <>
          {shadow}
          {rect}
        </>
      );
  }
}

/** A group (a compound node): a dashed frame and its name in capitals at the top left. */
function Group({ node }: Readonly<{ node: ArchNode }>) {
  return (
    <g className="kz-arch-group">
      <rect x={node.x} y={node.y} width={node.width} height={node.height} className="kz-arch-group-frame" />
      <text x={node.x + SIZE.groupTitle.dx} y={node.y + SIZE.groupTitle.dy} fontSize={SIZE.technology} className="kz-arch-group-title">
        {node.title}
      </text>
    </g>
  );
}

/** An element: its shape, its title and its technology centred in it. */
function Element({ node }: Readonly<{ node: ArchNode }>) {
  const shape = SHAPES.get(node.shape) ?? "box";
  const pad = shape === "queue" ? SIZE.queuePad : SIZE.pad;
  const room = node.width - 2 * pad;
  const title = wrap(node.title, room, SIZE.title, SIZE.sansEm);
  const tech = node.technology ? wrap(node.technology, room, SIZE.technology, SIZE.monoEm) : [];
  const titleHeight = title.length * SIZE.title * SIZE.titleLeading;
  const block = titleHeight + (tech.length ? SIZE.gap + tech.length * SIZE.technology * SIZE.technologyLeading : 0);
  /* A cylinder's lid takes the top of its box: the words sit under it. */
  const lid = shape === "storage" ? SIZE.lidRoom : 0;
  const top = node.y + lid + (node.height - lid - block) / 2 + SIZE.title * SIZE.ascent;
  const cx = node.x + node.width / 2;
  return (
    <g className="kz-arch-element" data-shape={shape} data-outside={OUTSIDE.has(node.kind) || undefined}>
      <ShapeOf node={node} shape={shape} />
      <Lines rows={title} x={cx} y={top} size={SIZE.title} leading={SIZE.titleLeading} className="kz-arch-title" />
      <Lines rows={tech} x={cx} y={top + titleHeight + SIZE.gap} size={SIZE.technology} leading={SIZE.technologyLeading} className="kz-arch-technology" />
    </g>
  );
}

/** The middle of an edge's points: where its step badge goes when it has no label. */
function middleOf(points: readonly Point[]): Point | undefined {
  return points[Math.floor(points.length / 2)];
}

/** An edge's line and arrowhead (drawn under the elements). */
function Stroke({ edge, dynamic }: Readonly<{ edge: ArchEdge; dynamic: boolean }>) {
  const arrow = arrowOf(edge.back ? [...edge.points].reverse() : edge.points);
  return (
    <g className="kz-arch-edge" data-dynamic={dynamic || undefined}>
      <path d={pathOf(edge.points)} className="kz-arch-line" />
      {arrow && <polygon points={arrow} className="kz-arch-arrow" />}
    </g>
  );
}

/** An edge's label on its plate and, in a dynamic view, its numbered badge (drawn over the elements). */
function EdgeLabel({ edge, dynamic }: Readonly<{ edge: ArchEdge; dynamic: boolean }>) {
  const step = dynamic ? edge.step : null;
  const box: Box | null = edge.labelBBox;
  const rows = edge.label && box ? wrap(edge.label, box.width + 2 * SIZE.labelPad, SIZE.label, SIZE.monoEm) : [];
  if (rows.length === 0 && step === null) return null;
  const centre = box ? ([box.x + box.width / 2, box.y + box.height / 2] as const) : middleOf(edge.points);
  if (!centre) return null;
  const [cx, cy] = centre;
  const width = (box?.width ?? 0) + 4 * SIZE.labelPad;
  const height = rows.length * SIZE.label * SIZE.technologyLeading + 2 * SIZE.labelPad;
  const badgeX = rows.length ? cx - width / 2 - SIZE.badgeGap - SIZE.badge : cx;
  return (
    <g className="kz-arch-label">
      {rows.length > 0 && (
        <>
          <rect x={cx - width / 2} y={cy - height / 2} width={width} height={height} className="kz-arch-label-plate" />
          <Lines
            rows={rows}
            x={cx}
            y={cy - height / 2 + SIZE.labelPad + SIZE.label * SIZE.ascent}
            size={SIZE.label}
            leading={SIZE.technologyLeading}
            className="kz-arch-label-text"
          />
        </>
      )}
      {step !== null && (
        <g className="kz-arch-step" data-step={step}>
          <circle cx={badgeX} cy={cy} r={SIZE.badge} className="kz-arch-step-badge" />
          <text x={badgeX} y={cy} fontSize={SIZE.badgeText} textAnchor="middle" dominantBaseline="central" className="kz-arch-step-number">
            {step}
          </text>
        </g>
      )}
    </g>
  );
}

/** An element's line of the text version: its title (a link when the host gave a safe one), technology, description. */
function ElementText({ node, links }: Readonly<{ node: ArchNode; links: Readonly<Record<string, string>> | undefined }>) {
  const given = links && Object.hasOwn(links, node.id) ? links[node.id] : undefined;
  const href = given === undefined ? undefined : safeHref(given);
  return (
    <>
      {href ? <a href={href}>{node.title}</a> : <b>{node.title}</b>}
      {node.technology && <span className="kz-arch-text-tech"> ({node.technology})</span>}
      {node.description && <>: {node.description}</>}
    </>
  );
}

/** The elements as nested lists: a group lists the elements inside it. */
function ElementList({ nodes, parent, links }: Readonly<{ nodes: readonly ArchNode[]; parent: string | null; links: Readonly<Record<string, string>> | undefined }>) {
  const ids = new Set(nodes.map((n) => n.id));
  const here = nodes.filter((n) => (parent === null ? n.parent === null || !ids.has(n.parent) : n.parent === parent));
  if (here.length === 0) return null;
  return (
    <ul className="kz-arch-text-list">
      {here.map((n) => (
        <li key={n.id}>
          <ElementText node={n} links={links} />
          {n.compound && <ElementList nodes={nodes} parent={n.id} links={links} />}
        </li>
      ))}
    </ul>
  );
}

/** One relation in words: `Source → Target: label`. */
function relationText(edge: ArchEdge, titles: ReadonlyMap<string, string>): string {
  const said = edge.label ? `: ${edge.label}` : "";
  return `${titles.get(edge.source) ?? edge.source} → ${titles.get(edge.target) ?? edge.target}${said}`;
}

/**
 * One laid-out C4 view (context, containers, components, or a dynamic flow) drawn on the plate: groups, elements by
 * shape, edges with their labels and, in a dynamic view, numbered steps. The full text version follows it.
 */
export function ArchitectureDiagram({ view, title, subtitle, links, words, textOpen = false, className, ...props }: ArchitectureDiagramProps) {
  const w = { ...WORDS, ...words };
  const name = title ?? view.title;
  const m = SIZE.margin;
  const { x, y, width, height } = view.bounds;
  const vbWidth = width + 2 * m + SIZE.shadow;
  const vbHeight = height + 2 * m + SIZE.shadow;
  const groups = view.nodes.filter((n) => n.compound);
  const elements = view.nodes.filter((n) => !n.compound);
  const titles = new Map(view.nodes.map((n) => [n.id, n.title]));
  const relations = view.dynamic
    ? [...view.edges].sort((a, b) => (a.step ?? Number.MAX_SAFE_INTEGER) - (b.step ?? Number.MAX_SAFE_INTEGER))
    : view.edges;
  return (
    <figure className={cx("kz-plate kz-arch", className)} data-dynamic={view.dynamic || undefined} {...props}>
      <figcaption className="kz-plate-head">
        <span className="kz-plate-title">{name}</span>
        {subtitle && <span className="kz-plate-sub">{subtitle}</span>}
      </figcaption>
      <section className="kz-arch-frame" aria-label={name} {...SCROLL_FOCUS}>
        <svg
          viewBox={`${x - m} ${y - m} ${vbWidth} ${vbHeight}`}
          role="img"
          aria-label={name}
          className="kz-arch-svg"
          style={{ minWidth: vbWidth * SIZE.minScale, maxWidth: vbWidth }}
        >
          {groups.map((n) => (
            <Group key={n.id} node={n} />
          ))}
          {view.edges.map((e) => (
            <Stroke key={e.id} edge={e} dynamic={view.dynamic} />
          ))}
          {elements.map((n) => (
            <Element key={n.id} node={n} />
          ))}
          {view.edges.map((e) => (
            <EdgeLabel key={e.id} edge={e} dynamic={view.dynamic} />
          ))}
        </svg>
      </section>
      <details className="kz-arch-text" open={textOpen}>
        <summary>{w.summary}</summary>
        <p className="kz-arch-text-head">{w.elements}</p>
        <ElementList nodes={view.nodes} parent={null} links={links} />
        {relations.length > 0 && (
          <>
            <p className="kz-arch-text-head">{view.dynamic ? w.steps : w.relations}</p>
            {view.dynamic ? (
              <ol className="kz-arch-text-list">
                {relations.map((e, i) => (
                  <li key={e.id} value={e.step ?? i + 1}>
                    {relationText(e, titles)}
                  </li>
                ))}
              </ol>
            ) : (
              <ul className="kz-arch-text-list">
                {relations.map((e) => (
                  <li key={e.id}>{relationText(e, titles)}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </details>
    </figure>
  );
}
