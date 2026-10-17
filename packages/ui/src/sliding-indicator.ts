// The shared sliding indicator (NavBar, Tabs): one element that glides from item to item instead of each item lighting
// up on its own. It writes the target's box as CSS variables on the list (`--kz-ind-x/y/w/h`) and `data-indicator="on"`
// — no re-render, no animation frame: the glide is a CSS transition (none under reduced motion). Before hydration the
// items keep their own active style, so nothing flashes.
import * as React from "react";

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/**
 * `item`: the selector of an item; `active`: of the current one, where the light rests; `prefer`: an item that, when
 * present, holds the light before the current one (the NavBar's open menu); `follow`: the light follows the pointer
 * and the focus — over anything that is not an item (an open menu's panel) it goes back to rest.
 */
export function useSlidingIndicator<T extends HTMLElement>({ item, active, prefer, follow = false }: { item: string; active: string; prefer?: string; follow?: boolean }) {
  const ref = React.useRef<T>(null);
  const place = React.useCallback((target: Element | null) => {
    const list = ref.current;
    if (!list) return;
    if (!(target instanceof HTMLElement) || !list.contains(target)) {
      list.removeAttribute("data-indicator");
      return;
    }
    const a = target.getBoundingClientRect();
    const b = list.getBoundingClientRect();
    list.style.setProperty("--kz-ind-x", `${a.left - b.left + list.scrollLeft}px`);
    list.style.setProperty("--kz-ind-y", `${a.top - b.top + list.scrollTop}px`);
    list.style.setProperty("--kz-ind-w", `${a.width}px`);
    list.style.setProperty("--kz-ind-h", `${a.height}px`);
    list.setAttribute("data-indicator", "on");
  }, []);
  const rest = React.useCallback(
    () => {
      const list = ref.current;
      // An item re-rendered under a resting pointer (a menu closing) keeps the light the pointer gave it.
      const hovered = follow ? list?.querySelector(`${item}:hover`) : null;
      place((prefer ? list?.querySelector(prefer) : null) ?? hovered ?? list?.querySelector(active) ?? null);
    },
    [place, active, prefer, item, follow],
  );
  const follow_ = React.useCallback((target: EventTarget) => {
    const hit = target instanceof Element ? target.closest(item) : null;
    if (hit && ref.current?.contains(hit)) place(hit);
    else rest();
  }, [item, place, rest]);

  useIsoLayoutEffect(() => {
    const list = ref.current;
    if (!list) return;
    rest();
    const resize = new ResizeObserver(rest);
    resize.observe(list);
    const changes = new MutationObserver(rest);
    changes.observe(list, { subtree: true, attributes: true, attributeFilter: ["data-state", "aria-current", "data-active"] });
    return () => {
      resize.disconnect();
      changes.disconnect();
    };
  }, [rest]);

  const handlers = follow
    ? {
        onPointerOver: (e: React.PointerEvent) => follow_(e.target),
        onPointerLeave: rest,
        onFocus: (e: React.FocusEvent) => follow_(e.target),
        onBlur: rest,
      }
    : {};
  return { ref, handlers };
}
