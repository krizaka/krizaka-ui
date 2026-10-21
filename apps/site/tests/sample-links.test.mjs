// The links and forms inside a documentation example are samples: they go nowhere (a pagination's « page 6 » led to a
// 404 of the docs site, a search field's Enter to /explore). Only a link to another site keeps working.
import assert from "node:assert/strict";
import { test } from "node:test";

import { staysInPlace } from "../lib/sample-links.ts";

const here = "https://ui.krizaka.com";

test("a sample link stays in place: anchors, paths, queries and the docs' own absolute addresses", () => {
  for (const href of ["#", "#docs", "/explore?q=sunset&page=6", "settings/account", "https://ui.krizaka.com/docs/start", "?page=2", ""])
    assert.equal(staysInPlace(href, here), true, href);
});

test("a link to another site, a mail or a phone number keeps working", () => {
  for (const href of ["https://github.com/krizaka/krizaka-ui", "mailto:hello@krizaka.com", "tel:+15145550100", "https://www.npmjs.com/package/@krizaka/ui"])
    assert.equal(staysInPlace(href, here), false, href);
});

test("a form posting to another site keeps working; a form without an action stays in place", () => {
  assert.equal(staysInPlace(null, here), true);
  assert.equal(staysInPlace("https://example.com/search", here), false);
});
