import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { test } from "node:test";

/* One footer, one contentinfo: the `FamilyFooter` block of @krizaka/ui, fed by `footerFor("ui")` of @krizaka/org
   (krizaka-internal#3562), rendered once by the root after the page. The site keeps no footer component of its own. */
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const walk = (dir) =>
  readdirSync(new URL(`../${dir}/`, import.meta.url)).flatMap((name) => {
    const rel = `${dir}/${name}`;
    return statSync(new URL(`../${rel}`, import.meta.url)).isDirectory() ? walk(rel) : [rel];
  });
const sources = ["app", "lib"].flatMap(walk).filter((f) => /\.(tsx?|mjs)$/.test(f));

test("the root renders the library's family footer once, from footerFor('ui')", () => {
  const root = read("app/components/SiteRoot.tsx");
  assert.equal(root.match(/<FamilyFooter\b/g)?.length, 1);
  assert.match(root, /import \{[^}]*\bFamilyFooter\b[^}]*\} from "@krizaka\/ui\/site-footer"/);
  assert.match(root, /footerFor\("ui"\)/);
});

test("GUARD: no local footer component comes back — no *Footer file, no <footer>, no SiteFooter of the app", () => {
  const named = sources.filter((f) => /Footer[^/]*\.(tsx?|mjs)$/.test(f));
  assert.deepEqual(named, [], "a footer is the library's block, not a file of the site");
  const elements = sources.filter((f) => f.endsWith(".tsx")).filter((f) => /<footer\b/.test(read(f)));
  assert.deepEqual(elements, []);
  const local = sources.filter((f) => /from "(\.\/|@\/app\/components\/)[^"]*Footer"/.test(read(f)));
  assert.deepEqual(local, []);
  const lib = sources.filter((f) => /<SiteFooter\b/.test(read(f)));
  assert.deepEqual(lib, [], "the family block, not a hand-assembled SiteFooter");
});

test("the footer's content is the org's: no family name, link, account or legal line typed in the site", () => {
  const root = read("app/components/SiteRoot.tsx");
  assert.doesNotMatch(root, /Fait à Montréal|Made in Montréal|Technologies Krizaka|instagram|linkedin|youtube|Apache|github\.com\/krizaka|Maven/i);
});

test("the org selects what ui shows: the family, the source, the licence, the legal links, the accounts, the version", async () => {
  const { footerFor } = await import("@krizaka/org");
  const f = footerFor("ui");
  assert.ok(f.groups.length > 0);
  assert.match(f.source ?? "", /^https:\/\/github\.com\/krizaka\/krizaka-ui/);
  assert.ok(f.license);
  assert.deepEqual(f.legal.map((l) => l.id), ["privacy", "terms"]);
  assert.match(f.social.find((x) => x.id === "instagram")?.url ?? "", /^https:\/\/www\.instagram\.com\/krizakahq\/?$/);
  assert.equal(f.version, true);
});

test("the footer's source label exists in both languages", () => {
  for (const lang of ["en", "fr"]) assert.ok(JSON.parse(read(`messages/${lang}.json`)).site.footer.source, lang);
});
