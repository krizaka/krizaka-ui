// Pure: where a quoted passage sits on the pages of a PDF, from pdf.js's text positions. No DOM, no pdf.js import —
// the viewer feeds it what `page.getTextContent()` returned, a test feeds it a fixture.

/** A text item as pdf.js returns it (`TextItem`): the string, its matrix (`[a, b, c, d, x, baseline]`) and its size. */
export type TextItem = { str: string; transform: number[]; width: number; height: number };

/** A rectangle in fractions of the page (0–1), origin top-left — independent of the zoom the page is drawn at. */
export type Box = { x: number; y: number; width: number; height: number };

/** The text layer of one page: its size in PDF units (rotation 0) and its items in reading order. */
export type PageText = { page: number; width: number; height: number; items: readonly TextItem[] };

export type Located = {
  /** 1-based page where the passage starts. */
  page: number;
  /** One box per line of the passage (merged along a line); empty when only the page is known. */
  boxes: Box[];
  /** `exact`: the whole quote was found; `start`: only its opening words were (a quote cut by a different layout). */
  match: "exact" | "start" | "page";
};

const FOLD: Record<string, string> = { "’": "'", "‘": "'", "“": '"', "”": '"', "«": '"', "»": '"', "–": "-", "—": "-", " ": " ", " ": " ", "ﬁ": "fi", "ﬂ": "fl" };

/** The comparable form of a text: no whitespace, no soft hyphen, straight quotes, case and accents folded. */
export function fold(text: string): string {
  let out = "";
  for (const ch of text.normalize("NFKD")) {
    if (/\p{M}/u.test(ch) || /\s/u.test(ch) || ch === "­" || ch === "​") continue;
    out += (FOLD[ch] ?? ch).toLowerCase();
  }
  return out;
}

type Index = { text: string; at: { item: number; char: number }[] };

function indexPage(items: readonly TextItem[]): Index {
  let text = "";
  const at: Index["at"] = [];
  items.forEach((item, i) => {
    for (let c = 0; c < item.str.length; c++) {
      const piece = fold(item.str[c]!);
      for (let k = 0; k < piece.length; k++) {
        text += piece[k];
        at.push({ item: i, char: c });
      }
    }
  });
  return { text, at };
}

// Proportional faces: "locataire" is not as wide as nine capitals. pdf.js gives one width per item, so a position inside an
// item is shared out by the Helvetica advance widths (per 1000 em) — close for any sans text, far better than a flat share.
const ADVANCE =
  "278 278 355 556 556 889 667 191 333 333 389 584 278 333 278 278 556 556 556 556 556 556 556 556 556 556 278 278 584 584 584 556 1015 " +
  "667 667 722 722 667 611 778 722 278 500 667 556 833 722 778 667 778 722 667 611 722 667 944 667 667 611 278 278 278 469 556 333 " +
  "556 556 500 556 556 278 556 556 222 222 500 222 833 556 556 556 556 333 500 278 556 500 722 500 500 500";
const ADVANCES = ADVANCE.split(" ").map(Number);
function advance(ch: string): number {
  const base = ch.normalize("NFD")[0] ?? ch;
  const code = base.charCodeAt(0);
  return code >= 32 && code <= 126 ? (ADVANCES[code - 32] ?? 556) : 556;
}
/** The share (0–1) of an item's width that lies before character `n` of `text`. */
function shareBefore(text: string, n: number): number {
  let before = 0;
  let total = 0;
  for (let i = 0; i < text.length; i++) {
    const a = advance(text[i]!);
    if (i < n) before += a;
    total += a;
  }
  return total > 0 ? before / total : n / Math.max(1, text.length);
}

function boxesOf(page: PageText, index: Index, from: number, to: number): Box[] {
  const spans = new Map<number, [number, number]>();
  for (let k = from; k < to; k++) {
    const { item, char } = index.at[k]!;
    const s = spans.get(item);
    spans.set(item, s ? [Math.min(s[0], char), Math.max(s[1], char + 1)] : [char, char + 1]);
  }
  const raw: Box[] = [];
  for (const [i, [c0, c1]] of [...spans].sort((a, b) => a[0] - b[0])) {
    const item = page.items[i]!;
    const size = item.height || Math.abs(item.transform[3] ?? 0) || 10;
    const x = (item.transform[4] ?? 0) + item.width * shareBefore(item.str, c0);
    const w = item.width * (shareBefore(item.str, c1) - shareBefore(item.str, c0));
    const top = page.height - ((item.transform[5] ?? 0) + size * 0.9);
    raw.push({ x: x / page.width, y: top / page.height, width: w / page.width, height: (size * 1.15) / page.height });
  }
  // Merge the pieces that sit on one line and touch (several items of one sentence) into one rectangle.
  const merged: Box[] = [];
  for (const b of raw) {
    const last = merged[merged.length - 1];
    const sameLine = last && Math.abs(last.y - b.y) < last.height * 0.5 && b.x - (last.x + last.width) < last.height * 1.5 && b.x >= last.x - 1e-9;
    if (last && sameLine) {
      const right = Math.max(last.x + last.width, b.x + b.width);
      last.y = Math.min(last.y, b.y);
      last.height = Math.max(last.height, b.height);
      last.width = right - last.x;
    } else merged.push({ ...b });
  }
  return merged.map((b) => ({ x: clamp01(b.x), y: clamp01(b.y), width: Math.min(b.width, 1 - clamp01(b.x)), height: Math.min(b.height, 1 - clamp01(b.y)) }));
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** The shortest opening worth highlighting alone: a few words, not a stray letter. */
const MIN_START = 24;

/**
 * Where `quote` sits in the pages: the first page (starting with `hintPage`, if any) whose text contains it, and the
 * boxes of its lines. A quote that a different layout cut (a column break, a hyphen) is looked for by its opening
 * words (`match: "start"`); one that is nowhere gives `null`, or the hinted page alone (`match: "page"`). Never a guess:
 * a rotated page has no boxes, only its page.
 */
export function locateQuote(pages: readonly PageText[], quote: string, hintPage?: number): Located | null {
  const needle = fold(quote);
  const ordered = hintPage ? [...pages].sort((a, b) => Number(b.page === hintPage) - Number(a.page === hintPage)) : pages;
  if (needle.length > 0) {
    for (const mode of ["exact", "start"] as const) {
      const wanted = mode === "exact" ? needle : needle.slice(0, Math.max(MIN_START, Math.min(40, Math.floor(needle.length * 0.6))));
      if (mode === "start" && (needle.length <= wanted.length || wanted.length < MIN_START)) break;
      for (const page of ordered) {
        const index = indexPage(page.items);
        const found = index.text.indexOf(wanted);
        if (found < 0) continue;
        return { page: page.page, boxes: boxesOf(page, index, found, found + wanted.length), match: mode };
      }
    }
  }
  return hintPage && pages.some((p) => p.page === hintPage) ? { page: hintPage, boxes: [], match: "page" } : null;
}
