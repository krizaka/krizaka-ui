import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "Tab bar",
  summary: "The app's main sections at the bottom of the screen: an icon and a word each, a badge for what is new, clear of the home indicator.",
  status: "beta",
  category: "navigation",
  platforms: "native",
  parity: { web: { status: "n/a", reason: "A web app navigates with its sidebar or a site's bar.", use: "app-shell" }, desktop: { status: "n/a", reason: "The Mac app navigates with its sidebar.", use: "app-shell" } },
  whenToUse: ["The root of a mobile app with two to five sections (Home, Auctions, Messages, Me).", "As the `tabBar` of expo-router or React Navigation."],
  whenNotToUse: [
    { when: "To switch between views of one screen.", use: "tabs" },
    { when: "For more than five destinations: a list on a “More” screen." },
  ],
  bestPractices: ["Name each section with one word; the icon is filled when selected.", "Use the badge for what needs attention (unread), never for promotion.", "`onReselect`: scroll the current section to the top."],
  accessibility: {
    keyboard: [],
    notes: ["A `tablist` of `tab`s, each named by its word and its badge in words (`badgeLabel`).", "At least 48 points per item; the safe area below is kept."],
  },
  related: ["tabs", "segmented", "header"],
  native: {
    imports: ["TabBar"],
    differences: [],
    examples: [
      { name: "main-sections", title: "Main sections", description: "Orochia's four sections, three unread messages." },
    ],
  },
} satisfies ComponentMeta;
