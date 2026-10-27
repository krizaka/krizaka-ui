import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Desktop window",
  summary: "The window of a Mac app (Tauri 2 on the system WebView): a sidebar, the content and an inspector in a three-pane split — resizable by pointer and keyboard, collapsible — under a toolbar that moves the window and clears the traffic lights, at the desktop's density with a native-feeling focus ring. Its commands are written once for the menu bar, the page's shortcuts and the palette.",
  status: "beta",
  category: "layouts",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A phone has no windows: its screens are the list and detail, the tabs and the sheets.", use: "list-detail" }, desktop: "desktop" },
  whenToUse: [
    "The main window of a Tauri Mac app with a source list, a main view and the details of the selection (Finder, Mail, Xcode).",
    "A two-pane window: omit `inspector`.",
  ],
  whenNotToUse: [
    { when: "A console with grouped sections and a collapsing sidebar of words.", use: "app-shell" },
    { when: "The signed-in web app in a browser.", use: "app-frame" },
    { when: "A phone or a tablet.", use: "list-detail" },
  ],
  bestPractices: [
    "Use it at a window width of 900 pt or more (Tauri's minimum width): the content keeps 360 pt, and the panes give way to it when the window is narrower.",
    "Write the commands once with `useDesktopCommands`: it registers the chords in the page and returns the `menus` and `handlers` for `setNativeMenu` of `@krizaka/app-desktop`. Then pass `shortcuts={{ sidebar: false, inspector: false }}` to the window so ⌘B and ⌘I are not answered twice.",
    "Keep the sizes: persist `onSizesChange` (a preference of the window) and give them back as `defaultSizes`.",
    "Fold with the controlled `sidebarOpen` / `inspectorOpen`, so the menu's « Hide sidebar » and the toolbar's button are one state.",
    "Put only what moves the window's content in the toolbar (back, search, the main action); never a form.",
    "Controls inside use the desktop's density (32 px rows, 13 px text); do not enlarge them for touch.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab to a divider", action: "Focuses it; it is a separator (WAI-ARIA window splitter) with its size as `aria-valuenow`." },
      { keys: "← →", action: "Resizes the pane by 16 px (64 with Shift); the arrow pointing away from the pane's edge grows it, mirrored in right-to-left." },
      { keys: "Home / End", action: "The smallest or the largest size." },
      { keys: "Enter on a divider", action: "Folds its pane; the focus goes to the toolbar's button that brings it back." },
      { keys: "⌘B / ⌘I", action: "Fold the sidebar and the inspector." },
    ],
    notes: [
      "The panes are `aside` landmarks named by `labels`; the toolbar is the window's `header`, the content its `main`.",
      "The dividers are the only draggable things; the toolbar's drag region is the bar, its title and the gaps — never a control, so every button keeps its click and its focus.",
      "The focus ring is the macOS one (a 3 px halo of the accent) and shows for the keyboard only.",
    ],
  },
  related: ["app-shell", "split-view", "app-frame", "kbd"],
  web: {
    imports: ["DesktopWindow", "useDesktopCommands", "desktopMenus"],
    examples: [
      { name: "library", title: "A library window", description: "A source list, a list of files and the details of the selected one; ⌘B and ⌘I fold the panes, the menu bar gets the same commands.", template: true, purpose: "operate", why: "A person on a Mac works with a list and the details of what they select, with the keys and the menus of a Mac app." },
    ],
  },
} satisfies ComponentMeta;
