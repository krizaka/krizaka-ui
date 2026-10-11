import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "Pull to refresh",
  summary: "The platform's pull to refresh in the theme's accent, for any ScrollView or FlatList.",
  status: "beta",
  category: "feedback",
  platforms: "native",
  whenToUse: ["A ScrollView or a FlatList the app draws itself: a feed, a profile."],
  whenNotToUse: [
    { when: "In a `List`: its `onRefresh` draws it already.", use: "list" },
  ],
  bestPractices: ["Keep `refreshing` true until the new data is there.", "Do not refresh on every focus: a pull is the person's choice."],
  accessibility: {
    keyboard: [],
    notes: ["The platform's control: announced by the system while it refreshes.", "Offer a refresh button too where pulling is hard (a short screen)."],
  },
  related: ["list", "loader"],
  native: {
    imports: ["PullToRefresh"],
    differences: [],
    examples: [
      { name: "feed", title: "A feed", description: "The spinner at the top of a ScrollView, in the accent." },
    ],
  },
} satisfies ComponentMeta;
