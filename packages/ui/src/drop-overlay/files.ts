// Headless: what a drag carries and which of the dropped files a product accepts.

/** True while the drag carries files (not text or a link): the only drag that should raise the overlay. */
export function dragHasFiles(transfer: { types?: readonly string[] | DOMStringList } | null | undefined): boolean {
  return Array.from(transfer?.types ?? []).includes("Files");
}

/** One accepted kind: a MIME type (`application/pdf`), a family (`image/*`) or an extension (`.pdf`). */
export type AcceptRule = string;

function matches(file: Pick<File, "name" | "type">, rule: AcceptRule): boolean {
  const wanted = rule.trim().toLowerCase();
  if (wanted.startsWith(".")) return file.name.toLowerCase().endsWith(wanted);
  if (wanted.endsWith("/*")) return file.type.toLowerCase().startsWith(wanted.slice(0, -1));
  return file.type.toLowerCase() === wanted;
}

export interface DropSplit<F> {
  accepted: F[];
  rejected: F[];
}

/** Splits dropped files by `accept` (no rule: everything is accepted). */
export function splitDropped<F extends Pick<File, "name" | "type">>(files: readonly F[], accept?: readonly AcceptRule[]): DropSplit<F> {
  if (!accept || accept.length === 0) return { accepted: [...files], rejected: [] };
  const accepted: F[] = [];
  const rejected: F[] = [];
  for (const file of files) (accept.some((rule) => matches(file, rule)) ? accepted : rejected).push(file);
  return { accepted, rejected };
}
