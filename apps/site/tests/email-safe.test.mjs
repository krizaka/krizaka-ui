// « @krizaka/ui@3.29.0 » in the changelog looks like an e-mail address to Cloudflare's Scrape Shield, which rewrote it
// into a link in the HTML it served: React saw a text that was not the one it rendered (error #418, production only).
// A version after a package name is therefore written with its « @ » in its own element, so no address-shaped run of text remains.
import assert from "node:assert/strict";
import { test } from "node:test";

import { splitAtSigns } from "../lib/email-safe.ts";

const joined = (parts) => parts.map((p) => (typeof p === "string" ? p : "@")).join("");
const addressShaped = (parts) => parts.some((p) => typeof p === "string" && /\S+@\S+\.\S+/.test(p));

test("a version after a package name has its @ apart, and the text reads the same", () => {
  const text = "Re-publish of 3.29.0: npm accepted @krizaka/ui@3.29.0 into staging, then hello@krizaka.com wrote.";
  const parts = splitAtSigns(text);
  assert.equal(joined(parts), text);
  assert.equal(addressShaped(parts), false);
  assert.ok(parts.some((p) => typeof p !== "string"));
});

test("a leading scope @ (« @krizaka/ui ») is left alone, and text without @ is one string", () => {
  assert.deepEqual(splitAtSigns("the @krizaka/ui package"), ["the @krizaka/ui package"]);
  assert.deepEqual(splitAtSigns("nothing here"), ["nothing here"]);
});
