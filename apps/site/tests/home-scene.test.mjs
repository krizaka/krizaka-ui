// The home's scene (« Built with it »): the Orazaka window draws the rail the app really has, and its figures say they
// are a demo. lib/orazaka-nav.json is copied from the app's source (scripts/sync-orazaka-nav.mjs).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { buildNav, parseSections } from "../scripts/orazaka-nav-lib.mjs";

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const nav = JSON.parse(read("lib/orazaka-nav.json"));
const scene = (locale) => JSON.parse(read(`messages/${locale}.json`)).landing.scene;

const SECTIONS = `
  { id: AppSectionId.Home, href: "/", Icon: HomeIcon, paletteIcon: "dashboard", place: AppSectionPlace.Main },
  { id: AppSectionId.Studios, href: "/studios", Icon: StudioIcon, paletteIcon: "studio", place: AppSectionPlace.Main },
  { id: AppSectionId.Settings, href: "/settings", Icon: SettingsIcon, paletteIcon: "profile", place: AppSectionPlace.Foot },
  { id: AppSectionId.Admin, href: "/dashboard/admin", Icon: ShieldIcon, paletteIcon: "admin", place: AppSectionPlace.Foot, adminOnly: true },
`;
const WORDS = (w) => `appNav: { label: "S", home: "${w[0]}", studios: "${w[1]}", settings: "${w[2]}", admin: "A" },`;

test("the app's sections are read in order, Home is the mark and Admin is left out", () => {
  assert.deepEqual(parseSections(SECTIONS).map((s) => [s.id, s.place, s.adminOnly]), [["home", "main", false], ["studios", "main", false], ["settings", "foot", false], ["admin", "foot", true]]);
  const built = buildNav(SECTIONS, `${WORDS(["Home", "Studios", "Settings"])} ${WORDS(["Accueil", "Studios", "Paramètres"])}`);
  assert.deepEqual(built.main.map((s) => s.id), ["studios"]);
  assert.deepEqual(built.foot.map((s) => [s.id, s.icon, s.label.fr]), [["settings", "SettingsIcon", "Paramètres"]]);
});

test("the rail of the scene is the app's: Studios, Chat, Jobs, Plan, Usage, then Settings", () => {
  assert.deepEqual(nav.main.map((s) => s.id), ["studios", "chat", "jobs", "packs", "usage"]);
  assert.deepEqual(nav.foot.map((s) => s.id), ["settings"]);
  assert.equal(nav.main.find((s) => s.id === "packs").label.en, "Plan");
  for (const item of [...nav.main, ...nav.foot]) assert.ok(item.label.en && item.label.fr && /Icon$/.test(item.icon), item.id);
});

test("the Orazaka window uses RailNav and the app's list, with real icons, not a placeholder square or its own labels", () => {
  const src = read("app/components/landing/ProductScene.tsx");
  assert.match(src, /@krizaka\/ui\/rail-nav/);
  assert.match(src, /orazaka-nav\.json/);
  assert.doesNotMatch(src, /AppShell\.Sidebar|<rect x="4" y="4"/);
  for (const locale of ["en", "fr"]) assert.equal(scene(locale).products.orazaka.nav, undefined, `${locale}: the Orazaka labels come from the app`);
});

test("every icon the rail names is one the scene can draw", () => {
  const icons = read("app/components/landing/scene-icons.ts");
  for (const item of [...nav.main, ...nav.foot]) assert.match(icons, new RegExp(`\\b${item.icon}\\b`), item.icon);
});

test("the figures are labelled demo data in both languages, on the window", () => {
  for (const locale of ["en", "fr"]) assert.ok(scene(locale).demo.trim().length > 0, locale);
  assert.match(read("app/components/landing/ProductScene.tsx"), /words\.demo/);
});

test("the scene's words carry no em dash", () => {
  for (const locale of ["en", "fr"]) assert.doesNotMatch(JSON.stringify(scene(locale)), /—/, locale);
});

test("the scene's labels are not set in capitals", () => {
  assert.match(read("app/globals.css"), /\.kz-scene[^{]*\{[^}]*text-transform:\s*none/);
});
