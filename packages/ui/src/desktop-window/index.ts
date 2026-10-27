/**
 * @krizaka/ui/desktop-window — `DesktopWindow`: the window of a Mac app (Tauri, ADR-002) as a three-pane split —
 * sidebar · content · inspector, resizable by pointer and keyboard, collapsible — under a toolbar that moves the window and
 * clears the traffic lights, with the desktop's density and a native-feeling focus ring. `desktopMenus` turns the window's
 * commands into the native menu bar's menus (`setNativeMenu` of `@krizaka/app-desktop`), its handlers and the page's
 * shortcuts. Client.
 */
export { type DesktopCommand, type DesktopMenu, type DesktopMenus, desktopMenus } from "./commands";
export { DesktopWindow, desktopWindow, type DesktopWindowLabels, type DesktopWindowProps, useDesktopCommands } from "./desktop-window";
export { clamp, dragged, keyed, type PaneLimits, paneMax } from "./panes";
