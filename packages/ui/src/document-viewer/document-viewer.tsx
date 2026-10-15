// Client. A PDF drawn page by page (pdf.js), and passages of it lit where they sit. The app hands over the engine
// (`loadPdfjs={() => import("pdfjs-dist")}` — an optional peer, loaded only on a page that shows a document) and the
// worker's address; it hands over the passages as quotes (`highlights`), and the viewer finds their place from the
// PDF's own text positions (`locateQuote`): one box per line, in fractions of the page, so they follow any zoom.
// `activeId` (controlled) scrolls to a passage and strengthens it; a click on a box calls `onActiveChange`. A passage
// the text layer cannot place is never drawn at a guessed place: the viewer goes to its page when it is known and shows
// the quote in a bar — and tells the app (`onLocate`) so its list can say "page 3" or "not found".
import * as React from "react";
import { tv } from "tailwind-variants";

import { useLatest, usePrefersReducedMotion } from "../media";
import { type Located, locateQuote, type PageText } from "./locate";

export const documentViewer = tv({
  slots: {
    root: "relative flex min-w-0 flex-col gap-3",
    pages: "flex max-h-(--kz-document-viewer-height,70vh) flex-col gap-3 overflow-auto rounded-lg border border-border-default bg-surface-2 p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    page: "relative mx-auto w-full max-w-(--kz-document-viewer-page,56rem) shrink-0 overflow-hidden rounded-sm bg-white shadow-sm",
    canvas: "block h-auto w-full",
    caption: "absolute top-1 left-1 rounded-sm bg-surface-1/90 px-1.5 py-0.5 text-xs text-fg-secondary",
    box: "absolute cursor-pointer rounded-xs border border-warning/70 bg-warning/25 mix-blend-multiply transition-colors data-[active=true]:border-2 data-[active=true]:border-danger data-[active=true]:bg-danger/25 motion-reduce:transition-none",
    bar: "rounded-lg border border-border-default bg-surface-1 px-3 py-2 text-sm text-fg-secondary",
    status: "p-6 text-center text-sm text-fg-secondary",
  },
});

/** The words of the viewer, passed translated. `{page}` and `{total}` are replaced. */
export type DocumentViewerLabels = {
  /** The accessible name of the pages' region. */
  region: string;
  loading: string;
  failed: string;
  /** A page's caption and accessible name: "Page {page} of {total}". */
  page: string;
  /** The bar above the pages when the active passage could only be placed on a page: "Passage on page {page}:". */
  onPage: string;
  /** The bar when the active passage is not in the text layer. */
  notFound: string;
};

export const documentViewerLabels: DocumentViewerLabels = {
  region: "Document pages",
  loading: "Loading the document…",
  failed: "The document could not be displayed.",
  page: "Page {page} of {total}",
  onPage: "Passage on page {page}:",
  notFound: "This passage is not in the document's text layer:",
};

/** A passage to light: its quote (as the text layer reads it), the page if the app knows it, a name for screen readers. */
export type DocumentHighlight = { id: string; quote: string; page?: number; label?: string };

/** What the viewer found for a passage. */
export type { Located };

/** The members of pdf.js the viewer uses (`pdfjs-dist` ≥ 5), typed here so the package does not depend on it. */
export type PdfjsModule = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument(source: { url?: string; data?: Uint8Array }): { promise: Promise<PdfDocument>; destroy?: () => Promise<void> | void };
};
export type PdfDocument = { numPages: number; getPage(n: number): Promise<PdfPage>; destroy?: () => Promise<void> | void };
export type PdfPage = {
  rotate: number;
  view: number[];
  getViewport(options: { scale: number }): { width: number; height: number };
  getTextContent(): Promise<{ items: readonly unknown[] }>;
  render(options: { canvas: HTMLCanvasElement; canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }): { promise: Promise<void>; cancel?: () => void };
  cleanup?: () => void;
};

export type DocumentViewerProps = Omit<React.ComponentProps<"div">, "children" | "onChange"> & {
  /** The PDF: an address (same origin or CORS) or its bytes. */
  src: string | Uint8Array;
  /** Loads pdf.js: `() => import("pdfjs-dist")`. An optional peer, never in a bundle without a document. */
  loadPdfjs: () => Promise<PdfjsModule>;
  /** The address of pdf.js's worker (`new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString()`). */
  workerSrc: string;
  /** The passages to light. */
  highlights?: readonly DocumentHighlight[];
  /** The passage in focus: the viewer scrolls to it. */
  activeId?: string | null;
  /** A box was clicked (the id) or the focus was released (`null`). */
  onActiveChange?: (id: string | null) => void;
  /** Where each passage was found (`null`: nowhere) — once the text layer is read, and again if `highlights` change. */
  onLocate?: (found: Record<string, Located | null>) => void;
  /** Called when the document is open, with its page count. */
  onLoad?: (info: { pages: number }) => void;
  /** The words of the viewer, translated (English by default). */
  labels?: Partial<DocumentViewerLabels>;
};

const fill = (template: string, vars: Record<string, string | number>) => template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));

type Loaded = { doc: PdfDocument; texts: PageText[]; sizes: { width: number; height: number }[] };
type Phase = { state: "loading" } | { state: "error"; key: string } | ({ state: "ready"; key: string } & Loaded);

const isItem = (x: unknown): x is PageText["items"][number] => typeof x === "object" && x !== null && typeof (x as { str?: unknown }).str === "string" && Array.isArray((x as { transform?: unknown }).transform);

function PageCanvas({ page, doc, caption, onReady, className }: { page: number; doc: PdfDocument; caption: string; onReady?: () => void; className: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const wrapper = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(() => typeof IntersectionObserver === "undefined");
  const ready = useLatest(onReady);
  React.useEffect(() => {
    const node = wrapper.current?.parentElement;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setVisible(true), { rootMargin: "600px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  React.useEffect(() => {
    if (!visible) return;
    let task: { promise: Promise<void>; cancel?: () => void } | undefined;
    let cancelled = false;
    void (async () => {
      const p = await doc.getPage(page);
      const canvas = ref.current;
      const ctx = canvas?.getContext("2d");
      if (cancelled || !canvas || !ctx) return;
      const base = p.getViewport({ scale: 1 });
      const dpr = typeof window === "undefined" ? 1 : Math.min(2, window.devicePixelRatio || 1);
      const scale = Math.min(2.5, Math.max(1, (canvas.parentElement?.clientWidth || base.width) / base.width)) * dpr;
      const viewport = p.getViewport({ scale });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      task = p.render({ canvas, canvasContext: ctx, viewport });
      await task.promise.catch(() => undefined);
      if (!cancelled) ready.current?.();
    })().catch(() => undefined);
    return () => {
      cancelled = true;
      task?.cancel?.();
    };
  }, [visible, doc, page, ready]);
  return (
    <div ref={wrapper} className="contents">
      <canvas ref={ref} aria-hidden="true" className={className} />
      <span className="sr-only">{caption}</span>
    </div>
  );
}

/** A PDF with its passages lit — see the file's header. Client. */
export function DocumentViewer({ src, loadPdfjs, workerSrc, highlights = [], activeId = null, onActiveChange, onLocate, onLoad, labels, className, ...props }: DocumentViewerProps) {
  const words = { ...documentViewerLabels, ...labels };
  const s = documentViewer();
  const reduce = usePrefersReducedMotion();
  const [loaded, setPhase] = React.useState<Phase>({ state: "loading" });
  const callbacks = useLatest({ onLoad, onLocate });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const bytes = typeof src === "string" ? src : src.byteLength + ":" + src[0] + ":" + src[src.length - 1];
  // A result belongs to the document it was read from: another `src` is loading again, with no reset inside the effect.
  const phase: Phase = loaded.state !== "loading" && loaded.key !== bytes ? { state: "loading" } : loaded;

  // Open the document and read every page's text layer (positions only; nothing is sent anywhere).
  React.useEffect(() => {
    let cancelled = false;
    let opened: { destroy?: () => Promise<void> | void } | undefined;
    void (async () => {
      const pdfjs = await loadPdfjs();
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
      const loading = pdfjs.getDocument(typeof src === "string" ? { url: src } : { data: src.slice() });
      opened = loading;
      const doc = await loading.promise;
      const texts: PageText[] = [];
      const sizes: Loaded["sizes"] = [];
      for (let n = 1; n <= doc.numPages; n++) {
        const page = await doc.getPage(n);
        const vp = page.getViewport({ scale: 1 });
        sizes.push({ width: vp.width, height: vp.height });
        const content = await page.getTextContent();
        // A rotated page has no reliable boxes: it keeps its size and an empty text layer (the app's page hint still works).
        texts.push({ page: n, width: vp.width, height: vp.height, items: page.rotate % 360 === 0 ? content.items.filter(isItem) : [] });
        page.cleanup?.();
      }
      if (cancelled) return;
      setPhase({ state: "ready", key: bytes, doc, texts, sizes });
      callbacks.current.onLoad?.({ pages: doc.numPages });
    })().catch(() => !cancelled && setPhase({ state: "error", key: bytes }));
    return () => {
      cancelled = true;
      void opened?.destroy?.();
    };
    // `src` is compared by content (`bytes`) so a re-render with the same bytes does not reopen the file.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bytes, loadPdfjs, workerSrc, callbacks]);

  const key = highlights.map((h) => `${h.id}\u0000${h.page ?? ""}\u0000${h.quote}`).join("\u0001");
  const found = React.useMemo(() => {
    const out: Record<string, Located | null> = {};
    if (phase.state === "ready") for (const h of highlights) out[h.id] = locateQuote(phase.texts, h.quote, h.page);
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, key]);
  React.useEffect(() => {
    if (phase.state === "ready") callbacks.current.onLocate?.(found);
  }, [found, phase.state, callbacks]);

  // Go to the active passage.
  const active = activeId ? highlights.find((h) => h.id === activeId) : undefined;
  const where = activeId ? found[activeId] : undefined;
  React.useEffect(() => {
    if (phase.state !== "ready" || !where) return;
    const root = containerRef.current;
    const target = root?.querySelector<HTMLElement>(where.boxes.length > 0 ? `[data-highlight="${CSS.escape(activeId!)}"]` : `[data-page="${where.page}"]`) ?? null;
    target?.scrollIntoView?.({ block: where.boxes.length > 0 ? "center" : "start", behavior: reduce ? "auto" : "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, where, phase.state]);

  return (
    <div className={s.root({ className })} {...props}>
      {active && where !== undefined && where?.match !== "exact" && where?.match !== "start" ? (
        <p className={s.bar()} data-testid="document-viewer-bar">
          {where?.match === "page" ? fill(words.onPage, { page: where.page }) : words.notFound} <q>{active.quote}</q>
        </p>
      ) : null}
      <div ref={containerRef} className={s.pages()} role="region" aria-label={words.region} tabIndex={0}>
        {phase.state === "loading" ? <p className={s.status()}>{words.loading}</p> : null}
        {phase.state === "error" ? <p role="alert" className={s.status()}>{words.failed}</p> : null}
        {phase.state === "ready"
          ? phase.texts.map((t, i) => {
              const size = phase.sizes[i]!;
              const caption = fill(words.page, { page: t.page, total: phase.doc.numPages });
              return (
                <div key={t.page} className={s.page()} data-page={t.page} style={{ aspectRatio: `${size.width} / ${size.height}` }}>
                  <PageCanvas page={t.page} doc={phase.doc} caption={caption} className={s.canvas()} />
                  <span className={s.caption()} aria-hidden="true">{caption}</span>
                  {highlights.flatMap((h) => {
                    const f = found[h.id];
                    if (!f || f.page !== t.page) return [];
                    return f.boxes.map((b, k) => (
                      <div
                        key={`${h.id}:${k}`}
                        aria-hidden="true"
                        data-highlight={h.id}
                        data-active={h.id === activeId}
                        className={s.box()}
                        style={{ left: `${b.x * 100}%`, top: `${b.y * 100}%`, width: `${b.width * 100}%`, height: `${b.height * 100}%` }}
                        onClick={() => onActiveChange?.(h.id === activeId ? null : h.id)}
                      />
                    ));
                  })}
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}
