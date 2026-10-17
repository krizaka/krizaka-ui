# ADR-002 — Desktop is the web in a window: one design system on three platforms

- **Status:** accepted — 2026-10-16
- **Scope:** `@krizaka/ui` (and `@krizaka/charts`): what "desktop" means for a component, and the Orazaka Mac app
  (`krizaka/orazaka`, `apps/desktop`, Delivery 12 — krizaka/orazaka#87)
- **Enforced by:** the `parity` of every meta (`tools/parity.mjs`, run by both registry tests) and the matrix of
  ui.krizaka.com/platforms

## Context

Krizaka UI is one design system on **three platforms**: the web (`@krizaka/ui/<name>`), mobile (`@krizaka/ui/native`,
React Native and Expo) and desktop. The only desktop client is the Orazaka Mac app, decided on 2026-10-14
(`docs/DELIVERY.md` of krizaka/orazaka): **Tauri 2** — the system WebView (WKWebView on macOS), a ~10 MB Rust binary
that drives the `orazaka` CLI as a sidecar — chosen over Electron (a 150 MB Chromium per app) and over a native
SwiftUI app (a third UI to write and keep in step with the web and the phone). The app does not exist yet; it is
built by the ORA-DESKTOP session once the Apple Developer ID is active.

The parity decision says, for every component, whether it is on the web, on a phone, on the desktop — and why not. It
needed a definition of "desktop" that is true of the code, not of a wish.

## Decision

**Desktop = the web components, in the Mac app's window.** A Tauri window renders HTML, CSS and React: every web
component of `@krizaka/ui` and `@krizaka/charts` runs there unchanged, on the same tokens, themes and motion. There is
no separate desktop package, no macOS-native widget set, no third implementation.

What a window needs that a browser tab does not is a **desktop form** of a few components, opted into by a prop — never
a fork:

| Need of a desktop window | Where it lives |
| :-- | :-- |
| The title bar: dragging the header moves the window; the traffic lights stay clear | `AppShell.Root desktop` — the header, its title and the sidebar's top carry `data-tauri-drag-region` (never a control); `--kz-titlebar-inset` (28 px) clears the traffic lights of `titleBarStyle: "Overlay"` |
| No drawer: a window has a minimum width | `desktop` keeps the sidebar (it still folds to its icons with ⌘B) |
| Desktop density: 32 px rows, 13 px text, a 48 px header; the chrome not selectable; the content scrolls under a fixed header | `desktop` on `AppShell.Root`; `--kz-window-height` sets the window's height (the viewport by default) |
| The menu bar answers the shell's keys | the app builds its native menu (Tauri `Menu`) from the same shortcuts with `acceleratorOf` (`mod+k` → `CmdOrCtrl+K`); `useShortcuts` answers them inside the page |
| Keyboard shortcuts and a command palette | already in the web: `useShortcuts`, `AppShell.Search` → `CommandDialog` (⌘K), `AppShell.Item shortcut` |
| Focus rings, hover, tooltips, dropdown menus, dialogs, data tables, split views | the web components as they are |

In the parity of a meta, `desktop` is therefore:

- `"web"` — the web component runs in the window as it is (most components);
- `"desktop"` — it also has a desktop form, documented on its page (`app-shell`);
- an absence — `n/a` for what has no place in an app's window (a public site's page blocks and templates, the
  touch-only native components, with `use` naming what answers there) or `gap` with its issue.

A component the Mac app needs and the web lacks is added **to the web** (and so to the desktop), with its desktop form
when the window needs one.

## Refused

- **Electron** — a Chromium per app (150 MB), its own updater and attack surface; the Tauri decision of 2026-10-14 stands.
- **A native macOS UI (SwiftUI/AppKit)** — a third implementation of every component, out of step with the web and the
  phone the day it ships; no other Krizaka product needs it.
- **A `@krizaka/ui/desktop` entry with copies of the web components** — two versions of the same button. A prop on the
  component that needs it is enough.
- **Reading the platform at runtime** (`window.__TAURI__`) inside the components — the app says `desktop`; the component
  stays testable in a browser and in Storybook.

## Costs

- The WebView is the system's: WKWebView's CSS (it lags Chrome a little) is the floor on macOS. The components already
  hold to Safari's (iOS), so nothing new.
- Window-level behaviour (vibrancy, the native menu, the tray, notifications, file dialogs) is the app's, through
  Tauri's APIs — never in a component.
- Right-click context menus, a resizable split (draggable divider) and a native-feeling density beyond the shell are not
  built yet: they are the desktop's gaps, tracked as issues (krizaka/krizaka-ui#286 context menus, #287 a resizable
  split view).

## Signals that we are wrong

- The Mac app needs more than a handful of `desktop` props (the components fight the window): then a desktop entry with
  its own layouts, still on the web components, is worth its cost.
- A second desktop app appears that is not a WebView (a native one): this ADR is reopened.
