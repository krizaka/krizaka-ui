/* The download figures of the @krizaka packages, read from api.npmjs.org when the site is built (output: "export"):
   the last week and the 12 weekly sums before it, for the home's figure and each package's sparkline.
   Pure rules (`rangeWindow`, `weeklyBuckets`, `sumKnown`) tested with fixtures in tests/npm-downloads.test.mjs.
   Fail soft: anything missing, malformed or rate-limited gives nothing — the page shows no figure rather than a wrong one.
   Maven Central has no public download API (Sonatype's publisher statistics sit behind a login): no figure for Maven. */

const DAY = 864e5;
const iso = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export interface Downloads {
  /** The last week npm counted. */
  weekly: number;
  /** The 12 weekly sums ending on the same day, oldest first (absent unless complete). */
  series?: number[];
}

/** The `weeks` * 7 days ending on `endDay` (inclusive), as the `start:end` the range endpoint takes. */
export function rangeWindow(endDay: string, weeks = 12): { start: string; end: string } {
  const end = Date.parse(endDay);
  return { start: iso(end - (weeks * 7 - 1) * DAY), end: iso(end) };
}

/** Weekly sums, oldest first, of a `downloads/range` payload; null unless every day of the window is present and sound. */
export function weeklyBuckets(payload: unknown, endDay: string, weeks = 12): number[] | null {
  const rows = (payload as { downloads?: unknown } | null)?.downloads;
  if (!Array.isArray(rows)) return null;
  const byDay = new Map<string, number>();
  for (const r of rows as { day?: unknown; downloads?: unknown }[]) {
    if (typeof r?.day !== "string" || typeof r.downloads !== "number" || !Number.isInteger(r.downloads) || r.downloads < 0) return null;
    byDay.set(r.day, r.downloads);
  }
  const end = Date.parse(endDay);
  const out: number[] = [];
  for (let w = 0; w < weeks; w++) {
    let sum = 0;
    for (let d = 0; d < 7; d++) {
      const n = byDay.get(iso(end - ((weeks - 1 - w) * 7 + (6 - d)) * DAY));
      if (n === undefined) return null;
      sum += n;
    }
    out.push(sum);
  }
  return out;
}

/** The sum of the figures that are known; undefined when none is. */
export function sumKnown(values: readonly (number | null | undefined)[]): number | undefined {
  const known = values.filter((v): v is number => Number.isInteger(v));
  return known.length ? known.reduce((a, b) => a + b, 0) : undefined;
}

/** `last-week` payload → the weekly figure and the day it ends on; null when it is not exactly that. */
export function parseLastWeek(payload: unknown): { weekly: number; end: string } | null {
  const p = payload as { downloads?: unknown; end?: unknown } | null;
  if (typeof p?.downloads !== "number" || !Number.isInteger(p.downloads) || p.downloads < 0) return null;
  if (typeof p.end !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(p.end)) return null;
  return { weekly: p.downloads, end: p.end };
}

async function getJson(url: string): Promise<unknown> {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { "user-agent": "krizaka-ui-site-build" }, signal: AbortSignal.timeout(8000) });
      if (res.ok) return await res.json();
      if (res.status !== 429) return null;
    } catch {
      return null;
    }
    await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
  }
  return null;
}

let cache: Promise<Map<string, Downloads>> | undefined;

/** The downloads of each package (`@krizaka/ui` → …), once per build; packages npm could not answer for are absent. */
export function npmDownloads(names: readonly string[]): Promise<Map<string, Downloads>> {
  cache ??= (async () => {
    const out = new Map<string, Downloads>();
    for (const name of names) {
      const week = parseLastWeek(await getJson(`https://api.npmjs.org/downloads/point/last-week/${name}`));
      if (!week) continue;
      // The window ends on the day `last-week` ends on: npm posts its counts a day or two late, and a day not yet counted would read as 0.
      const { start, end } = rangeWindow(week.end);
      const series = weeklyBuckets(await getJson(`https://api.npmjs.org/downloads/range/${start}:${end}/${name}`), end);
      out.set(name, { weekly: week.weekly, ...(series ? { series } : {}) });
    }
    return out;
  })();
  return cache;
}
