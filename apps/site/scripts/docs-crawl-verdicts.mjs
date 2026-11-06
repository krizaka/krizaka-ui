// WHY  What counts as a problem in the documentation crawl, and what is tolerated, must be readable as a list: a reviewer
//      adds a phrase or a host here, with its reason, and reads nothing else.
// WHAT The categories of problem, the TOLERATED list (a text it contains, and why), the phrases that make a browser
//      message a React error, the count per category, and the component name of a docs path.
// HOW  Imported by scripts/docs-crawl.mjs (which re-exports it); nothing to run. Tests: tests/docs-crawl.test.mjs.
// OWNER krizaka-ui (lane platform), ADR-026 phase D.

export const CATEGORIES = [
  "console-error",
  "page-error",
  "react-error",
  "failed-request",
  "http-error",
  "empty-example",
  "zero-size-example",
  "knob-noop",
  "playground-empty",
  "copy-empty",
  "dead-link",
  "dead-anchor",
  "overflow-x",
  "interaction-error",
];

/* Known and tolerated while it lasts, each with its reason. A tolerated problem is still listed (as « tolerated »),
   never counted as a failure. A problem is tolerated when its text contains one of `contains`. */
export const TOLERATED = [
  {
    contains: ["krizaka-assets.b-cdn.net/maps/v1/"],
    why: "the CDN's map tiles may lack CORS headers; MapGate shows the photograph meanwhile",
  },
  {
    contains: ["tiktok.com", "tiktokcdn-us.com"],
    why: "TikTok's own embed answers 400 / 429 to a headless browser and complains about its permissions policy: the platform's, behind a facade a visitor opens on purpose",
  },
  { contains: ["net::ERR_ABORTED"], why: "a request cancelled by a navigation or a prefetch" },
];

export function toleratedBy(text) {
  return TOLERATED.find((t) => t.contains.some((part) => text.includes(part)))?.why ?? null;
}

/** The phrases (compared in lower case) that make a browser message a React error. */
export const REACT_ERROR_PHRASES = [
  "hydration failed",
  "did not match",
  "text content does not match",
  "maximum update depth",
  "cannot update a component",
  'each child in a list should have a unique "key"',
];
/** `React error #418`, `Minified React error #418`: a production error code. */
export const REACT_ERROR_CODE = /react error #\d/i;
/** `hydration error`, `hydrating mismatch`: a hydration word, then error or mismatch. */
export const HYDRATION_PROBLEM = /hydrat\w+ (?:error|mismatch)/i;

export function isReactError(text) {
  const lower = text.toLowerCase();
  return REACT_ERROR_PHRASES.some((phrase) => lower.includes(phrase)) || REACT_ERROR_CODE.test(text) || HYDRATION_PROBLEM.test(text);
}

/** A warning of a third-party player about its own permissions policy (YouTube's embed). */
export const PERMISSIONS_POLICY = /^Permissions policy violation: .* is not allowed in this document/;

/** The browser's own line for a failed request: reported with its URL by the response handlers instead. */
export const isFailedResourceLine = (text) => text.startsWith("Failed to load resource");

/** A click error that only says the example moved or was covered: not a bug of the example. */
export const HARMLESS_CLICK_ERRORS = ["intercepts pointer", "not stable", "detached", "outside of the viewport", "not visible", "Timeout"];
export const isHarmlessClickError = (message) => HARMLESS_CLICK_ERRORS.some((part) => message.includes(part));

/** An error text that means the host cannot be reached (so the link is dead even if the site refuses robots). */
export const UNREACHABLE_HOST_ERRORS = ["ENOTFOUND", "certificate"];
export const isUnreachableHost = (status) => UNREACHABLE_HOST_ERRORS.some((part) => status.includes(part));

/** The name of a component page (`/components/button/`, `/fr/components/button`), or null. Deeper paths are not component pages. */
export function componentPageName(path) {
  if (!path.startsWith("/")) return null;
  const parts = path.split("/").slice(1);
  if (parts[0] === "fr") parts.shift();
  if (parts[0] !== "components" || !parts[1]) return null;
  const rest = parts.slice(2);
  const isPage = rest.length === 0 || (rest.length === 1 && rest[0] === "");
  return isPage ? parts[1] : null;
}
/** The component a docs path belongs to (`/fr/components/button/code`), or null. */
export function componentOfPath(path) {
  const parts = path.split("/");
  if (parts[0] !== "" || parts.length < 2) return null;
  const at = parts[1] === "fr" ? 2 : 1;
  return parts[at] === "components" && parts[at + 1] ? parts[at + 1] : null;
}

/** True when the HTML declares `id=…` or `name=…` equal to `id`, quoted with " or ' (the opening and closing quote may differ). */
export function htmlDeclaresAnchor(html, id) {
  const quotes = ['"', "'"];
  return ["id", "name"].some((attr) => quotes.some((open) => quotes.some((close) => html.includes(`${attr}=${open}${id}${close}`))));
}

export function summarize(problems) {
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c, 0]));
  const tolerated = Object.fromEntries(CATEGORIES.map((c) => [c, 0]));
  for (const p of problems) (p.tolerated ? tolerated : counts)[p.category]++;
  return { counts, tolerated };
}
