import { splitAtSigns } from "@/lib/email-safe";

/** A text whose « @ » between words (a package at a version, an address) sits in its own element: see lib/email-safe.ts. */
export function EmailSafe({ children }: { children: string }) {
  // A sign keys on its offset in the text: unique, and it does not move when a part before it changes.
  let offset = 0;
  return splitAtSigns(children).map((part) => {
    const key = offset;
    offset += typeof part === "string" ? part.length : 1;
    return typeof part === "string" ? part : <span key={key}>@</span>;
  });
}
