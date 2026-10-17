// The platform parity of Krizaka UI — web · native (React Native, Expo) · desktop (the Orazaka Mac app, Tauri 2) —
// read from the `parity` of every component's meta (@krizaka/ui and @krizaka/charts). Pure: no filesystem, no React.
// The registry tests of both packages call `parityProblems` (a component without a decision fails, with the fix in the
// message); the registries carry `parityRow` into their JSON, and ui.krizaka.com/platforms draws the matrix from it.

/** The three platforms, in the matrix's order. */
export const PLATFORM_IDS = /** @type {const} */ (["web", "native", "desktop"]);

const ISSUE = /^krizaka\/[a-z0-9.-]+#\d+$/;
const sentence = (value) => typeof value === "string" && value.trim().length >= 12;

/** What is wrong with one absence (`where`: `parity.native`…), or nothing. */
function absenceProblems(absence, where, names) {
  if (!absence || typeof absence !== "object") return [`${where}: an absence is { status: "gap", issue, reason } or { status: "n/a", reason, use? }`];
  const problems = [];
  if (absence.status === "gap") {
    if (!ISSUE.test(absence.issue ?? "")) problems.push(`${where}.issue: the issue that tracks the gap, as "krizaka/<repo>#<n>" (got ${JSON.stringify(absence.issue)})`);
    if (absence.use) problems.push(`${where}.use: a gap has no replacement yet — say it in reason, or make it "n/a"`);
  } else if (absence.status === "n/a") {
    if (absence.issue) problems.push(`${where}.issue: an "n/a" is a decision, not a task — no issue`);
    if (absence.use && names && !names.includes(absence.use)) problems.push(`${where}.use: "${absence.use}" is not a component of this registry`);
  } else problems.push(`${where}.status: "gap" (✗, tracked by an issue) or "n/a" (not meant for it) — got ${JSON.stringify(absence.status)}`);
  if (!sentence(absence.reason)) problems.push(`${where}.reason: one sentence that says why`);
  return problems;
}

/**
 * Every problem of a component's parity decision: `meta.platforms` is the side it has (`web` · `native` · `both`);
 * `meta.parity` says why it lacks the other one and what it is on desktop. Empty when the decision is complete.
 * @param {string} name the component
 * @param {{ platforms: string, parity?: any }} meta its meta
 * @param {readonly string[]} [names] the components of its registry (to check `use`)
 */
export function parityProblems(name, meta, names) {
  const parity = meta.parity;
  const file = `${name}: meta.parity`;
  if (!parity || typeof parity !== "object")
    return [
      `${file} is missing — every component says where it runs: { ${meta.platforms === "web" ? 'native: { status: "gap", issue: "krizaka/krizaka-ui#…", reason } or { status: "n/a", reason, use? }, ' : meta.platforms === "native" ? "web: { status, reason… }, " : ""}desktop: "web" | "desktop" | { status, reason… } }`,
    ];
  const problems = [];
  const hasWeb = meta.platforms !== "native";
  const hasNative = meta.platforms !== "web";
  if (hasWeb && parity.web) problems.push(`${file}.web: it has a web side (platforms "${meta.platforms}") — remove the absence`);
  if (!hasWeb) {
    if (!parity.web) problems.push(`${file}.web: it is native only — say why there is no web side ({ status: "gap", issue, reason } or { status: "n/a", reason, use? })`);
    else problems.push(...absenceProblems(parity.web, `${file}.web`, names));
  }
  if (hasNative && parity.native) problems.push(`${file}.native: it has a native side (platforms "${meta.platforms}") — remove the absence`);
  if (!hasNative) {
    if (!parity.native) problems.push(`${file}.native: it is web only — decide React Native: { status: "gap", issue: "krizaka/krizaka-ui#…", reason } (✗, to build) or { status: "n/a", reason, use? } (not meant for a phone)`);
    else problems.push(...absenceProblems(parity.native, `${file}.native`, names));
  }
  const desktop = parity.desktop;
  if (desktop === undefined) problems.push(`${file}.desktop: decide the Mac app (Tauri 2, the web components in the system WebView): "web" (runs as it is), "desktop" (has a desktop form) or an absence`);
  else if (desktop === "web" || desktop === "desktop") {
    if (!hasWeb) problems.push(`${file}.desktop: "${desktop}" needs a web side — the Mac app renders the web components; a native-only component is an absence there`);
  } else problems.push(...absenceProblems(desktop, `${file}.desktop`, names));
  return problems;
}

/** One cell of the matrix: `yes` (✓), `desktop` (✓, with a desktop form), `gap` (✗) or `n/a`, and why. */
function cell(absence) {
  return absence.status === "gap" ? { state: "gap", reason: absence.reason, issue: absence.issue } : { state: "n/a", reason: absence.reason, ...(absence.use ? { use: absence.use } : {}) };
}

/** The row of the parity matrix for one component (its registry carries it: `item.parity`). */
export function parityRow(meta) {
  const { platforms, parity } = meta;
  return {
    web: platforms === "native" ? cell(parity.web) : { state: "yes" },
    native: platforms === "web" ? cell(parity.native) : { state: "yes" },
    desktop: parity.desktop === "web" ? { state: "yes" } : parity.desktop === "desktop" ? { state: "desktop" } : cell(parity.desktop),
  };
}

/** The counts of a matrix, per platform: how many components are there (`yes` + `desktop`), missing (`gap`), not meant (`n/a`). */
export function parityCounts(rows) {
  const counts = Object.fromEntries(PLATFORM_IDS.map((id) => [id, { yes: 0, gap: 0, "n/a": 0 }]));
  for (const row of rows) for (const id of PLATFORM_IDS) counts[id][row[id].state === "desktop" ? "yes" : row[id].state] += 1;
  return counts;
}
