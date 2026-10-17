/** @krizaka/ui/app-shell — `AppShell.Root/Sidebar/Group/Item/Body/Header/Search/Main`: an application screen (sidebar that collapses, header with a search for the command palette, drawer on a phone, keyboard shortcuts), and `useShortcuts`. Client. */
export {
  AppShell,
  appShell,
  AppShellBody,
  AppShellGroup,
  type AppShellGroupProps,
  AppShellHeader,
  type AppShellHeaderProps,
  AppShellItem,
  type AppShellItemProps,
  AppShellMain,
  AppShellRoot,
  type AppShellRootProps,
  AppShellSearch,
  type AppShellSearchProps,
  AppShellSidebar,
  type AppShellSidebarProps,
} from "./app-shell";
export { acceleratorOf, ariaKeyShortcuts, formatShortcut, matchesCombo, parseCombo, type ShortcutMap, useApple, useShortcuts } from "./shortcuts";
