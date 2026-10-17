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
  return cell.state === "yes" ? words.yes : cell.state === "desktop" ? words.desktop : cell.state === "gap" ? words.gap : words.na;
}

/** The chip's tone (`.kz-chip-meta[data-tone]`). */
export function cellTone(cell: ParityCell): "accent" | "gap" | "na" {
  return cell.state === "gap" ? "gap" : cell.state === "n/a" ? "na" : "accent";
}

/** The issue's address (`krizaka/krizaka-ui#275` → its GitHub page). */
export function issueUrl(issue: string): string {
  const [repo, number] = issue.split("#");
  return `https://github.com/${repo}/issues/${number}`;
}
