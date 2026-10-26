import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Chat",
  summary: "A conversation's parts — `MessageBubble` (time, receipt, retry), `TypingIndicator`, `MessageComposer`, `ConversationItem` — the same API on the web and React Native.",
  status: "beta",
  category: "data-display",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: ["A creator app's messages, a community's chats, support threads.", "An inbox of conversations with presence and unread counts."],
  whenNotToUse: [
    { when: "For a comments thread under a post.", use: "list" },
    { when: "For notifications.", use: "toast" },
  ],
  bestPractices: ["Group the runs of one sender (`grouped`); show the receipt under the last message of yours only.", "Keep the server's order and merge (the app's), the bubble only draws.", "The composer never clears itself: clear the draft once the message is sent.", "`variant=\"pill\"` for a chat page: put the mode/model chip and attach in `leading`, privacy and cost in `status`, and pass `busy` while an answer streams — the field's box does not move."],
  accessibility: {
    keyboard: [{ keys: "Enter / Shift+Enter", action: "In the web composer: send, or a new line." }],
    notes: ["Each bubble is read with its time; a failed one says so and offers a retry.", "The `pill` status line is a polite live region; a busy composer holds the send (`aria-busy`) and says nothing else.", "The typing dots are announced politely by their words.", "A conversation row reads name, presence, last message, time and unread count."],
  },
  related: ["avatar", "list", "toast"],
  web: {
    imports: ["MessageBubble", "TypingIndicator", "MessageComposer", "ConversationItem"],
    examples: [
      { name: "conversation", title: "Conversation", description: "Grouped runs, a read receipt, typing, the composer." },
      { name: "inbox", title: "Inbox", description: "Online, typing, unread counts." },
      { name: "pill-composer", title: "Pill composer", description: "One rounded field: chip and attach inside, round send inside, a status line under it." },
    ],
  },
  native: {
    imports: ["MessageBubble", "TypingIndicator", "MessageComposer", "ComposerMeta", "ConversationItem"],
    differences: ["The composer keeps clear of the home indicator; the send button plays a light tap.", "A failed bubble is itself the retry button.", "`ConversationItem` takes `presence` (a dot on the avatar) instead of `online`.", "`MessageBubble` takes `children` (a `Markdown` answer) in place of `text`; `MessageComposer` takes `meta`, usually a `ComposerMeta` (the model chip and a status line shown only when true)."],
    examples: [
      { name: "conversation", title: "Conversation", description: "Grouped runs, a read receipt, typing, the composer." },
      { name: "inbox", title: "Inbox", description: "Presence, typing, unread counts." },
      { name: "assistant", title: "Assistant", description: "A Markdown answer in the bubble; the model chip and a privacy line above the composer." },
    ],
  },
} satisfies ComponentMeta;
