// /changelog on ui.krizaka.com: both languages, the template, the feed, the sitemap — and the footer's version link
// lands on an entry of the page (the bare @krizaka/ui version is an entry's id).
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const root = new URL("..", import.meta.url);
const read = (f) => readFileSync(new URL(f, root), "utf8");
const messages = (l) => JSON.parse(read(`messages/${l}.json`));

test("the changelog route and its feed exist in English and French, on the Changelog template", () => {
  for (const dir of ["app/(en)/changelog", "app/(fr)/fr/changelog"]) {
    assert.ok(existsSync(new URL(`${dir}/page.tsx`, root)), `${dir}/page.tsx`);
    assert.ok(existsSync(new URL(`${dir}/feed.xml/route.ts`, root)), `${dir}/feed.xml`);
  }
  assert.match(read("app/components/ChangelogView.tsx"), /<ChangelogPage\b/);
  assert.match(read("app/components/ChangelogView.tsx"), /loadReleases\(\)/);
});

test("the sitemap lists /changelog", () => {
  assert.match(read("app/sitemap.ts"), /"\/changelog"/);
});

test("the footer shows the installed @krizaka/ui version and links /changelog#<version> when that entry exists, else /changelog", async () => {
  const { changelogHref } = await import("../lib/changelog-link.ts");
  assert.equal(changelogHref("/changelog", "3.38.0", ["3.37.0", "3.38.0"]), "/changelog#3.38.0");
  assert.equal(changelogHref("/fr/changelog", "3.38.0", ["3.37.0"]), "/fr/changelog", "a release npm does not know yet has no entry: no dead anchor");
  const footer = read("app/components/SiteFooter.tsx");
  assert.match(footer, /changelogHref\(localePath\(locale, "\/changelog"\), packageVersion\("ui"\)/);
  assert.match(read("lib/changelog.ts"), /source === "@krizaka\/ui" \? r\.version/);
});

test("the latest @krizaka/ui version of the workspace is in its changelog (the entry the footer links)", () => {
  const md = read("../../packages/ui/CHANGELOG.md");
  const latest = /^## (\d+\.\d+\.\d+)/m.exec(md)?.[1];
  assert.ok(latest, "a version heading");
  const installed = JSON.parse(read("node_modules/@krizaka/ui/package.json")).version;
  assert.ok(md.includes(`## ${installed}`), `${installed} has a changelog entry`);
});

test("every changelog word exists in both languages", () => {
  for (const lang of ["en", "fr"]) {
    const m = messages(lang).site;
    for (const k of ["metaTitle", "title", "lead", "feed", "langTag", "feedTitle"]) assert.ok(m.changelog[k], `${lang}: ${k}`);
    for (const k of ["added", "changed", "fixed", "removed", "security", "breaking"]) assert.ok(m.changelog.kinds[k], `${lang}: kinds.${k}`);
    assert.ok(m.footer.changelog.includes("{version}"));
  }
});
