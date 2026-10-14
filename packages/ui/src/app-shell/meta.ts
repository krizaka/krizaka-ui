import type { ComponentMeta } from "../meta";

export const meta = {
  title: "App shell",
  summary: "The shell of an application screen: a sidebar of sections that collapses to its icons on a desktop and opens as a drawer on a phone, a sticky header with the screen's title and actions, the content.",
  status: "beta",
  category: "layouts",
  platforms: "web",
  whenToUse: ["Every signed-in screen of a product: a studio, a console, an administration.", "When the app has more than four destinations — fewer fit a NavBar."],
  whenNotToUse: [
    { when: "For a public page of a site.", use: "marketing-layout" },
    { when: "For a mobile app's tabs: React Native has its own tab bar." },
  ],
  bestPractices: ["Five to nine items, grouped by what the user does (`AppShell.Group`), the current one marked with `current`.", "Give every item an icon: it is all that remains when the sidebar collapses (its words become a tooltip).", "Persist the collapse with `collapsed` + `onCollapsedChange`; put the account in the sidebar's `footer`.", "Render your router's links with `AppShell.Item asChild`."],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves through the sidebar's items, the collapse button and the header's actions." },
      { keys: "Esc", action: "Closes the drawer on a phone and returns the focus to the menu button." }
    ],
    notes: ["The sidebar is a `nav` named by `label`; the current item carries `aria-current=\"page\"`.", "On a phone the drawer is a modal dialog (Radix): focus trapped inside, Escape and the overlay close it, the focus returns to the button.", "The header's title is the screen's `h1`; nested layouts use `headingAs=\"h2\"`."],
  },
  related: ["dashboard-layout", "nav-bar", "dialog"],
  web: {
    imports: ["AppShell"],
    examples: [
      { name: "orochia-studio", title: "Orochia studio", description: "Elena's home in the creator studio: the shell around this week's figures, the payout, the auction and the sales.", template: true, purpose: "operate", why: "A creator moves between the sections of an app and reads this week's figures at home." },
      { name: "admin-console", title: "Administration console", description: "A review queue in a console: sections, counts and a sortable table with bulk actions (cards on a phone).", template: true, purpose: "operate", why: "An administrator works a queue: scans it, sorts it and acts on many rows at once." },
      { name: "basic", title: "The shell alone", description: "Sidebar with a group and a count, header with an action, the content." },
    ],
  },
} satisfies ComponentMeta;
