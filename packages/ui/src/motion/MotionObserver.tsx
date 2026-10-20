import { useEffect } from "react";

/** What gets `data-offscreen` while out of view: its animations pause (motion.css). */
const SCOPES = ".kz-backdrop, .kz-iso, [data-motion-scope], main > section, main > header, footer";
const REVEAL = "[data-reveal]:not(.kz-in)";
/** How long after `load` the first screen's loops wait before they start (LCP first). */
const SETTLE_MS = 1200;

export interface MotionObserverProps {
  /**
   * Hold the loops of the page (`.kz-loop`, the backdrop's drift) still until the page has loaded and settled
   * (`html[data-motion="settling"]` → `"ready"`, about 1.2 s after `load`): nothing repaints the first screen while it
   * paints.
   * @default true
   */
  settle?: boolean;
  /**
   * Pause every animation of a scope while it is off screen (`data-offscreen` on `.kz-backdrop`, `.kz-iso`,
   * `[data-motion-scope]` and the page's sections).
   * @default true
   */
  pauseOffscreen?: boolean;
}

/**
 * The Krizaka motion conductor. Mount it once at the root of the app; it renders nothing and keeps no animation frame
 * running. It reveals every `[data-reveal]` element once as it enters the viewport (including elements added later:
 * client navigation needs nothing more), pauses what is off screen, lets the first screen settle before its loops
 * start. Nothing follows the pointer (krizaka-ui#393: the spotlight and the magnetic buttons are retired). Under
 * prefers-reduced-motion everything is revealed at once.
 */
export function MotionObserver({ settle = true, pauseOffscreen = true }: MotionObserverProps = {}): null {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    const ready = () => (settleTimer = setTimeout(() => root.setAttribute("data-motion", "ready"), SETTLE_MS));
    if (settle && !reduce && root.getAttribute("data-motion") !== "ready") {
      root.setAttribute("data-motion", "settling");
      if (document.readyState === "complete") ready();
      else window.addEventListener("load", ready, { once: true });
    } else root.setAttribute("data-motion", "ready");

    const revealIo = reduce
      ? null
      : new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              entry.target.classList.add("kz-in");
              revealIo!.unobserve(entry.target);
            }
          },
          { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
        );
    const scopeIo = pauseOffscreen
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) entry.target.toggleAttribute("data-offscreen", !entry.isIntersecting);
          },
          { rootMargin: "120px 0px" },
        )
      : null;

    const reveal = (el: Element) => (revealIo ? revealIo.observe(el) : el.classList.add("kz-in"));
    const watch = (scope: ParentNode) => {
      scope.querySelectorAll(REVEAL).forEach(reveal);
      if (scopeIo) scope.querySelectorAll(SCOPES).forEach((el) => scopeIo.observe(el));
    };
    watch(document);
    const mo = new MutationObserver((records) => {
      for (const record of records)
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(REVEAL)) reveal(node);
          if (scopeIo && node.matches(SCOPES)) scopeIo.observe(node);
          watch(node);
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(settleTimer);
      window.removeEventListener("load", ready);
      revealIo?.disconnect();
      scopeIo?.disconnect();
      mo.disconnect();
    };
  }, [settle, pauseOffscreen]);

  return null;
}
