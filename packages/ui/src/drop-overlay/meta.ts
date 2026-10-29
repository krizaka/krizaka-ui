import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Drop overlay",
  summary: "The whole window is the drop target: while files are dragged over the page, a full-window overlay says where to drop and hands the files over. No dashed box inside the page.",
  status: "beta",
  category: "feedback",
  domain: "feedback",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A phone has no drag and drop from outside the app: the app offers the picker and the camera.", use: "file-upload" }, desktop: "web" },
  whenToUse: ["An app whose main job is receiving documents (Yomizaka, Orazaka's workspace): drag a file anywhere.", "Beside a primary action that opens the picker: the overlay is the shortcut, never the only way."],
  whenNotToUse: [{ when: "A field in a form that takes a file.", use: "file-upload" }],
  bestPractices: ["Keep a real file input behind the primary action: the keyboard and phones use it.", "Pass `accept` and say what is accepted in `hint`; show the rejected files in the queue, not silently.", "Disable it while a modal is open (`disabled`).", "The overlay never takes the pointer: the window keeps receiving the drop. Reduced motion: it appears at once."],
  accessibility: { keyboard: [], notes: ["Dragging is an extra: every action has a button and a picker.", "The overlay is a polite status (`role=\"status\"`) saying what to do; it is decorative for the pointer."] },
  related: ["file-upload", "upload-queue"],
  web: { imports: ["DropOverlay", "splitDropped", "dragHasFiles"], examples: [{ name: "default", title: "Drop anywhere", description: "Drag a file over the window; the primary action opens the picker." }] },
} satisfies ComponentMeta;
