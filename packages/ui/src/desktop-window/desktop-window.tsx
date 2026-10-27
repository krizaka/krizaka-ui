// Client (the panes' sizes, the pointer, the shortcuts). The window of a Mac app (Tauri 2 on the system WebView, ADR-002):
// a sidebar, the content and an inspector in a three-pane split — resizable by pointer and keyboard, collapsible — under a
// toolbar that moves the window and clears the traffic lights, at the desktop's density with a native-feeling focus ring.
// The commands (`desktopMenus`) are written once for the native menu bar, the page's shortcuts and the palette.
import { type ShortcutMap, useShortcuts } from "@krizaka/ui/app-shell";
import * as React from "react";
import { tv } from "tailwind-variants";

import { type DesktopCommand, type DesktopMenus, desktopMenus } from "./commands";
import { clamp, dragged, keyed, paneMax } from "./panes";

export const desktopWindow = tv({
  slots: {
    root:
      "kz-desktop-window flex h-[var(--kz-window-height,100dvh)] min-w-0 select-none overflow-hidden bg-surface-0 text-[13px] text-fg " +
      // The macOS focus ring: a 3 px halo of the accent, over a 1 px accent edge, only for the keyboard.
      "[&_:focus-visible]:outline-hidden [&_:focus-visible]:ring-[3px]! [&_:focus-visible]:ring-ring/50! [&_:focus-visible]:ring-offset-0!",
    pane: "relative flex min-h-0 shrink-0 flex-col overflow-hidden data-[collapsed]:hidden",
    sidebar: "border-e border-border-subtle bg-surface-1",
    titlebar: "h-[var(--kz-titlebar-inset,1.75rem)] shrink-0",
    scroll: "min-h-0 flex-1 overflow-y-auto",
    middle: "flex min-h-0 min-w-0 flex-1 flex-col",
    inspector: "border-s border-border-subtle bg-surface-1",
    separator:
      "group/sep relative z-10 -mx-[3px] w-[6px] shrink-0 cursor-col-resize touch-none data-[collapsed]:hidden " +
      "after:absolute after:inset-y-0 after:left-[2px] after:w-px after:bg-transparent hover:after:bg-border-strong data-[active]:after:bg-accent focus-visible:after:bg-accent",
    content: "min-h-0 min-w-0 flex-1 overflow-y-auto select-text",
    toolbar:
      "flex h-[var(--kz-toolbar-height,3rem)] shrink-0 items-center gap-2 border-b border-border-subtle bg-surface-0 px-3 " +
      // With the sidebar folded the traffic lights sit over the toolbar: its first control starts after them.
      "[[data-sidebar=closed]_&]:ps-[var(--kz-traffic-lights-inset,4.75rem)]",
    toolbarTitle: "min-w-0 flex-1 truncate text-[13px] font-semibold",
    toolbarGroup: "flex shrink-0 items-center gap-1",
    toggle:
      "inline-flex h-7 w-7 items-center justify-center rounded-md text-fg-secondary transition-colors hover:bg-surface-2 hover:text-fg cursor-default aria-pressed:text-fg-accent",
  },
});
const s = desktopWindow();

export interface DesktopWindowLabels {
  /** The sidebar's accessible name (`Library`). */
  sidebar: string;
  /** The inspector's accessible name (`Details`). */
  inspector: string;
  /** The separators' names (`Resize the sidebar`, `Resize the inspector`). */
  resizeSidebar: string;
  resizeInspector: string;
  /** The toolbar buttons that fold the panes (`Show or hide the sidebar`). */
  toggleSidebar: string;
  toggleInspector: string;
}

export interface DesktopWindowProps {
  /** The sidebar's content: a list of places, a `Tree`. It scrolls by itself. */
  sidebar: React.ReactNode;
  /** The main content under the toolbar. */
  children: React.ReactNode;
  /** The inspector's content: the selected item's details. Without it, a two-pane window. */
  inspector?: React.ReactNode;
  /** The toolbar's title, centred in the drag region. */
  title?: React.ReactNode;
  /** After the sidebar's toggle, at the start of the toolbar (back, forward). */
  toolbarStart?: React.ReactNode;
  /** Before the inspector's toggle, at the end of the toolbar (actions, search). */
  toolbarEnd?: React.ReactNode;
  /** The words of the panes, the dividers and the toggles — passed translated. */
  labels: DesktopWindowLabels;
  /** The sidebar is open (controlled). Pair with `onSidebarOpenChange`: the menu bar's command toggles it too. */
  sidebarOpen?: boolean;
  /** The sidebar starts open (default true) when uncontrolled. */
  defaultSidebarOpen?: boolean;
  /** Called when the sidebar folds or unfolds (the toolbar, a divider, the shortcut). */
  onSidebarOpenChange?: (open: boolean) => void;
  /** The inspector is open (controlled). */
  inspectorOpen?: boolean;
  /** The inspector starts open (default true) when uncontrolled. */
  defaultInspectorOpen?: boolean;
  /** Called when the inspector folds or unfolds. */
  onInspectorOpenChange?: (open: boolean) => void;
  /** The sizes in px: the sidebar's, the inspector's. Persist them with `onSizesChange`. */
  defaultSizes?: { sidebar?: number; inspector?: number };
  /** Called with the sizes in px after a drag or a key: persist them. */
  onSizesChange?: (sizes: { sidebar: number; inspector: number }) => void;
  /** The least the content keeps when the window is narrow (default 360). */
  contentMin?: number;
  /** The keys that fold the panes (a chord, or `false` for none): ⌘B and ⌘I by default. Pass `false` when the menu bar's commands (`useDesktopCommands`) own them. */
  shortcuts?: { sidebar?: string | false; inspector?: string | false };
  /** Classes for the window (`[--kz-window-height:34rem]` to size it inside a page). */
  className?: string;
}

const SIDEBAR: { min: number; max: number } = { min: 180, max: 360 };
const INSPECTOR: { min: number; max: number } = { min: 240, max: 480 };

const glyph = (d: string) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

function useOpen(controlled: boolean | undefined, initial: boolean, onChange?: (open: boolean) => void) {
  const [own, setOwn] = React.useState(initial);
  const open = controlled ?? own;
  const set = React.useCallback(
    (next: boolean) => {
      if (controlled === undefined) setOwn(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [open, set] as const;
}

type Edge = "sidebar" | "inspector";

/** The window of a Mac app: sidebar · content · inspector, a toolbar that moves the window, the desktop's density. */
export function DesktopWindow({
  sidebar, children, inspector, title, toolbarStart, toolbarEnd, labels, sidebarOpen, defaultSidebarOpen = true, onSidebarOpenChange, inspectorOpen, defaultInspectorOpen = true, onInspectorOpenChange, defaultSizes, onSizesChange, contentMin = 360, shortcuts, className,
}: DesktopWindowProps) {
  const [sideOpen, setSideOpen] = useOpen(sidebarOpen, defaultSidebarOpen, onSidebarOpenChange);
  const [inspOpen, setInspOpen] = useOpen(inspectorOpen, defaultInspectorOpen, onInspectorOpenChange);
  const [sizes, setSizes] = React.useState({ sidebar: clamp(defaultSizes?.sidebar ?? 240, SIDEBAR.min, SIDEBAR.max), inspector: clamp(defaultSizes?.inspector ?? 300, INSPECTOR.min, INSPECTOR.max) });
  const [active, setActive] = React.useState<Edge | null>(null);
  const root = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  const toggles = React.useRef<Record<Edge, HTMLButtonElement | null>>({ sidebar: null, inspector: null });
  const sidebarId = React.useId();
  const inspectorId = React.useId();
  const hasInspector = inspector != null;
  const sideShown = sideOpen;
  const inspShown = hasInspector && inspOpen;

  const keys = { sidebar: shortcuts?.sidebar === undefined ? "mod+b" : shortcuts.sidebar, inspector: shortcuts?.inspector === undefined ? "mod+i" : shortcuts.inspector };
  const map: Record<string, () => void> = {};
  if (keys.sidebar) map[keys.sidebar] = () => setSideOpen(!sideOpen);
  if (keys.inspector && hasInspector) map[keys.inspector] = () => setInspOpen(!inspOpen);
  useShortcuts(map as ShortcutMap);

  const commit = (edge: Edge, size: number) => {
    const next = { ...sizes, [edge]: size };
    setSizes(next);
    onSizesChange?.(next);
  };
  // The window's width, to keep the content its room: measured, and followed while the window is resized.
  React.useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const measure = () => setWidth(element.getBoundingClientRect().width);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const ceiling = (edge: Edge) => {
    const other = edge === "sidebar" ? (inspShown ? sizes.inspector : 0) : sideShown ? sizes.sidebar : 0;
    const limits = edge === "sidebar" ? SIDEBAR : INSPECTOR;
    // The separators overlap the panes (negative margins): they take no width of their own.
    return paneMax(limits, width || Number.POSITIVE_INFINITY, other, contentMin, 0);
  };
  const direction = (): 1 | -1 => (root.current && getComputedStyle(root.current).direction === "rtl" ? -1 : 1);
  const sideOf = (edge: Edge): 1 | -1 => (edge === "sidebar" ? 1 : -1);
  const limitsOf = (edge: Edge) => (edge === "sidebar" ? SIDEBAR : INSPECTOR);

  const onPointerDown = (edge: Edge) => (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const startX = event.clientX;
    const start = sizes[edge];
    const max = ceiling(edge);
    const dir = direction();
    setActive(edge);
    const target = event.currentTarget;
    const move = (e: PointerEvent) => commit(edge, dragged(start, e.clientX - startX, dir, sideOf(edge), limitsOf(edge), max));
    const stop = () => {
      setActive(null);
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerup", stop);
      target.removeEventListener("pointercancel", stop);
    };
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", stop);
    target.addEventListener("pointercancel", stop);
  };
  const onKeyDown = (edge: Edge) => (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      (edge === "sidebar" ? setSideOpen : setInspOpen)(false);
      // The separator goes with the pane: the focus goes to the button that brings it back.
      queueMicrotask(() => toggles.current[edge]?.focus());
      return;
    }
    const next = keyed(event.key, sizes[edge], direction(), sideOf(edge), limitsOf(edge), event.shiftKey, ceiling(edge));
    if (next === null) return;
    event.preventDefault();
    commit(edge, next);
  };

  const separator = (edge: Edge, controls: string, label: string) => (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-controls={controls}
      aria-valuemin={limitsOf(edge).min}
      aria-valuemax={ceiling(edge)}
      aria-valuenow={sizes[edge]}
      tabIndex={0}
      data-edge={edge}
      data-active={active === edge ? "" : undefined}
      className={s.separator()}
      onPointerDown={onPointerDown(edge)}
      onKeyDown={onKeyDown(edge)}
      onDoubleClick={() => (edge === "sidebar" ? setSideOpen(false) : setInspOpen(false))}
    />
  );
  const toggle = (edge: Edge, label: string, pressed: boolean, onClick: () => void, d: string) => (
    <button type="button" ref={(el) => { toggles.current[edge] = el; }} className={s.toggle()} aria-label={label} aria-pressed={pressed} onClick={onClick}>
      {glyph(d)}
    </button>
  );

  return (
    <div ref={root} data-desktop="" data-sidebar={sideShown ? "open" : "closed"} className={s.root({ className })}>
      <aside id={sidebarId} aria-label={labels.sidebar} data-collapsed={sideShown ? undefined : ""} className={s.pane({ className: s.sidebar() })} style={{ width: sizes.sidebar }}>
        <div aria-hidden data-tauri-drag-region="" className={s.titlebar()} />
        <div className={s.scroll()}>{sidebar}</div>
      </aside>
      {sideShown && separator("sidebar", sidebarId, labels.resizeSidebar)}
      <div className={s.middle()}>
        <header data-tauri-drag-region="" className={s.toolbar()}>
          <div className={s.toolbarGroup()}>
            {toggle("sidebar", labels.toggleSidebar, sideShown, () => setSideOpen(!sideOpen), "M4 5h16v14H4zM9 5v14")}
            {toolbarStart}
          </div>
          <div data-tauri-drag-region="" className={s.toolbarTitle()}>
            {title}
          </div>
          <div className={s.toolbarGroup()}>
            {toolbarEnd}
            {hasInspector && toggle("inspector", labels.toggleInspector, inspShown, () => setInspOpen(!inspOpen), "M4 5h16v14H4zM15 5v14")}
          </div>
        </header>
        <main id="content" tabIndex={-1} className={s.content()}>
          {children}
        </main>
      </div>
      {inspShown && separator("inspector", inspectorId, labels.resizeInspector)}
      {hasInspector && (
        <aside id={inspectorId} aria-label={labels.inspector} data-collapsed={inspShown ? undefined : ""} className={s.pane({ className: s.inspector() })} style={{ width: sizes.inspector }}>
          <div className={s.scroll()}>{inspector}</div>
        </aside>
      )}
    </div>
  );
}

/**
 * The window's commands as one source: registers their chords in the page (`useShortcuts`, the browser's too) and returns
 * the native menu bar's data — `menus` and `handlers` for `setNativeMenu(bridge, { labels, menus }, handlers)` of
 * `@krizaka/app-desktop` — so the menu shows the keys the page answers.
 */
export function useDesktopCommands(commands: readonly DesktopCommand[]): DesktopMenus {
  const menus = React.useMemo(() => desktopMenus(commands), [commands]);
  useShortcuts(menus.shortcuts as ShortcutMap);
  return menus;
}
