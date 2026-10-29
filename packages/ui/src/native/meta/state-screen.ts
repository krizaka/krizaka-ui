import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "State screen",
  summary: "What a screen says when it has nothing to show, when it failed, or when the network is gone: an icon, a title in plain words, the reason and the way out — announced as it should be. With the slim offline banner for a screen that still shows saved data.",
  status: "experimental",
  adoption: "akinaza#278",
  category: "feedback",
  domain: "feedback",
  platforms: "native",
  parity: { web: { status: "n/a", reason: "On the web these are the empty state and the error page.", use: "empty-state" }, desktop: { status: "n/a", reason: "The Mac app's window is the web: its states are the empty state and the error page.", use: "empty-state" } },
  whenToUse: ["A list or a screen with nothing in it yet.", "A request that failed and can be retried.", "The network is gone: the banner when saved data shows, the full state when nothing does."],
  whenNotToUse: [
    { when: "A small empty region inside a card.", use: "empty-state" },
    { when: "The app is in maintenance or must be updated.", use: "maintenance-screen" },
  ],
  bestPractices: [
    "Say what happened in a few words and what to do: « We could not load your files » and « Try again », never « Error 500 ».",
    "One main way out (`action`), a quieter second (`secondary`). An empty state's way out is how to fill it.",
    "`inline` puts the state in the flow of a list; by default it fills its parent and centres.",
    "The app detects the network (NetInfo) and passes the state: this component never reaches for the network itself.",
  ],
  accessibility: {
    keyboard: [],
    notes: ["An error is announced as an alert, an offline state as a status; an empty state is just a heading and a button.", "The icon is decorative; the title is the heading."],
  },
  related: ["empty-state", "screen", "maintenance-screen", "toast"],
  native: {
    imports: ["StateScreen", "OfflineBanner"],
    differences: [],
    examples: [
      { name: "empty", title: "Empty", description: "Nothing yet, and the one way to fill it.", template: true, purpose: "recover", why: "A person who finds nothing is told why and how to start, not left on a blank screen." },
      { name: "error", title: "Error", description: "What failed in plain words, Try again, and a quieter way to get help.", template: true, purpose: "recover", why: "A person whose request failed knows nothing was lost and can retry in one tap." },
      { name: "offline", title: "Offline", description: "The slim banner over the saved data, and the full state when there is none.", template: true, purpose: "recover", why: "A person with no network still sees what was saved and knows what is stale." },
    ],
  },
} satisfies ComponentMeta;
