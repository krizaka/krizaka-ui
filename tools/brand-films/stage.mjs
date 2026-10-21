// The stages the films are captured from: HTML pages that render the REAL components of @krizaka/ui (Mascot, Landscape,
// KrizakaLogo — from the built package, like tools/export-brand.mjs) with the tokens and the Krizaka typefaces, plus the
// choreography of ./choreography.mjs. Nothing is redrawn: a mark or a bird that changes in @krizaka/ui changes here at the
// next render.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { BASE_CSS, birdLoops, DEFAULT_VIEW, EASE, IDLE, LOOP, tracksCss } from "./choreography.mjs";
import { AMBIENT, ambientGesture, FILM, layout, stretch } from "./film.mjs";
import { OWN_PALETTES } from "../../packages/ui/src/mascots/geometry.ts";

/** React, the server renderer and the components, from the built package at <uiRoot> (pnpm turbo run build --filter=@krizaka/ui). */
export async function loadKit(uiRoot) {
  const req = createRequire(join(uiRoot, "package.json"));
  const react = req("react");
  const { renderToStaticMarkup } = req("react-dom/server");
  const load = (f) =>
    import(pathToFileURL(join(uiRoot, "dist", f)).href).catch((err) => {
      throw new Error(`cannot load ${f} from ${uiRoot}/dist — build @krizaka/ui first (pnpm turbo run build --filter=@krizaka/ui): ${err.message}`);
    });
  const [{ Mascot }, { Landscape }, { KrizakaLogo }] = await Promise.all([load("mascots.js"), load("landscape.js"), load("index.js")]);
  const tokensCss = readFileSync(resolve(uiRoot, "../tokens/dist/tokens.css"), "utf8");
  const fonts = resolve(uiRoot, "../fonts/files/web");
  const version = JSON.parse(readFileSync(join(uiRoot, "package.json"), "utf8")).version;
  const html = (type, props) => renderToStaticMarkup(react.createElement(type, props));
  return { version, tokensCss, fonts, mascot: (bird) => html(Mascot, { bird, mood: "welcome", tone: "own", size: 120, animated: false }), landscape: (props) => html(Landscape, props), logo: (size) => html(KrizakaLogo, { size, animated: true }) };
}

/**
 * A mascot as rendered by React, dressed for a film: the welcome wave's resting turn of the right wing goes (the
 * choreography moves the wings), the shadow gets a name, the frame widens to `view`, and the props of the promise are
 * laid behind the bird (`back`), in its wings (`inner`, moving with it) and on the ground (`outer`). Every prop chunk is
 * wrapped in `.bf-props` (the film fades them when the bird steps back).
 */
export function dress(svg, { back = "", inner = "", outer = "", view = DEFAULT_VIEW, size, uid } = {}) {
  if (!svg.includes('<g class="kzb-bird">') || !svg.endsWith("</svg>")) throw new Error("not a Mascot markup (no .kzb-bird group)");
  const wrap = (s) => (s ? `<g class="bf-props">${s}</g>` : "");
  // Each server render starts its ids afresh: several birds on one page would share one gradient — `uid` keeps them apart.
  if (uid) for (const [, id] of svg.matchAll(/ id="([^"]+)"/g)) svg = svg.split(`#${id})`).join(`#${id}-${uid})`).split(`id="${id}"`).join(`id="${id}-${uid}"`);
  let out = svg
    .replace(/;transform:rotate\([^)]*\)/g, "")
    .replace("<ellipse ", '<ellipse class="bf-shadow" ')
    .replace(/viewBox="[^"]*"/, `viewBox="${view.join(" ")}"`)
    .replace('<g class="kzb-bird">', `${wrap(back)}<g class="bf-move"><g class="kzb-bird">`);
  out = `${out.slice(0, -"</svg>".length)}${wrap(inner)}</g>${wrap(outer)}</svg>`;
  if (size) out = out.replace(/ width="[^"]*" height="[^"]*"/, ` width="${size}" height="${size}"`);
  return out;
}

const fontFaces = (dir) =>
  [
    ["Inter", "inter-latin-wght.woff2"],
    ["Plus Jakarta Sans", "plus-jakarta-sans-latin-wght.woff2"],
    ["JetBrains Mono", "jetbrains-mono-latin-wght.woff2"],
  ]
    .map(([family, file]) => `@font-face { font-family: "${family}"; src: url("${pathToFileURL(join(dir, file)).href}") format("woff2"); font-weight: 100 900; font-display: block; }`)
    .join("\n");

/** One HTML document: tokens, faces, the theme (`dark` on :root, `light` on html.light — the tokens' contract). */
export function page({ kit, theme = "dark", css = "", body, width, height }) {
  return `<!doctype html><html class="${theme === "light" ? "light" : ""}"><head><meta charset="utf-8"><style>
${kit.tokensCss}
${fontFaces(kit.fonts)}
html, body { margin: 0; padding: 0; background: transparent; }
body { width: ${width}px; height: ${height}px; overflow: hidden; font-family: var(--kz-font-sans); color: var(--kz-text-primary); }
*, *::before, *::after { box-sizing: border-box; }
${BASE_CSS}
${css}
</style></head><body>${body}</body></html>`;
}

/** The theme a loop is drawn in: dark, light, or `alpha` — no page behind it, a mid-tone outline that reads on both. */
const ALPHA_CSS = `:root { --kz-border-strong: rgba(118,118,132,.62); --kz-surface-0: #0d0d10; }`;

/** The bird alone on a transparent square (the layer composed over the backgrounds). */
export function loopLayerHtml({ kit, bird, theme, size = 1080 }) {
  const spec = birdLoops()[bird];
  if (!spec) throw new Error(`no loop for ${bird}`);
  const svg = dress(kit.mascot(bird), { ...spec, size });
  return page({ kit, theme: theme === "alpha" ? "dark" : theme, width: size, height: size, css: `${theme === "alpha" ? ALPHA_CSS : ""}\nsvg { display: block; }\n${tracksCss([...IDLE, ...spec.tracks])}`, body: svg });
}

/** The page behind a loop: the theme's surface and a glow in the bird's own colour. */
export function loopBackgroundHtml({ kit, bird, theme, width, height }) {
  const glow = OWN_PALETTES[bird].from;
  const strength = theme === "light" ? 16 : 24;
  return page({
    kit,
    theme,
    width,
    height,
    css: `body { background: var(--kz-surface-0); }
.glow { position: absolute; inset: 0; background: radial-gradient(closest-side at 50% 52%, color-mix(in srgb, ${glow} ${strength}%, transparent) 0%, transparent 100%); }
.vignette { position: absolute; inset: 0; background: radial-gradient(farthest-corner at 50% 50%, transparent 60%, color-mix(in srgb, var(--kz-surface-0) 70%, #000 ${theme === "light" ? 4 : 30}%) 100%); }`,
    body: `<div class="glow"></div><div class="vignette"></div>`,
  });
}

// ---- the film ---------------------------------------------------------------------------------------------------

/** "Le monde de Krizaka": the valley at dusk (Landscape), the flock on the ridge, each bird stepping forward, the mark. */
export function filmHtml({ kit, aspect }) {
  const L = layout(aspect);
  const [width, height] = FILM.aspects[aspect];
  const loops = birdLoops();
  const actors = [...FILM.cast, ...FILM.family];
  const css = [];
  const body = [];

  css.push(`body { background: var(--kz-surface-0); }
.layer { position: absolute; inset: 0; }
.bf-world { transform-origin: 50% 0%; }
.bf-ridge { z-index: 2; }
.bf-scrim { z-index: 3; background: color-mix(in srgb, var(--kz-surface-0) 62%, transparent); opacity: 0; }
.bf-glow { z-index: 4; opacity: 0; }
.bf-actor { position: absolute; z-index: 1; will-change: transform; }
.bf-actor svg { display: block; width: 100%; height: 100%; overflow: visible; }
.bf-sweep { z-index: 6; background: linear-gradient(105deg, transparent 38%, rgba(255,255,255,.13) 50%, transparent 62%); mix-blend-mode: screen; transform: translateX(-110%); }
.bf-end { z-index: 8; background: var(--kz-surface-0); opacity: 0; display: grid; place-items: center; align-content: center; gap: ${L.endGap}px; }
.bf-mark { opacity: 0; }
.bf-mark svg { display: block; }
.bf-mark path[pathLength] { stroke-dasharray: 1; stroke-dashoffset: 1; }
.bf-word { font-family: var(--kz-font-display); font-weight: 750; font-size: ${L.word}px; letter-spacing: -0.025em; color: var(--kz-text-primary); text-align: center; line-height: 1; opacity: 0; }
.bf-tag { font-family: var(--kz-font-mono); font-size: ${L.tag}px; letter-spacing: .32em; text-transform: uppercase; color: var(--kz-text-secondary); text-align: center; opacity: 0; }
.bf-endsweep { z-index: 9; background: linear-gradient(105deg, transparent 42%, rgba(255,255,255,.10) 50%, transparent 58%); mix-blend-mode: screen; transform: translateX(-110%); }`);

  // The valley: the same Landscape as krizaka.com's hero, its own flock left out — the flock of the film is the Mascot one.
  body.push(`<div class="layer bf-world">${kit.landscape({ tone: "own", flock: false, phoenix: L.phoenix, animated: true, fade: false, position: "absolute" })}</div>`);
  body.push(`<svg class="layer bf-ridge" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><path d="${L.ridge}" fill="var(--kz-surface-0)"/><path d="${L.ridgeEdge}" stroke="rgba(255,255,255,.10)" stroke-width="2" fill="none"/></svg>`);
  body.push(`<div class="layer bf-scrim"></div>`);
  for (const bird of FILM.cast) {
    const [x, y] = L.spot;
    const r = L.spotSize * 0.9;
    body.push(`<div class="layer bf-glow bf-glow-${bird}" style="background: radial-gradient(circle ${r}px at ${x}px ${y}px, color-mix(in srgb, ${OWN_PALETTES[bird].from} 34%, transparent), transparent)"></div>`);
  }

  actors.forEach((bird, i) => {
    const a = L.actors[bird];
    const spec = loops[bird];
    // The younger birds only join the finale: no props, no gesture — their idle life.
    const props = FILM.cast.includes(bird) ? spec : { view: spec.view };
    const svg = dress(kit.mascot(bird), { ...props, uid: bird });
    body.push(`<div class="bf-actor bf-actor-${bird}" style="left:${a.x - a.size / 2}px; top:${a.y - a.size / 2}px; width:${a.size}px; height:${a.size}px">${svg}</div>`);
    const scope = `.bf-actor-${bird}`;
    // Idle life all along, each bird at its own phase; the promise once, at its moment.
    const idle = IDLE.map(([sel, stops]) => [sel, stops, { delay: -0.73 * i - 0.4 }]);
    const s = FILM.spotlight[bird];
    const gesture = s === undefined ? [] : spec.tracks.map(([sel, stops]) => [sel, stops, { delay: s - FILM.gestureLead, iterations: 1 }]);
    css.push(tracksCss([...idle, ...gesture], { scope, prefix: `bf-${bird}` }));
    css.push(tracksCss([[scope, FILM.actorTrack(bird, L)]], { prefix: `bf-${bird}-actor`, total: FILM.seconds, iterations: 1, hold: true }));
    if (s !== undefined) {
      css.push(tracksCss([[`${scope} .bf-props`, [[0, "opacity:1"], [s + FILM.spotlightLength - 0.5, "opacity:1", "ease"], [s + FILM.spotlightLength, "opacity:0"], [FILM.seconds, "opacity:0"]]]], { prefix: `bf-${bird}-props`, total: FILM.seconds, iterations: 1, hold: true }));
    }
  });

  css.push(tracksCss(FILM.sceneTracks(L), { prefix: "bf-scene", total: FILM.seconds, iterations: 1, hold: true }));
  body.push(`<div class="layer bf-sweep"></div>`);
  body.push(`<div class="layer bf-end"><div class="bf-mark">${drawable(kit.logo(L.mark))}</div><div class="bf-word">Krizaka</div><div class="bf-tag">Montréal · open source</div></div>`);
  body.push(`<div class="layer bf-endsweep"></div>`);

  return page({ kit, theme: "dark", width, height, css: css.join("\n"), body: body.join("\n") });
}

/** The Krizaka mark with its shield ready to draw itself: the stroked path gets `pathLength="1"` (WWW-HERO's intro does the same). */
export function drawable(svg) {
  const out = svg.replace(/<path d="([^"]*)" stroke="url\(/, '<path pathLength="1" d="$1" stroke="url(');
  if (out === svg) throw new Error("the mark has no stroked shield path to draw");
  return out;
}

/**
 * The home's ambient loop: the valley held still, the five on the ridge breathing and blinking, one small gesture each
 * in turn, a light across the valley once. No text. Its top and bottom melt into the page's surface (`theme`), so it
 * sits in the hero's backdrop instead of in a box. `birds: false` is the valley and its ridge alone — the home puts the live
 * `Flock` (krizaka-ui `Flock`) on it — and no phoenix: the Orazaka flamingo stands at the centre of that flock and would hide it.
 */
export function ambientHtml({ kit, aspect, theme = "dark", birds = true }) {
  const L = layout(aspect);
  const [width, height] = FILM.aspects[aspect];
  const k = AMBIENT.seconds / 8;
  const css = [`body { background: var(--kz-surface-0); }
.layer { position: absolute; inset: 0; }
.bf-world { transform-origin: 50% 0%; transform: scale(${L.world}); }
.bf-world .kzl * { animation: none !important; }
.bf-ridge { z-index: 2; }
.bf-actor { position: absolute; z-index: 1; }
.bf-actor svg { display: block; width: 100%; height: 100%; overflow: visible; }
.bf-sweep { z-index: 6; background: linear-gradient(105deg, transparent 38%, rgba(255,255,255,${theme === "light" ? ".22" : ".11"}) 50%, transparent 62%); mix-blend-mode: ${theme === "light" ? "soft-light" : "screen"}; transform: translateX(-110%); }
.bf-melt { z-index: 7; background: linear-gradient(to bottom, var(--kz-surface-0) 0%, color-mix(in srgb, var(--kz-surface-0) 55%, transparent) 14%, transparent 34%, transparent 82%, var(--kz-surface-0) 100%); }`];
  const body = [
    `<div class="layer bf-world">${kit.landscape({ tone: "own", flock: false, phoenix: birds && L.phoenix, animated: true, fade: false, position: "absolute" })}</div>`,
    `<svg class="layer bf-ridge" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><path d="${L.ridge}" fill="var(--kz-surface-0)"/><path d="${L.ridgeEdge}" stroke="${theme === "light" ? "rgba(0,0,0,.08)" : "rgba(255,255,255,.10)"}" stroke-width="2" fill="none"/></svg>`,
  ];
  (birds ? FILM.cast : []).forEach((bird, i) => {
    const a = L.actors[bird];
    const svg = dress(kit.mascot(bird), { view: birdLoops()[bird].view, uid: bird });
    body.push(`<div class="bf-actor bf-actor-${bird}" style="left:${a.x - a.size / 2}px; top:${a.y - a.size / 2}px; width:${a.size}px; height:${a.size}px">${svg}</div>`);
    const idle = IDLE.map(([sel, stops]) => [sel, stretch(stops, k), { delay: -0.97 * i }]);
    css.push(tracksCss([...idle, ...ambientGesture(AMBIENT.turns[bird])], { scope: `.bf-actor-${bird}`, prefix: `bf-${bird}`, total: AMBIENT.seconds }));
  });
  const [a, b] = AMBIENT.sweep;
  css.push(tracksCss([[".bf-sweep", [[0, "transform:translateX(-110%)"], [a, "transform:translateX(-110%)", EASE], [b, "transform:translateX(110%)"], [AMBIENT.seconds - 0.01, "transform:translateX(110%)"]]]], { prefix: "bf-sweep", total: AMBIENT.seconds }));
  body.push(`<div class="layer bf-sweep"></div>`, `<div class="layer bf-melt"></div>`);
  return page({ kit, theme, width, height, css: css.join("\n"), body: body.join("\n") });
}

/** One caption, burned in the social cuts: a transparent frame with the line on a quiet pill. */
export function captionHtml({ kit, aspect, text }) {
  const L = layout(aspect);
  const [width, height] = FILM.aspects[aspect];
  return page({
    kit,
    theme: "dark",
    width,
    height,
    css: `.cap { position: absolute; left: 50%; top: ${L.caption}px; transform: translate(-50%, -50%); max-width: ${L.captionMax}px; width: max-content;
  padding: ${Math.round(L.captionSize * 0.42)}px ${Math.round(L.captionSize * 0.8)}px; border-radius: 999px; background: rgba(9,9,12,.62);
  font-family: var(--kz-font-display); font-weight: 650; font-size: ${L.captionSize}px; line-height: 1.25; letter-spacing: -0.01em; color: #fff; text-align: center; text-wrap: balance; }`,
    body: `<div class="cap">${text.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</div>`,
  });
}

export { LOOP };
