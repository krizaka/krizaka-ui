/**
 * Canonical JSON (a subset of RFC 8785): keys sorted by UTF-16 code unit, no whitespace, strings and integers only
 * (no float has a canonical form we want to depend on). The bytes that are signed and verified; the same function on
 * the signer's and on the phone's side, so the two can never drift.
 */
export function canonicalize(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isInteger(value)) throw new Error("canonical JSON allows integers only");
    return String(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record).sort();
    return `{${keys
      .map((key) => {
        if (record[key] === undefined) throw new Error(`${key} is undefined: it has no canonical form`);
        return `${JSON.stringify(key)}:${canonicalize(record[key])}`;
      })
      .join(",")}}`;
  }
  throw new Error("this value cannot be canonicalised");
}
