// The preview bridge (ADR-007 §5): the composer shows the product's real public page in an iframe of its own route
// (`?draft=<id>`) and talks to it by `postMessage` — three messages only, every one origin-checked on both sides: `select` (outline
// a section), `scroll` (bring it into view), `refresh` (the draft changed: reload the data). Nothing else crosses: no document, no
// script, no style. Both halves are here, tiny and free of React, because the page side must not import the composer.

/** The only messages: the composer to the page. */
export type PreviewMessage = { source: "krizaka-shop-composer"; type: "select" | "scroll"; key: string } | { source: "krizaka-shop-composer"; type: "refresh" };

const SOURCE = "krizaka-shop-composer";
const KEY = /^[A-Za-z0-9_-]{1,40}$/;

/** Reads a message event: only if it comes from `origin`, is one of the three messages and carries a well-formed key. */
export function readPreviewMessage(event: Pick<MessageEvent, "origin" | "data">, origin: string): PreviewMessage | null {
  if (event.origin !== origin) return null;
  const d = event.data as Record<string, unknown> | null;
  if (typeof d !== "object" || d === null || d.source !== SOURCE) return null;
  if (d.type === "refresh") return { source: SOURCE, type: "refresh" };
  if ((d.type === "select" || d.type === "scroll") && typeof d.key === "string" && KEY.test(d.key)) return { source: SOURCE, type: d.type, key: d.key };
  return null;
}

/** The composer's side: posts to the preview's window, addressed to its origin only. */
export function postToPreview(target: Pick<Window, "postMessage"> | null | undefined, origin: string, message: PreviewMessage): void {
  target?.postMessage(message, origin);
}

/** The attribute that names a section in the preview page: `<div data-shop-key="s_8f2c">` (a block: the outline is its ring). */
export const SHOP_KEY_ATTRIBUTE = "data-shop-key";

/**
 * The page's side: outlines the selected section (`data-shop-selected`, drawn by `blocks.css`), scrolls it into view, and calls
 * `onRefresh` when the draft changed. Returns the function that removes it. Only runs in an iframe of the composer's origin.
 */
export function connectShopPreview({ composerOrigin, onRefresh, root = document }: { composerOrigin: string; onRefresh?: () => void; root?: Document }): () => void {
  const find = (key: string) => root.querySelector<HTMLElement>(`[${SHOP_KEY_ATTRIBUTE}="${key}"]`);
  const handler = (event: MessageEvent) => {
    // The origin first, before anything else is read from the message.
    if (event.origin !== composerOrigin) return;
    const m = readPreviewMessage(event, composerOrigin);
    if (!m) return;
    if (m.type === "refresh") {
      onRefresh?.();
      return;
    }
    for (const selected of root.querySelectorAll<HTMLElement>("[data-shop-selected]")) delete selected.dataset.shopSelected;
    const el = find(m.key);
    if (!el) return;
    el.dataset.shopSelected = "";
    if (m.type === "scroll") {
      const reduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
    }
  };
  window.addEventListener("message", handler);
  return () => window.removeEventListener("message", handler);
}
