// Client. The light that follows the pointer over the cards of a group (blocks.css `.kz-block-card::after`): one passive
// pointermove listener on the group writes the pointer's position into the card it is over (`--kz-pointer-x/y`); the
// card's CSS draws the light. Nothing runs on a touch screen or under reduced motion, nothing loops.
import * as React from "react";

/** Every card of the page blocks carries it: LinkCard, ArgumentCard. */
export const POINTER_LIGHT_TARGET = "[data-kz-light]";

/** Lights the cards inside `ref` that match `target`. Returns nothing; the effect cleans itself up. */
export function usePointerLight(ref: React.RefObject<HTMLElement | null>, target: string = POINTER_LIGHT_TARGET) {
  React.useEffect(() => {
    const group = ref.current;
    if (!group || typeof window.matchMedia !== "function" || !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest<HTMLElement>(target);
      if (!card || !group.contains(card)) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty("--kz-pointer-x", `${Math.round(e.clientX - box.left)}px`);
      card.style.setProperty("--kz-pointer-y", `${Math.round(e.clientY - box.top)}px`);
    };
    group.addEventListener("pointermove", onMove, { passive: true });
    return () => group.removeEventListener("pointermove", onMove);
  }, [ref, target]);
}

export type PointerLightProps = {
  /**
   * The cards to light, as a selector inside the parent element.
   * @default "[data-kz-light]"
   */
  target?: string;
};

/**
 * Drop it inside any group of cards (a grid, a list) — it listens on its parent element. Renders an empty, hidden span.
 * CardGrid includes it already.
 */
export function PointerLight({ target = POINTER_LIGHT_TARGET }: PointerLightProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const parent = React.useRef<HTMLElement | null>(null);
  React.useLayoutEffect(() => {
    parent.current = ref.current?.parentElement ?? null;
  }, []);
  usePointerLight(parent, target);
  return <span ref={ref} hidden />;
}
