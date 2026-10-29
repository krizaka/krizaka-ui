import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Upload queue",
  summary: "A queue of files that stays on screen: each row appears at once, says in words what it is doing, shows live progress while it works, and ends in a result chip; a non-blocking tray holds it.",
  status: "beta",
  category: "feedback",
  domain: "feedback",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#511", reason: "The Expo apps get the same queue on @krizaka/ui/native." }, desktop: "web" },
  whenToUse: ["Several files are checked, encoded or imported at once and the user keeps browsing.", "Progress comes from live events (Orazaka's run events): the row shows their words."],
  whenNotToUse: [{ when: "One file in a form, with its own progress.", use: "file-upload" }, { when: "A task whose progress is a single percentage.", use: "progress" }],
  bestPractices: ["Show the row at once (optimistic), then update it from the events: queued, reading, checking, done, failed.", "Say what it does in words (`statusText`, translated): a bare spinner says nothing.", "Put the result in `result` (a chip) and one quiet action in `trailing` (keep, retry).", "Only working rows move: the shimmer and the live progress stop with the work; reduced motion stops them.", "`TaskTray` is the container: a sheet on a phone, bottom-right from `sm`."],
  accessibility: { keyboard: [{ keys: "Enter / Space", action: "Folds or opens the tray." }], notes: ["The list is named by `label` and announced politely.", "A working row's progress is a `progressbar` named by the file.", "Failures are said in words, never by colour alone."] },
  related: ["file-upload", "drop-overlay", "progress", "badge"],
  web: { imports: ["UploadQueue", "TaskTray", "QueueStatus", "tally"], examples: [{ name: "default", title: "Queue", description: "Checking, reading, done and failed rows." }, { name: "tray", title: "Tray", description: "The non-blocking tray that folds away." }] },
} satisfies ComponentMeta;
