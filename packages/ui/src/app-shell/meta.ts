import type { ComponentMeta } from "../meta";

export const meta = {
  title: "App shell",
  summary: "The shell of an application screen: a sidebar of sections that collapses to its icons on a desktop and opens as a drawer on a phone, a sticky header with the screen's title, a search that opens the command palette and its actions, the content — and the keyboard shortcuts a console lives by (⌘B, ⌘K, `g` then a letter).",
  status: "beta",
  category: "layouts",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "On a phone the app shell is a tab bar, a header and a screen.", use: "tab-bar" }, desktop: "desktop" },
  whenToUse: ["Every signed-in screen of a product: a studio, a console, an administration.", "When the app has more than four destinations — fewer fit a NavBar."],
  whenNotToUse: [
    { when: "For a public page of a site.", use: "marketing-layout" },
    { when: "For a mobile app's tabs: React Native has its own tab bar." },
  ],
  bestPractices: ["Five to nine items, grouped by what the user does (`AppShell.Group`), the current one marked with `current`.", "Give every item an icon: it is all that remains when the sidebar collapses (its words become a tooltip).", "Persist the collapse with `collapsed` + `onCollapsedChange`; put the account in the sidebar's `footer`.", "Render your router's links with `AppShell.Item asChild`.", "Give the sections a `shortcut` (`g p`: G then P): it clicks the item, so a router link navigates, and the keys show on hover and focus.", "Put `AppShell.Search` in the header and open your `CommandDialog` from its `onOpen`: ⌘K (Ctrl+K) opens it from anywhere.", "In a desktop app (the Orazaka Mac app, Tauri 2) pass `desktop`: the header and the sidebar's top become the title bar that moves the window, there is no drawer, the density is the desktop's; build the native menu bar from the same shortcuts with `acceleratorOf` (`mod+k` → `CmdOrCtrl+K`)."],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves through the sidebar's items, the collapse button and the header's actions." },
      { keys: "Esc", action: "Closes the drawer on a phone and returns the focus to the menu button." },
      { keys: "⌘B / Ctrl+B", action: "Folds and unfolds the sidebar (`collapseShortcut`, off with `false`)." },
      { keys: "⌘K / Ctrl+K", action: "Opens the command palette from `AppShell.Search`, in a text field too." },
      { keys: "G then a letter", action: "Goes to the section whose `shortcut` it is; plain keys never fire while typing in a field." },
    ],
    notes: ["`skipLabel` on `AppShell.Root` adds the skip link (WCAG 2.4.1): the first tab stop, landing on `AppShell.Main`.", "The sidebar is a `nav` named by `label`; the current item carries `aria-current=\"page\"`.", "On a phone the drawer is a modal dialog (Radix): focus trapped inside, Escape and the overlay close it, the focus returns to the button.", "The header's title is the screen's `h1`; nested layouts use `headingAs=\"h2\"`.", "A combination is announced with `aria-keyshortcuts` (`Control+K`, `Meta+K` on a Mac); a sequence is not a chord, so it is only shown on its keys, never named to assistive technology.", "The platform's keys are known after the first client render (⌘ on a Mac, Ctrl elsewhere): the server and the first render agree.", "With `desktop`, the drag regions are the header, its title and the sidebar's top only — never a control — so every button, link and field keeps its focus and its click; the chrome is not selectable, the content is."],
  },
  related: ["dashboard-layout", "nav-bar", "dialog", "skip-link", "command", "page-header", "action-bar", "data-table", "form"],
  web: {
    imports: ["AppShell", "useShortcuts", "formatShortcut", "acceleratorOf"],
    examples: [
      { name: "console", title: "Console", description: "A finance console: sections with `g` shortcuts, ⌘K that opens the palette, a server-side table that refreshes when a form creates a row.", template: true, purpose: "operate", why: "An operator works all day from the keyboard: jumps between sections, finds a row, creates one and sees the table update." },
      { name: "orochia-studio", title: "Orochia studio", description: "Elena's home in the creator studio: the shell around this week's figures, the payout, the auction and the sales.", template: true, purpose: "operate", why: "A creator moves between the sections of an app and reads this week's figures at home." },
      { name: "admin-console", title: "Administration console", description: "A review queue in a console: sections, counts and a sortable table with bulk actions (cards on a phone).", template: true, purpose: "operate", why: "An administrator works a queue: scans it, sorts it and acts on many rows at once." },
      { name: "basic", title: "The shell alone", description: "Sidebar with a group and a count, header with an action, the content." },
      { name: "desktop", title: "Desktop window", description: "The Orazaka Mac app's window (`desktop`): the title bar moves the window and clears the traffic lights, no drawer, the desktop's density, ⌘1–⌘3 to the sections." },
    ],
  },
} satisfies ComponentMeta;
