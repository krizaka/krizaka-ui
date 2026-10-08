import { useEffect } from "react";

/**
 * Mount once at the root of the app. It reveals every `[data-reveal]` element as it enters the viewport — including
 * elements added later, so client-side navigation needs nothing more — and feeds the pointer position to
 * `.kz-spotlight` cards (`--spot-x`, `--spot-y`). One IntersectionObserver, one MutationObserver, one listener.
 * Under prefers-reduced-motion everything is revealed at once.
 */
export function MotionObserver(): null {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const revealAll = (root: ParentNode) => root.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("kz-in"));
      revealAll(document);
      const mo = new MutationObserver(() => revealAll(document));
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("kz-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    const watch = (root: ParentNode) => root.querySelectorAll("[data-reveal]:not(.kz-in)").forEach((el) => io.observe(el));
    watch(document);
    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n instanceof Element && (n.matches("[data-reveal]") ? io.observe(n) : watch(n)));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.(".kz-spotlight") as HTMLElement | null;
      if (!card) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${e.clientX - box.left}px`);
      card.style.setProperty("--spot-y", `${e.clientY - box.top}px`);
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => document.removeEventListener("pointermove", move);
  }, []);

  return null;
}
