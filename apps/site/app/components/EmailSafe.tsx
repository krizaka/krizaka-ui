import { splitAtSigns } from "@/lib/email-safe";

/** A text whose « @ » between words (a package at a version, an address) sits in its own element: see lib/email-safe.ts. */
export function EmailSafe({ children }: { children: string }) {
  return splitAtSigns(children).map((part, i) => (typeof part === "string" ? part : <span key={i}>@</span>));
}
