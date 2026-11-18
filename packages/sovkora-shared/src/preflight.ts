/**
 * @file preflight.ts
 * @description The document PRE-FLIGHT every Sovkora app shares (web, phone, desktop's workspace page): before a PDF is
 * sent to a Studio — a run that costs credits — decide, in-process and for nothing, whether it can be a document.
 */
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const INDEX: Readonly<Record<string, number>> = Object.fromEntries(Array.from(ALPHABET, (c, i) => [c, i]));

/** The characters of `text` that belong to the base64 alphabet, in order (padding, line breaks and anything else dropped). */
function keepAlphabet(text: string): string {
  return Array.from(text)
    .filter((char) => Object.hasOwn(INDEX, char))
    .join("");
}

/** Base64 (padded or not, line breaks ignored) to bytes. No `atob`, no `Buffer`: the phone's runtime has neither for sure. */
export function base64ToBytes(base64: string): Uint8Array {
  const clean = keepAlphabet(base64);
  const out = new Uint8Array(Math.floor((clean.length * 3) / 4));
  let bits = 0;
  let acc = 0;
  let at = 0;
  for (const char of clean) {
    acc = (acc << 6) | (INDEX[char] ?? 0);
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[at++] = (acc >> bits) & 0xff;
    }
  }
  return out.subarray(0, at);
}

/** Bytes as a latin1 string, in chunks: the PDF's own tokens are ASCII, and `String.fromCharCode(...big)` overflows the stack. */
export function bytesToLatin1(bytes: Uint8Array): string {
  const CHUNK = 0x8000;
  let text = "";
  for (let at = 0; at < bytes.length; at += CHUNK) {
    text += String.fromCodePoint(...bytes.subarray(at, at + CHUNK));
  }
  return text;
}

/**
 * The document PRE-FLIGHT: before a PDF is sent to a Studio — a run that costs credits — decide, here and for
 * nothing, whether it can be a document: the real type by its first bytes (the name and the type the picker reported are only
 * compared), its size against what the Studio's field can hold, a PDF that is whole, not encrypted and carrying nothing active.
 *
 * It speaks the vocabulary of Yomizaka's `lib/preflight` (ADR-0005: kinds, reasons, rules as data, the same active names), but
 * it is the cheap subset that runs anywhere without a PDF library (a phone, a browser, Node): it reads the bytes, not the
 * object tree. The day that module is a package (`@krizaka/preflight`, krizaka-ui#508) this file is replaced by it — same
 * port, same reasons. Deterministic: nothing is executed, rendered or sent.
 */
export type FileKind = "pdf" | "text" | "png" | "jpeg" | "docx" | "zip" | "executable" | "unknown";

export type RejectReason =
  | "EMPTY"
  | "TOO_LARGE"
  | "UNSUPPORTED_TYPE"
  | "TYPE_MISMATCH"
  | "EXECUTABLE"
  | "CORRUPT"
  | "TRUNCATED"
  | "ENCRYPTED"
  | "ACTIVE_CONTENT";

/** The rules, as DATA: what is allowed and how big. Another Studio, another policy is another object, never another code path. */
export interface PreflightRules {
  readonly maxBytes: number;
  readonly allowedKinds: readonly FileKind[];
  /** PDF names that mean active content: refused, never followed. */
  readonly pdfActiveNames: readonly string[];
}

export type Inspection =
  | { readonly kind: "accepted"; readonly fileKind: FileKind }
  | { readonly kind: "rejected"; readonly reason: RejectReason; readonly detail?: string };

export interface DocumentPreflight {
  /** `declared` is what the picker claimed (name, MIME type): only compared with what the bytes are. */
  inspect(bytes: Uint8Array, declared: { readonly name: string; readonly type: string }): Promise<Inspection>;
}

/** Yomizaka's limit when the Studio says none: a document is at most 10 MB. */
export const DEFAULT_MAX_BYTES = 10 * 1024 * 1024;

/** The same names as Yomizaka's rules.ts. */
const ACTIVE_NAMES = [
  "JavaScript",
  "JS",
  "Launch",
  "EmbeddedFile",
  "EmbeddedFiles",
  "OpenAction",
  "AA",
  "RichMedia",
  "XFA",
  "ImportData",
  "SubmitForm",
] as const;

/** The most file a text field of `maxLength` base64 characters can carry; the limit of the document when the field says none. */
export function maxPdfBytesFor(maxLength: number | undefined): number {
  return maxLength === undefined ? DEFAULT_MAX_BYTES : Math.floor((maxLength * 3) / 4);
}

/** The rules of a document check: PDF only, as large as the Studio's field can hold. */
export function documentRules(options: { readonly maxBytes?: number } = {}): PreflightRules {
  return { maxBytes: options.maxBytes ?? DEFAULT_MAX_BYTES, allowedKinds: ["pdf"], pdfActiveNames: ACTIVE_NAMES };
}

const startsWith = (bytes: Uint8Array, signature: readonly number[]): boolean =>
  signature.every((b, i) => bytes[i] === b);

/** What the bytes are — not what the name or the picker said. */
export function sniff(bytes: Uint8Array): FileKind {
  if (startsWith(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])) return "pdf";
  if (
    startsWith(bytes, [0x4d, 0x5a]) ||
    startsWith(bytes, [0x7f, 0x45, 0x4c, 0x46]) ||
    startsWith(bytes, [0x23, 0x21]) ||
    startsWith(bytes, [0xcf, 0xfa, 0xed, 0xfe]) ||
    startsWith(bytes, [0xca, 0xfe, 0xba, 0xbe])
  )
    return "executable";
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "jpeg";
  if (startsWith(bytes, [0x50, 0x4b, 0x03, 0x04])) return "zip";
  if (bytes.includes(0)) return "unknown";
  return "text";
}

const EXTENSIONS: Readonly<Record<string, FileKind>> = {
  pdf: "pdf",
  txt: "text",
  text: "text",
  md: "text",
  png: "png",
  jpg: "jpeg",
  jpeg: "jpeg",
  docx: "docx",
  zip: "zip",
};
const MIME: Readonly<Record<string, FileKind>> = {
  "application/pdf": "pdf",
  "text/plain": "text",
  "image/png": "png",
  "image/jpeg": "jpeg",
  "application/zip": "zip",
};

const ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const isAsciiAlphanumeric = (char: string): boolean => ALPHANUMERIC.includes(char);

/** The extension of a file name, lower-cased: what follows its last dot when that is only letters and digits, else none. */
function extensionOf(name: string): string | undefined {
  const dot = name.lastIndexOf(".");
  const extension = name.slice(dot + 1);
  return dot >= 0 && extension.length > 0 && Array.from(extension).every(isAsciiAlphanumeric) ? extension.toLowerCase() : undefined;
}

/** The kind the picker claims (extension first, then MIME type), or null when it claims nothing known. */
function claimed(declared: { readonly name: string; readonly type: string }): FileKind | null {
  const extension = extensionOf(declared.name);
  return (extension ? EXTENSIONS[extension] : undefined) ?? MIME[declared.type] ?? null;
}

/** The longest name read: a PDF name beyond it is cut, the rest is not a name. */
const MAX_NAME_LENGTH = 40;
const NAME_START = "/";
const ESCAPE = "#";
const NAME_CHARACTERS = new Set(`${ALPHANUMERIC}_#.+-`);
const HEX_DIGITS = "0123456789abcdefABCDEF";
/** An escape is `#` and two hex digits. */
const ESCAPE_DIGITS = 2;

const isHexDigit = (char: string | undefined): boolean => char !== undefined && HEX_DIGITS.includes(char);

/** A name's text with every `#xx` escape decoded; an escape that is not `#` and two hex digits stays as written. */
function decodeEscapes(name: string): string {
  let out = "";
  let at = 0;
  while (at < name.length) {
    const digits = name.slice(at + 1, at + 1 + ESCAPE_DIGITS);
    if (name[at] === ESCAPE && digits.length === ESCAPE_DIGITS && Array.from(digits).every(isHexDigit)) {
      out += String.fromCodePoint(Number.parseInt(digits, 16));
      at += 1 + ESCAPE_DIGITS;
    } else {
      out += name[at];
      at += 1;
    }
  }
  return out;
}

/** `/Name` tokens of a PDF's raw bytes, `#xx` escapes decoded (an obfuscated /J#61vaScript is still JavaScript). */
function pdfNames(raw: string): Set<string> {
  const names = new Set<string>();
  let at = 0;
  while (at < raw.length) {
    if (raw[at] !== NAME_START) {
      at += 1;
      continue;
    }
    let end = at + 1;
    while (end < raw.length && end - at - 1 < MAX_NAME_LENGTH && NAME_CHARACTERS.has(raw[end]!)) end += 1;
    if (end > at + 1) names.add(decodeEscapes(raw.slice(at + 1, end)));
    at = end;
  }
  return names;
}

/** How much of a file's end is searched for its trailer. */
const TRAILER_WINDOW = 2048;

/** Whole PDFs end with `startxref`, an offset and `%%EOF`: both markers must be in the last bytes, or the file was cut. */
function hasTrailer(raw: string): boolean {
  const tail = raw.slice(-TRAILER_WINDOW);
  return tail.includes("startxref") && tail.includes("%%EOF");
}

const reject = (reason: RejectReason, detail?: string): Inspection => ({
  kind: "rejected",
  reason,
  ...(detail ? { detail } : {}),
});

export function createInspector(rules: PreflightRules): DocumentPreflight {
  const active = new Set(rules.pdfActiveNames);
  return {
    async inspect(bytes, declared) {
      if (bytes.length === 0) return reject("EMPTY");
      if (bytes.length > rules.maxBytes) return reject("TOO_LARGE", String(bytes.length));
      const detected = sniff(bytes);
      if (detected === "executable") return reject("EXECUTABLE");
      const said = claimed(declared);
      if (said && said !== detected && !(said === "text" && detected === "unknown"))
        return reject("TYPE_MISMATCH", `${said} ≠ ${detected}`);
      if (!rules.allowedKinds.includes(detected)) return reject("UNSUPPORTED_TYPE", detected);
      if (detected !== "pdf") return reject("UNSUPPORTED_TYPE", detected);

      const raw = bytesToLatin1(bytes);
      if (!hasTrailer(raw)) return reject("TRUNCATED");
      const names = pdfNames(raw);
      if (names.has("Encrypt")) return reject("ENCRYPTED");
      // Sorted by code unit (the order `Array#sort` gives strings), into a new array.
      const found = [...names].filter((name) => active.has(name)).sort((a, b) => Number(a > b) - Number(a < b));
      if (found.length > 0) return reject("ACTIVE_CONTENT", found.join(", "));
      return { kind: "accepted", fileKind: "pdf" };
    },
  };
}

/** The message key of a refusal, in an app's catalogue (`studios.document.refused.*`). */
export function reasonKey(reason: RejectReason): `studios.document.refused.${RejectReason}` {
  return `studios.document.refused.${reason}`;
}
