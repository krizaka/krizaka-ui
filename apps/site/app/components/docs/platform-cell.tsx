import type { ParityCell } from "@/lib/ui-registry";

/** The words of a matrix cell (messages: docs.ia.platforms.states). */
export interface CellWords {
  yes: string;
  desktop: string;
  gap: string;
  na: string;
}

/** The short word of a cell: ✓, ✓ with its desktop form, ✗ (to build), n/a. */
export function cellWord(cell: ParityCell, words: CellWords): string {
  const byState = { yes: words.yes, desktop: words.desktop, gap: words.gap, "n/a": words.na } as const;
  return byState[cell.state];
}

/** The chip's tone (`.kz-chip-meta[data-tone]`). */
const TONE_BY_STATE = { gap: "gap", "n/a": "na" } as const;

export function cellTone(cell: ParityCell): "accent" | "gap" | "na" {
  if (cell.state === "gap" || cell.state === "n/a") return TONE_BY_STATE[cell.state];
  return "accent";
}

/** The issue's address (`krizaka/krizaka-ui#275` → its GitHub page). */
export function issueUrl(issue: string): string {
  const [repo, number] = issue.split("#");
  return `https://github.com/${repo}/issues/${number}`;
}
