import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Proposal review",
  summary: "An agent proposes, a person approves, rejects or edits: who proposes, what, how sure it is (in words and figures), the evidence as a signed diff, and the decision announced.",
  status: "experimental",
  adoption: "orazaka-web-client#98",
  category: "blocks",
  domain: "conversation",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#673", reason: "The Orazaka Mac app renders the web block (orazaka#109); a phone twin follows with the first phone approval screen." }, desktop: "web" },
  whenToUse: ["A run needs a human to approve what an agent proposes (a timeline step, a review queue, a diff with approval).", "Any proposal whose approval must be explicit, keyboard-reachable and announced."],
  whenNotToUse: [
    { when: "For a plain yes/no question.", use: "confirm-button" },
    { when: "For a destructive action you chose yourself.", use: "confirm-button" },
  ],
  bestPractices: [
    "The host owns the state: pass `waiting` until the decision is saved, then `approved`, `rejected` or `expired`; the new state is announced.",
    "Set `irreversible` when approving cannot be undone: the primary button takes two presses.",
    "Say the confidence in words (`label`) and add the figure (`percent`); the chip's tone only reinforces.",
    "Examples use a fictitious run with round demo amounts, never a ledger line.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Approve, Reject, then Edit, in that order." },
      { keys: "Enter / Space", action: "Presses the focused button; an irreversible approval needs a second press." },
    ],
    notes: [
      "There is no slide-to-approve: a drag has no keyboard or screen-reader path (ADR-006).",
      "`DiffView` prefixes every line with a sign and a hidden word (Added, Removed, Unchanged); the colour is never the only signal.",
      "The state is an `output` region: it is read when it changes.",
      "At 360 px the buttons wrap and the diff lines wrap; nothing scrolls sideways.",
    ],
  },
  related: ["confirm-button", "decision-list", "button"],
  web: {
    imports: ["ProposalReview", "DiffView"],
    examples: [{ name: "default", title: "Approve a change", description: "A planner agent proposes a reminder change; the diff shows the lines; Approve, Reject and Edit." }],
  },
} satisfies ComponentMeta;
