import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// ui.krizaka.com in the Cahier (ADR-004, #417): the site's own stylesheet carries none of the template tells — no
// uppercase tracked label, no blurred aura or frosted dock, no radial glow, no round card. Device frames (a phone's
// corners) and the stage's dot texture are drawings of objects, not tells.
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const OBJECTS = /^\s*(\.kz-phone|\.kz-scene-phone|\.kz-scene-screen|\.kz-phone-screen|\.kz-wall \.kz-phone|\.kz-phone\[data-os)/;

function rules() {
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ selector: m[1].trim(), body: m[2] }));
}

test("no uppercase or tracked label", () => {
  for (const r of rules()) {
    assert.doesNotMatch(r.body, /text-transform:\s*uppercase/, r.selector);
    assert.doesNotMatch(r.body, /letter-spacing:\s*0?\.(0[5-9]|[1-9])/, r.selector);
  }
});

test("no blur, frosted glass or radial glow", () => {
  for (const r of rules()) {
    assert.doesNotMatch(r.body, /blur\(|backdrop-filter/, r.selector);
    if (!/circle at 1px 1px/.test(r.body)) assert.doesNotMatch(r.body, /radial-gradient/, r.selector);
  }
});

test("square paper: no card corner of 10 px or more, except the drawn devices", () => {
  for (const r of rules()) {
    if (OBJECTS.test(r.selector)) continue;
    assert.doesNotMatch(r.body, /border-radius:\s*(1\d|[2-9]\d)px/, r.selector);
  }
});
