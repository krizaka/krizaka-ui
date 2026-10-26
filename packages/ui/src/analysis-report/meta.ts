import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Analysis report",
  summary:
    "The result of an AI analysis, honest and calm: one sentence and an overall status, findings grouped by status with what was observed and what it may indicate, what the report did not examine, the next steps and where the result comes from.",
  status: "beta",
  category: "blocks",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "Showing what an Orazaka analysis found in a document, a lease, an identity check or a moderated item, in any product.",
    "Any result that has findings of different gravity, a list of limits and a provenance the reader may need to cite.",
  ],
  whenNotToUse: [
    { when: "A single yes / no outcome with no findings.", use: "alert" },
    { when: "A chat answer that streams as prose.", use: "chat" },
    { when: "A log of what happened in order.", use: "activity-feed" },
  ],
  bestPractices: [
    "Order is the point: the most serious group comes first, then the calmer ones; never sort by code.",
    "Keep « may indicate » honest: it carries the caveat (« not proof of tampering »), never a verdict.",
    "Say what the report did not examine, in the same weight as the findings; the limits are part of the result.",
    "Pass every word through `labels` from your messages (`@krizaka/i18n`); the package ships none.",
    "While the run is open, set `streaming`: findings are announced politely as they arrive.",
    "Give `onLocate` to scroll a document viewer to a finding's place; without it the location is plain text.",
    "Examples and tests use demo data only.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab / Enter", action: "Reaches the copy buttons, the locations and the folded evidence." }],
    notes: [
      "A section named by the studio's title; each status group is a labelled section with a heading, each finding a list item.",
      "A status is always a word with its dot, never a colour alone.",
      "The copy result and the streaming state are said in a polite status region; the list is `aria-busy` while streaming.",
      "The evidence is a native `details`: it works without script and keeps the focus on its summary.",
    ],
  },
  related: ["badge", "decision-list", "mascot-quote", "alert"],
  web: {
    imports: ["AnalysisReport", "groupFindings", "countByStatus", "reportToMarkdown", "reportToJson"],
    examples: [
      { name: "document-validation", title: "A document validation", description: "Header, findings grouped by status, limits and next steps in two columns, provenance, copy as JSON or Markdown." },
      { name: "streaming", title: "While the run is open", description: "`streaming` marks the report busy and announces each finding as it arrives; the copy actions are hidden." },
    ],
  },
  native: {
    imports: ["AnalysisReport"],
    differences: [
      "There is no clipboard in the package: `onCopy` receives the text and the app copies it.",
      "The evidence unfolds in place (a pressable summary) instead of a native `details`.",
    ],
    examples: [{ name: "document-validation", title: "A document validation", description: "The same report on the phone: findings by status, limits, next steps." }],
  },
} satisfies ComponentMeta;
