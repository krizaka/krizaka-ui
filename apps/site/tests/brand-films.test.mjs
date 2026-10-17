// The brand page's flock: every bird of @krizaka/ui has its loop on the CDN, in both themes, with its poster.
import assert from "node:assert/strict";
import { test } from "node:test";

import { MASCOT_BIRDS } from "../../../packages/ui/src/mascots/geometry.ts";
import { FLOCK, LOOP_HASHES, loopOf } from "../lib/brand-films.ts";

test("the page shows every bird of the flock", () => {
  assert.deepEqual([...FLOCK].sort(), [...MASCOT_BIRDS].sort());
});

test("every loop and its poster are named by their hash on the CDN, in both themes", () => {
  for (const bird of FLOCK) {
    for (const theme of ["dark", "light"]) {
      for (const ext of ["mp4", "jpg"]) assert.match(LOOP_HASHES[`${bird}-square-${theme}.${ext}`] ?? "", /^[0-9a-f]{10}$/, `${bird} ${theme} ${ext}`);
      const loop = loopOf(bird, theme);
      assert.match(loop.mp4, new RegExp(`^https://krizaka-assets\\.b-cdn\\.net/site/brand-films/loops/${bird}-square-${theme}\\.[0-9a-f]{10}\\.mp4$`));
      assert.match(loop.poster, /\.jpg$/);
    }
  }
});
