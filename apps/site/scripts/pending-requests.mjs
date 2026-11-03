/* The requests a page still waits on (krizaka-ui#952): when a crawl never reaches `networkidle`, it names them instead of
   « Timeout 30000ms exceeded ». A catalogue preview that loaded a third-party widget (Cloudflare Turnstile) kept a request
   open forever; the list says which. */

const SHOWN = 5; // @fixed: enough to name the culprit, short enough for a CI log line

/** Tracks a Playwright page's requests: `list()` gives the pending ones, oldest first; `reset()` before each navigation. */
export function pendingRequests(page, now = Date.now) {
  const started = new Map();
  page.on("request", (r) => started.set(r, now()));
  const done = (r) => started.delete(r);
  page.on("requestfinished", done);
  page.on("requestfailed", done);
  return {
    list: () =>
      [...started]
        .sort((a, b) => a[1] - b[1])
        .map(([r, at]) => ({ url: r.url(), type: r.resourceType(), ageSeconds: Math.round((now() - at) / 1000) })),
    reset: () => started.clear(),
  };
}

/** One line for the crawl's problems: what was still pending when networkidle never came. */
export function pendingReport(list) {
  if (list.length === 0) return "never reached networkidle; no request pending (a long task or a timer keeps it busy)";
  const shown = list.slice(0, SHOWN).map((p) => `${p.url} (${p.type}, ${p.ageSeconds} s)`);
  const more = list.length > SHOWN ? ` and ${list.length - SHOWN} more` : "";
  return `never reached networkidle; ${list.length} request${list.length > 1 ? "s" : ""} still pending: ${shown.join(", ")}${more}`;
}

/** A navigation that timed out (Playwright's TimeoutError), not one that failed. */
export const isNetworkIdleTimeout = (error) => error?.name === "TimeoutError";
