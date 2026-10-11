// The shared sliding indicator (NavBar, Tabs): one element that glides from item to item instead of each item lighting
// up on its own. It writes the target's box as CSS variables on the list (`--kz-ind-x/y/w/h`) and `data-indicator="on"`
// — no re-render, no animation frame: the glide is a CSS transition (none under reduced motion). Before hydration the
// items keep their own active style, so nothing flashes.
import * as React from "react";

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export function useSlidingIndicator<T extends HTMLElement>({ item, active, follow = false }: { item: string; active: string; follow?: boolean }) {
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
  const rest = React.useCallback(() => place(ref.current?.querySelector(active) ?? null), [place, active]);

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
        onPointerOver: (e: React.PointerEvent) => place((e.target as Element).closest(item)),
        onPointerLeave: rest,
        onFocus: (e: React.FocusEvent) => place((e.target as Element).closest(item)),
        onBlur: rest,
      }
    : {};
  return { ref, handlers };
}
