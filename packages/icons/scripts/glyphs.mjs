// The Krizaka signature icons, drawn in code. `node scripts/glyphs.mjs` writes src/glyphs.ts (committed; a test
// regenerates it and compares). Zero dependency.
//
// The grammar (README, "Style"):
//   grid 24, live area 2..22, stroke 1.75 (the `strokeWidth` prop), round caps and joins;
//   containers have CUT corners (45° chamfers, `cut`), never rounded ones — the angle of the Krizaka hexagon;
//   one NODE per product icon (`n`): a filled dot r 1.6, the core of the marks — it can carry the accent
//   (`nodeColor`); utility glyphs (arrows, chevrons, close, plus, check, menu) have none.

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const f = (v) => +v.toFixed(2);
/** A rectangle with 45° cut corners. */
export const cut = (x, y, w, h, c = 2.5) =>
  `M${f(x + c)} ${f(y)}H${f(x + w - c)}L${f(x + w)} ${f(y + c)}V${f(y + h - c)}L${f(x + w - c)} ${f(y + h)}H${f(x + c)}L${f(x)} ${f(y + h - c)}V${f(y + c)}Z`;
/** A pointy-top hexagon. */
export const hex = (cx, cy, r) =>
  `M${[-90, -30, 30, 90, 150, 210].map((a) => `${f(cx + r * Math.cos((a * Math.PI) / 180))} ${f(cy + r * Math.sin((a * Math.PI) / 180))}`).join("L")}Z`;
/** A point on a circle, at an angle in degrees (clockwise from 3 o'clock). */
export const pt = (cx, cy, r, a) => `${f(cx + r * Math.cos((a * Math.PI) / 180))} ${f(cy + r * Math.sin((a * Math.PI) / 180))}`;
/** An arc from angle a0 to a1 (degrees, clockwise from 3 o'clock) on a circle. */
export const arc = (cx, cy, r, a0, a1) => {
  const p = (a) => `${f(cx + r * Math.cos((a * Math.PI) / 180))} ${f(cy + r * Math.sin((a * Math.PI) / 180))}`;
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M${p(a0)}A${r} ${r} 0 ${large} ${a1 > a0 ? 1 : 0} ${p(a1)}`;
};

/**
 * name → { p: path d[], c: [cx, cy, r][] (stroked circles), n: [cx, cy][] (nodes), group, keywords }.
 * Groups: product (the vocabulary of Orochia and Orazaka), interface (navigation and actions), system.
 */
export const GLYPHS = {
  // ── Product: creators and audiences (Orochia) ──
  tip: { group: "product", keywords: "tip gift support creator", p: ["M5 9.5h14v3.5H5z", "M6.5 13v6.5h11V13", "M12 9.5v10", "M12 9.5C10.5 6 7 5.5 7.5 8c.3 1.2 2.5 1.5 4.5 1.5", "M12 9.5c1.5-3.5 5-4 4.5-1.5-.3 1.2-2.5 1.5-4.5 1.5"], n: [[12, 16]] },
  unlock: { group: "product", keywords: "unlock open paid content", p: [cut(5, 11, 14, 10, 2), "M8 11V7.5a4 4 0 0 1 7.7-1.5"], n: [[12, 16]] },
  paid: { group: "product", keywords: "paid premium ticket pass access", p: ["M4 7.5 6.5 5h11L20 7.5v2.5a2 2 0 0 0 0 4v2.5L17.5 19h-11L4 16.5V14a2 2 0 0 0 0-4z", "M15 7.5v1.5M15 11.25v1.5M15 15v1.5"], n: [[9.75, 12]] },
  auction: { group: "product", keywords: "auction gavel bid escrow", p: ["M10.6 6.1 14.1 2.6l7.3 7.3-3.5 3.5z", "M14.2 9.8 5 19", "M3 21.5h9"], n: [[16, 8]] },
  challenge: { group: "product", keywords: "challenge dare flag", p: ["M6 21V4", "M6 4.5h10.5l-2 3.5 2 3.5H6"], n: [[6, 21]] },
  goal: { group: "product", keywords: "goal target objective", c: [[12, 12, 8.5], [12, 12, 4.5]], p: ["M12 3.5V2M20.5 12H22M12 20.5V22M3.5 12H2"], n: [[12, 12]] },
  creator: { group: "product", keywords: "creator profile star user", p: [hex(12, 9, 4.5), "M4.5 20.5c1-3.5 4-5.5 7.5-5.5s6.5 2 7.5 5.5"], n: [[12, 9]] },
  story: { group: "product", keywords: "story ring circle", p: [arc(12, 12, 8.5, -60, 240)], c: [[12, 12, 4.5]], n: [[16.25, 4.64]] },
  story24h: { group: "product", keywords: "story 24h ephemeral clock expires", p: [arc(12, 12, 8.5, -80, 250), "M12 7.5V12l3 2"], n: [[13.48, 3.63]] },
  payout: { group: "product", keywords: "payout withdraw transfer bank", p: [cut(3, 9, 18, 11, 2), "M12 2.5v8", "M8.5 7 12 10.5 15.5 7", "M6.5 16.5h3"], n: [[16.5, 16.5]] },
  wallet: { group: "product", keywords: "wallet balance credits money", p: ["M17 7.5V5.5L15 4H6L4 6v12l2 2h13l1-1v-3", "M4.5 7.5H19l1 1v3", cut(14, 11.5, 7.5, 4.5, 1.2)], n: [[17.3, 13.75]] },
  share90: { group: "product", keywords: "share revenue 90 percent creator split", p: [`M12 12.5L${pt(12, 12.5, 8.5, -54)}${arc(12, 12.5, 8.5, -54, 270).replace(/^M[^A]+/, "")}Z`, `M12.9 9.8L${pt(12.9, 9.8, 8, -90)}${arc(12.9, 9.8, 8, -90, -54).replace(/^M[^A]+/, "")}Z`], n: [[12, 12.5]] },
  lock: { group: "product", keywords: "private lock secure", p: [cut(5, 11, 14, 10, 2), "M8 11V7.5a4 4 0 0 1 8 0V11"], n: [[12, 16]] },
  follow: { group: "product", keywords: "follow subscribe add user", p: [hex(10, 8.5, 4.2), "M3 20.5c.9-3.3 3.7-5.2 7-5.2 1.5 0 2.9.4 4 1.1", "M18.5 13v6M15.5 16h6"], n: [[10, 8.5]] },
  message: { group: "product", keywords: "message chat dm conversation", p: ["M6 4h12l2.5 2.5v8L18 17h-6.5L7 20.5V17H6l-2.5-2.5v-8z"], n: [[12, 10.5]] },
  upload: { group: "product", keywords: "upload publish send", p: ["M12 15.5V4", "M7.5 8.5 12 4l4.5 4.5", "M4 14.5v4l2 2h12l2-2v-4"], n: [[12, 15.5]] },
  video: { group: "product", keywords: "video clip film", p: [cut(2.5, 6, 13.5, 12, 2), "M16 10.5 21.5 7.5v9L16 13.5"], n: [[9.25, 12]] },
  play: { group: "interface", keywords: "play start", p: ["M7.5 4.5v15l12-7.5z"] },
  pause: { group: "interface", keywords: "pause stop", p: ["M8 5v14M16 5v14"] },
  image: { group: "product", keywords: "image photo picture media", p: [cut(3, 4, 18, 16, 2.5), "M3.5 17 9 11.5l4 4 2.5-2.5 5 5"], n: [[15.5, 8.5]] },
  heart: { group: "product", keywords: "like love favourite", p: ["M12 20 4.2 12.2a4.6 4.6 0 0 1 6.5-6.5L12 7l1.3-1.3a4.6 4.6 0 0 1 6.5 6.5z"], n: [[12, 12]] },

  // ── Product: sovereign AI (Orazaka) ──
  chat: { group: "product", keywords: "sovereign ai chat assistant conversation", p: ["M4 5.5 5.5 4h13L20 5.5v9L18.5 16H11l-4.5 4v-4h-1L4 14.5z", "M8 8.5h8M8 11.5h5"], n: [[16, 11.5]] },
  ai: { group: "product", keywords: "ai spark sovereign model intelligence", p: ["M11 3.5 12.6 8.4 17.5 10 12.6 11.6 11 16.5 9.4 11.6 4.5 10 9.4 8.4z", "M18 15v5M15.5 17.5h5"], n: [[11, 10]] },
  agent: { group: "product", keywords: "agent bot automation assistant", p: [cut(4.5, 8, 15, 12, 2.5), "M12 8V4.5", "M2 13v3M22 13v3", "M9.5 16.5h5"], c: [[9.25, 12.5, 1.1], [14.75, 12.5, 1.1]], n: [[12, 3.6]] },
  studio: { group: "product", keywords: "studio workshop build editor", p: [cut(3, 4, 18, 16, 2.5), "M3 9h18", "M9 9v11"], n: [[15, 14.5]] },
  pack: { group: "product", keywords: "pack bundle package module", p: [hex(12, 12, 9), "M12 21v-9", "M4.2 7.5 12 12l7.8-4.5"], n: [[12, 12]] },
  automation: { group: "product", keywords: "automation workflow flow trigger", p: [cut(3, 3, 7, 7, 1.5), cut(14, 14, 7, 7, 1.5), "M6.5 10v4.5l2 2H14", "M17.5 14V9.5l-2-2H10"], n: [[17.5, 17.5]] },
  knowledge: { group: "product", keywords: "knowledge documents rag library book", p: ["M4 5.5 5.5 4H11l1 1.5L13 4h5.5L20 5.5v13H13l-1 1.5-1-1.5H4z", "M12 5.5v13"], n: [[16.5, 9]] },
  shield: { group: "product", keywords: "privacy shield security sovereign protect", p: ["M12 2.8 19.5 6v5.5c0 4.6-3.2 8.3-7.5 9.7-4.3-1.4-7.5-5.1-7.5-9.7V6z"], n: [[12, 11.5]] },
  local: { group: "product", keywords: "local device laptop on-premise offline", p: [cut(4.5, 4.5, 15, 10.5, 1.8), "M2 19.5h20", "M4.5 15 3 18M19.5 15l1.5 3"], n: [[12, 9.75]] },
  server: { group: "product", keywords: "server self-hosted infrastructure node", p: [cut(3.5, 3.5, 17, 7, 1.8), cut(3.5, 13.5, 17, 7, 1.8), "M7 7h4M7 17h4"], n: [[16.5, 17]] },
  billing: { group: "product", keywords: "billing invoice receipt", p: ["M5 3.5h14v17l-2.3-1.5-2.4 1.5-2.3-1.5-2.3 1.5-2.4-1.5L5 20.5z", "M8.5 8h7M8.5 11.5h7M8.5 15h3.5"], n: [[15.5, 15]] },
  credits: { group: "product", keywords: "credits coins tokens balance", p: [hex(9.5, 10, 6.5), "M14.6 6.3a6.5 6.5 0 0 1 2.4 12.6 6.5 6.5 0 0 1-5.3-.4"], n: [[9.5, 10]] },

  // ── System ──
  theme: { group: "system", keywords: "theme appearance dark light contrast", c: [[12, 12, 8.5]], p: ["M12 3.5v17", "M12 3.5a8.5 8.5 0 0 1 0 17z"] },
  sun: { group: "system", keywords: "light mode sun", p: [hex(12, 12, 4), "M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"], n: [[12, 12]] },
  moon: { group: "system", keywords: "dark mode moon night", p: ["M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"], n: [[17, 6]] },
  search: { group: "system", keywords: "search find magnifier", c: [[10.5, 10.5, 6.5]], p: ["M15.3 15.3 20.5 20.5"], n: [[10.5, 10.5]] },
  settings: { group: "system", keywords: "settings preferences gear", p: [hex(12, 12, 8.5), "M12 3.5V7M12 17v3.5M4.6 7.75l3.05 1.75M16.35 14.5l3.05 1.75M4.6 16.25l3.05-1.75M16.35 9.5l3.05-1.75"], c: [[12, 12, 3]], n: [[12, 12]] },
  notification: { group: "system", keywords: "notification bell alert", p: ["M6 16.5V10a6 6 0 0 1 12 0v6.5l1.5 2h-15z", "M10 21h4"], n: [[12, 3]] },
  user: { group: "system", keywords: "user account person profile", c: [[12, 8.5, 4]], p: ["M4.5 20.5c1-3.5 4-5.5 7.5-5.5s6.5 2 7.5 5.5"] },
  users: { group: "system", keywords: "users team group community", c: [[9, 8.5, 3.5]], p: ["M2.5 19.5c.8-3 3.3-4.8 6.5-4.8s5.7 1.8 6.5 4.8", "M15.5 5.3a3.5 3.5 0 0 1 0 6.4", "M17.5 14.9c2 .6 3.4 2.2 4 4.6"] },
  calendar: { group: "system", keywords: "calendar date schedule", p: [cut(3.5, 5, 17, 15.5, 2.5), "M3.5 10h17", "M8 3v4M16 3v4"], n: [[15.5, 15]] },
  clock: { group: "system", keywords: "clock time duration", c: [[12, 12, 8.5]], p: ["M12 7.5V12l3 2"] },
  globe: { group: "system", keywords: "globe language web public", c: [[12, 12, 8.5]], p: ["M3.5 12h17", "M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5S9.7 5.9 12 3.5z"] },
  eye: { group: "system", keywords: "show visible view", p: ["M2.5 12C4.6 8 8 6 12 6s7.4 2 9.5 6c-2.1 4-5.5 6-9.5 6s-7.4-2-9.5-6z"], c: [[12, 12, 3]] },
  eyeOff: { group: "system", keywords: "hide hidden invisible", p: ["M9.9 6.3A9.9 9.9 0 0 1 12 6c4 0 7.4 2 9.5 6a12.7 12.7 0 0 1-2.4 3.2", "M6.6 7.6A11.3 11.3 0 0 0 2.5 12c2.1 4 5.5 6 9.5 6 1.7 0 3.3-.4 4.7-1.1", "M10 10a3 3 0 0 0 4.2 4.2", "M3 3l18 18"] },
  info: { group: "system", keywords: "info information help", p: [hex(12, 12, 9), "M12 11v5.5"], n: [[12, 7.8]] },
  warning: { group: "system", keywords: "warning alert caution", p: ["M12 3.5 21 19.5H3z", "M12 9.5v5"], n: [[12, 17]] },

  // ── Interface ──
  home: { group: "interface", keywords: "home start dashboard", p: ["M3.5 10.5 12 3.5l8.5 7v8.5L19 20.5H5L3.5 19z", "M9.5 20.5v-5.5h5v5.5"] },
  menu: { group: "interface", keywords: "menu hamburger navigation", p: ["M4 7h16M4 12h16M4 17h10"] },
  close: { group: "interface", keywords: "close dismiss x cancel", p: ["M6 6l12 12M18 6 6 18"] },
  back: { group: "interface", keywords: "back arrow left previous", p: ["M20 12H4.5", "M10.5 6 4.5 12l6 6"] },
  forward: { group: "interface", keywords: "forward arrow right next", p: ["M4 12h15.5", "M13.5 6l6 6-6 6"] },
  chevronDown: { group: "interface", keywords: "chevron down expand", p: ["M6 9.5l6 6 6-6"] },
  chevronRight: { group: "interface", keywords: "chevron right open", p: ["M9.5 6l6 6-6 6"] },
  plus: { group: "interface", keywords: "plus add create new", p: ["M12 4.5v15M4.5 12h15"] },
  check: { group: "interface", keywords: "check done valid", p: ["M4.5 12.5l5 5L19.5 7"] },
  more: { group: "interface", keywords: "more options ellipsis", n: [[5.5, 12], [12, 12], [18.5, 12]] },
  external: { group: "interface", keywords: "external open new window link", p: ["M13.5 3.5h7v7", "M20.5 3.5 11 13", "M18 14v4.5L16.5 20h-11L4 18.5v-11L5.5 6H10"] },
  link: { group: "interface", keywords: "link url chain", p: ["M10 14a4 4 0 0 0 5.7 0l3.6-3.6a4 4 0 0 0-5.7-5.7L12 6.3", "M14 10a4 4 0 0 0-5.7 0l-3.6 3.6a4 4 0 0 0 5.7 5.7l1.6-1.6"] },
  filter: { group: "interface", keywords: "filter funnel sort", p: ["M3.5 5h17l-6.5 7.5V19l-4 1.5v-8z"] },
  edit: { group: "interface", keywords: "edit pencil write", p: ["M4 20h4L19 9l-4-4L4 16z", "M13 7l4 4"] },
  trash: { group: "interface", keywords: "delete trash remove", p: ["M3.5 6.5h17", "M9 6.5V4h6v2.5", "M5.5 6.5l1 12.5 1.5 1.5h8l1.5-1.5 1-12.5", "M10 10.5v6M14 10.5v6"] },
  copy: { group: "interface", keywords: "copy duplicate clipboard", p: [cut(8.5, 8.5, 12, 12, 2), "M15.5 8.5V5L14 3.5H5L3.5 5v9L5 15.5h3.5"] },
  download: { group: "interface", keywords: "download save export", p: ["M12 4v11.5", "M7.5 11 12 15.5l4.5-4.5", "M4 14.5v4l2 2h12l2-2v-4"] },
  logout: { group: "interface", keywords: "logout sign out exit", p: ["M10 4H5.5L4 5.5v13L5.5 20H10", "M9.5 12h11", "M16.5 8l4 4-4 4"] },
  bookmark: { group: "interface", keywords: "bookmark save later", p: ["M6 3.5h12v17l-6-4.5-6 4.5z"] },
};

/** `story24h` → `Story24hIcon`. */
export const componentName = (name) => `${name[0].toUpperCase()}${name.slice(1)}Icon`;

/** The TypeScript module of the glyphs. */
export function render() {
  const lines = [
    "// GENERATED by scripts/glyphs.mjs — do not edit: change the drawing there and run `pnpm glyphs`.",
    'import type { Glyph } from "./glyph";',
    "",
  ];
  for (const [name, g] of Object.entries(GLYPHS)) {
    const body = [];
    if (g.p) body.push(`p: ${JSON.stringify(g.p)}`);
    if (g.c) body.push(`c: ${JSON.stringify(g.c)}`);
    if (g.n) body.push(`n: ${JSON.stringify(g.n)}`);
    lines.push(`/** ${g.keywords} */`, `export const ${name}: Glyph = /* @__PURE__ */ Object.freeze({ ${body.join(", ")} });`);
  }
  lines.push(
    "",
    "/** Every glyph's name, its group and its keywords — for catalogues and search (not for the components). */",
    `export const glyphIndex = ${JSON.stringify(
      Object.fromEntries(Object.entries(GLYPHS).map(([k, g]) => [k, { component: componentName(k), group: g.group, keywords: g.keywords }])),
      null,
      2,
    )} as const;`,
    "",
  );
  return lines.join("\n");
}

/** The components: one named export per glyph, built by a factory (`createIcon` web, `createNativeIcon` native). */
export function renderComponents(factory, from) {
  const lines = [
    "// GENERATED by scripts/glyphs.mjs — do not edit.",
    ...(from.startsWith("./create-native")
      ? ['import * as g from "../glyphs";', `import { ${factory} } from "${from}";`]
      : [`import { ${factory} } from "${from}";`, 'import * as g from "./glyphs";']),
    "",
  ];
  for (const [name, glyph] of Object.entries(GLYPHS)) {
    lines.push(`/** ${glyph.keywords} */`, `export const ${componentName(name)} = /* @__PURE__ */ ${factory}("${componentName(name)}", g.${name});`);
  }
  return `${lines.join("\n")}\n`;
}

/** Every generated file, by path relative to the package. */
export function outputs() {
  return {
    "src/glyphs.ts": render(),
    "src/icons.ts": renderComponents("createIcon", "./create-icon"),
    "src/native/icons.ts": renderComponents("createNativeIcon", "./create-native-icon"),
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  for (const [path, content] of Object.entries(outputs())) writeFileSync(join(root, path), content);
  console.log(`@krizaka/icons: ${Object.keys(GLYPHS).length} glyphs → ${Object.keys(outputs()).join(", ")}`);
}
