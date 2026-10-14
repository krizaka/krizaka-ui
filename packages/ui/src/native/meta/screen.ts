import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "Screen",
  summary: "A screen of the app — a header, the content (scrolling, rising with the keyboard), a footer — and the templates built on it: app shell, sign-in, profile, feed, chat, settings, a map, notifications.",
  status: "beta",
  category: "layout",
  platforms: "native",
  whenToUse: ["Every screen of a React Native app.", "The starting point of a new app: copy a template and fill it."],
  whenNotToUse: [
    { when: "For a sheet over a screen.", use: "dialog" },
  ],
  bestPractices: ["Put a `Header` (or a `StepProgress`) in `header` and a `TabBar`, a composer or a main button in `footer`.", "`scroll={false}` when the content is a list that scrolls itself."],
  accessibility: {
    keyboard: [],
    notes: ["The parts keep the safe areas; the content scrolls and is reachable by the keyboard on the web."],
  },
  related: ["header", "tab-bar", "list"],
  native: {
    imports: ["Screen"],
    differences: [],
    examples: [
      { name: "app-shell", title: "App shell", description: "A header, a section's content, the tab bar.", template: true, purpose: "operate", why: "A person moves between the main sections of the app with one thumb, the tab bar always in reach." },
      { name: "auth", title: "Sign in", description: "The mark, two fields, the main action pinned.", template: true, purpose: "act", why: "A person signs in with the least typing: the brand, two fields, the main action pinned above the keyboard." },
      { name: "profile", title: "Profile", description: "The photo and its ring, the facts, the interests.", template: true, purpose: "show", why: "A person is recognised at a glance: the photo first, then the facts and interests that start a conversation." },
      { name: "feed", title: "Feed", description: "A vertical feed: one clip per screen, the action rail on the right, the caption bottom-left; the one in view plays.", template: true, purpose: "show", why: "A person watches what is new one clip at a time, with every action under the thumb." },
      { name: "chat", title: "Chat", description: "The person, the messages, the composer.", template: true, purpose: "converse", why: "A person reads the thread and answers from the composer, which stays in reach." },
      { name: "settings", title: "Settings", description: "Sections of switches that apply at once.", template: true, purpose: "operate", why: "A person changes a preference and sees it apply at once, grouped by what it concerns." },
      { name: "map", title: "Map", description: "The map fills the screen; a marker opens its place in a bottom sheet with the one action.", template: true, purpose: "act", why: "A person chooses a place by where it is, with every marker also a named button." },
      { name: "notifications", title: "Notifications", description: "What happened, newest first and by day, with mark-all-as-read as a button.", template: true, purpose: "converse", why: "A person catches up on what happened without hunting for it." },
    ],
  },
} satisfies ComponentMeta;
