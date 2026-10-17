// Renders a surface from its root: each component through its catalog entry, children by id, bound values from the data
// model. A tree only — a component met twice (a cycle, two parents) or beyond the depth is not drawn — and a child still
// to come (the answer is streaming) is a skeleton. Text is text: React escapes it, nothing is ever parsed as HTML.
import * as React from "react";

import { cn } from "../cn";
import { Skeleton } from "../skeleton";
import { GENUI_LIMITS, type GenUiComponent, type GenUiPropsCheck, isBinding } from "./spec";
import { type GenUiState, type GenUiSurfaceState, readPath, readStream } from "./store";

/** What an entry gets to draw a component. */
export type GenUiRenderContext = {
  /** A child by id: drawn, a skeleton while it has not arrived, nothing when refused. */
  child: (id: unknown) => React.ReactNode;
  /** Children by id, in order. */
  children: (ids: unknown) => React.ReactNode[];
  /** A literal, or the value a binding `{ path }` points at in the data model. */
  resolve: (value: unknown) => unknown;
  /** The words of the surface. */
  labels: GenUiLabels;
  /** The locale numbers and dates are written in. */
  locale: string;
};

/** One component of a catalog: how its properties are checked, how it is drawn. */
export type GenUiEntry = {
  /** `null` when the component's own properties are fine, else why not (the message is refused). */
  readonly check: GenUiPropsCheck;
  /** Draws the component. */
  readonly render: (component: GenUiComponent, context: GenUiRenderContext) => React.ReactNode;
};

/** The components a model may use, by name: `baseGenUiCatalog`, merged with `chartsGenUiCatalog` of @krizaka/charts. */
export type GenUiCatalog = Readonly<Record<string, GenUiEntry>>;

/** The surface's own words (passed translated). */
export type GenUiLabels = {
  /** Announced while the surface is still arriving. */
  loading: string;
  /** The accessible name of the surface. */
  surface: string;
  /** Under a table whose data has not arrived or is not a list. */
  noData: string;
};

export const genUiLabels: GenUiLabels = { loading: "Building the view…", surface: "Generated view", noData: "No data" };

export type GenUiSurfaceProps = {
  /** The surface to draw (from `readStream` or `applyMessage`). */
  surface: GenUiSurfaceState;
  /** The components it may use. */
  catalog: GenUiCatalog;
  /** The answer is still arriving: missing children are skeletons and the surface is busy. */
  streaming?: boolean;
  /** The surface's words. */
  labels?: Partial<GenUiLabels>;
  /** The locale numbers are written in. Default `en`. */
  locale?: string;
  /** Called with what could not be drawn (a cycle, a missing child once the answer is complete). */
  onError?: (error: string) => void;
  /** Extra classes on the frame. */
  className?: string;
};

/** One surface, drawn from its root. */
export function GenUiSurface({ surface, catalog, streaming = false, labels, locale = "en", onError, className }: GenUiSurfaceProps) {
  const words = { ...genUiLabels, ...labels };
  const problems: string[] = [];
  const seen = new Set<string>();

  const draw = (id: unknown, depth: number): React.ReactNode => {
    if (typeof id !== "string") return null;
    if (depth > GENUI_LIMITS.depth) {
      problems.push(`"${id}" is deeper than ${GENUI_LIMITS.depth}`);
      return null;
    }
    if (seen.has(id)) {
      problems.push(`"${id}" is drawn twice (a cycle or two parents)`);
      return null;
    }
    const component = surface.components.get(id);
    if (!component) {
      if (!streaming) problems.push(`"${id}" never arrived`);
      return streaming ? <Skeleton key={id} className="h-10 w-full rounded-lg" /> : null;
    }
    const entry = Object.hasOwn(catalog, component.component) ? catalog[component.component] : undefined;
    if (!entry) return null;
    seen.add(id);
    const context: GenUiRenderContext = {
      child: (c) => draw(c, depth + 1),
      children: (ids) => (Array.isArray(ids) ? ids.map((c) => <React.Fragment key={String(c)}>{draw(c, depth + 1)}</React.Fragment>) : []),
      resolve: (value) => (isBinding(value) ? readPath(surface.data, value.path) : value),
      labels: words,
      locale,
    };
    return <React.Fragment key={id}>{entry.render(component, context)}</React.Fragment>;
  };

  const root = draw("root", 0);
  React.useEffect(() => {
    if (onError) for (const problem of problems) onError(problem);
    // Reported once per drawn state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surface, streaming]);

  return (
    <section aria-label={words.surface} aria-busy={streaming || undefined} data-genui-surface={surface.id} className={cn("flex flex-col gap-4", className)}>
      {root ?? (streaming ? <Skeleton className="h-24 w-full rounded-xl" /> : null)}
    </section>
  );
}

export type GenUiStreamProps = Omit<GenUiSurfaceProps, "surface"> & {
  /** A model's answer, complete or still arriving: its prose and its `a2ui` fence. */
  text: string;
  /** Draws the prose (markdown in a chat); default: paragraphs of text. */
  renderProse?: (prose: string) => React.ReactNode;
  /** What to show when the answer holds no valid surface: the answer itself, as text (the fallback). */
  fallback?: (text: string) => React.ReactNode;
};

/**
 * A model's answer with its generated view: the prose, then every surface of its `a2ui` fence, growing as the answer
 * streams. An answer without a valid surface falls back to its text.
 */
export function GenUiStream({ text, catalog, streaming, renderProse, fallback, onError, ...rest }: GenUiStreamProps) {
  const state = React.useMemo(() => readStream(text, catalog), [text, catalog]);
  const reported = React.useRef(0);
  React.useEffect(() => {
    if (!onError) return;
    for (const error of state.errors.slice(reported.current)) onError(error);
    reported.current = state.errors.length;
  }, [state, onError]);
  const prose = (value: string) => (renderProse ? renderProse(value) : value.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>));
  const surfaces = state.order.map((id) => state.surfaces.get(id)).filter((s): s is GenUiSurfaceState => !!s && s.components.has("root"));
  if (!state.found || (!streaming && surfaces.length === 0)) return <>{fallback ? fallback(text) : prose(text)}</>;
  return (
    <div className="flex flex-col gap-4" data-genui-stream="">
      {state.prose && prose(state.prose)}
      {surfaces.map((surface) => (
        <GenUiSurface key={surface.id} surface={surface} catalog={catalog} streaming={streaming} onError={onError} {...rest} />
      ))}
      {streaming && surfaces.length === 0 && <Skeleton className="h-24 w-full rounded-xl" />}
    </div>
  );
}

/** The state a list of messages builds — for a surface the app holds itself (not from a model's text). */
export type { GenUiState };
