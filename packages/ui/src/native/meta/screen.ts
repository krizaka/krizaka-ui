import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "Screen",
  summary: "A screen of the app — a header, the content (scrolling, rising with the keyboard), a footer — and the templates built on it: app shell, sign-in, profile, feed, chat, settings.",
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
      { name: "app-shell", title: "App shell", description: "A header, a section's content, the tab bar." },
      { name: "auth", title: "Sign in", description: "The mark, two fields, the main action pinned." },
      { name: "profile", title: "Profile", description: "The photo and its ring, the facts, the interests." },
      { name: "feed", title: "Feed", description: "A large title over a list of cards." },
      { name: "chat", title: "Chat", description: "The person, the messages, the composer." },
      { name: "settings", title: "Settings", description: "Sections of switches that apply at once." },
    ],
  },
} satisfies ComponentMeta;
