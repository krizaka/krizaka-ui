import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";

/* One footer, one contentinfo: @krizaka/ui's SiteFooter, rendered once by the root after the page. No page or template
   renders another. */
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const walk = (dir) =>
  readdirSync(new URL(`../${dir}/`, import.meta.url)).flatMap((name) => {
    const rel = `${dir}/${name}`;
    return statSync(new URL(`../${rel}`, import.meta.url)).isDirectory() ? walk(rel) : [rel];
  });

test("the root renders the footer once", () => {
  assert.equal(read("app/components/SiteRoot.tsx").match(/<SiteFooter locale=\{locale\} \/>/g)?.length, 1);
});

test("no other file renders a footer", () => {
  const offenders = walk("app")
    .filter((f) => /\.tsx$/.test(f) && !/SiteFooter\.tsx$|SiteRoot\.tsx$/.test(f))
    .filter((f) => /<SiteFooter\b|<footer\b/.test(read(f)));
  assert.deepEqual(offenders, []);
});
