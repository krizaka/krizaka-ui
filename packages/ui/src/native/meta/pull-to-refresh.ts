import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "Pull to refresh",
  summary: "The platform's pull to refresh in the theme's accent, for any ScrollView or FlatList — or `BrandedRefresh`, where the product's own mark is drawn as you pull and turns while it refreshes.",
  status: "beta",
  category: "feedback",
  platforms: "native",
  parity: { web: { status: "n/a", reason: "A web page refreshes by reloading or with a button.", use: "button" }, desktop: { status: "n/a", reason: "A desktop window refreshes with Cmd+R or a toolbar button.", use: "button" } },
  whenToUse: ["A ScrollView or a FlatList the app draws itself: a feed, a profile."],
  whenNotToUse: [
    { when: "In a `List`: its `onRefresh` draws it already.", use: "list" },
  ],
  bestPractices: ["`BrandedRefresh` where the product's mark should wait with the person: spread the props it gives on the ScrollView (`{(scroll) => <ScrollView {...scroll} />}`).", "Keep `refreshing` true until the new data is there.", "Do not refresh on every focus: a pull is the person's choice."],
  accessibility: {
    keyboard: [],
    notes: ["The platform's control: announced by the system while it refreshes; `BrandedRefresh` keeps that control (transparent) and adds an announcement of its `label` when the refresh starts.", "On Android the mark appears when the refresh starts (the platform does not report the pull); on iOS it is drawn as you pull.", "Reduced motion: the mark is still and appears without growing.", "Offer a refresh button too where pulling is hard (a short screen)."],
  },
  related: ["list", "loader"],
  native: {
    imports: ["PullToRefresh", "BrandedRefresh"],
    differences: [],
    examples: [
      { name: "feed", title: "A feed", description: "The spinner at the top of a ScrollView, in the accent." },
      { name: "branded", title: "The product's mark", description: "`BrandedRefresh`: Orazaka's mark grows into place as you pull and turns while it refreshes; announced when it starts." },
    ],
  },
} satisfies ComponentMeta;
