// Client. The conductor of a told page (story.css): chapters that play their entrance once, in order, when they first
// come into view, and whose one slow loop runs only while they are on screen. One IntersectionObserver for the stage,
// no animation frame, nothing at all under prefers-reduced-motion.
import * as React from "react";

import { cn } from "../cn";
import { brandClass, type StoryVariant, storyVariantClass } from "../story-variant";

export type { StoryVariant };

const SCENE = "[data-kzs-scene]";

type Polymorphic = "div" | "main" | "article" | "section";

export type ScrollStageProps = React.HTMLAttributes<HTMLElement> & {
  /**
   * The element the stage renders.
   * @default "div"
   */
  as?: Polymorphic;
  /**
   * The look of every storytelling component inside (each one can still set its own): `default` or `arcade`.
   * @default "default"
   */
  variant?: StoryVariant;
  /**
   * How much of a scene must be visible before it plays (0–1).
   * @default 0.2
   */
  threshold?: number;
};

/**
 * Plays the scenes (`Scene`, or any `[data-kzs-scene]`) it contains: each one gets `data-in` once, when it first enters
 * the viewport — its parts then arrive in order (the visual, the announcement, the words: `data-kzs-reveal`) — and
 * `data-live` while it is visible, which runs its one loop. Until the stage has switched motion on, and under
 * `prefers-reduced-motion`, everything is visible and still.
 */
export function ScrollStage({ as: Tag = "div", variant, threshold = 0.2, className, children, ...props }: ScrollStageProps) {
  const ref = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.setAttribute("data-in", "");
            el.setAttribute("data-live", "");
          } else el.removeAttribute("data-live");
        }
      },
      { threshold },
    );
    const watch = (scope: ParentNode) => scope.querySelectorAll(SCENE).forEach((el) => io.observe(el));
    if (root.matches(SCENE)) io.observe(root);
    watch(root);
    const mo = new MutationObserver((records) => {
      for (const record of records)
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(SCENE)) io.observe(node);
          watch(node);
        });
    });
    mo.observe(root, { childList: true, subtree: true });
    root.setAttribute("data-kzs-stage", "on");
    return () => {
      io.disconnect();
      mo.disconnect();
      root.removeAttribute("data-kzs-stage");
    };
  }, [threshold]);
  return React.createElement(Tag, { ref, className: cn(storyVariantClass(variant), className), ...props }, children);
}

export type SceneProps = React.HTMLAttributes<HTMLElement> & {
  /**
   * The element the scene renders.
   * @default "section"
   */
  as?: Polymorphic | "header" | "footer" | "li";
  /** A brand scope for the scene (`orochia` → `.brand-orochia`): its accent and gradient become that brand's. */
  brand?: string;
};

/** A chapter of a `ScrollStage`: played once when it enters the viewport, its loop running while it is visible. */
export function Scene({ as: Tag = "section", brand, className, children, ...props }: SceneProps) {
  return React.createElement(Tag, { "data-kzs-scene": "", className: cn(brandClass(brand), className) || undefined, ...props }, children);
}
