import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { MASCOT_BIRDS } from "./geometry";
import { birdLifeCss, CHARACTERS, HEAD_PIVOT, lifeCss, phaseOf, sharedLifeCss } from "./life";

describe("the life of the flock", () => {
  it("gives every bird a character, a pivot on the 120 grid and well-formed keyframes", () => {
    for (const bird of MASCOT_BIRDS) {
      const [x, y] = HEAD_PIVOT[bird];
      expect(x > 0 && x < 120 && y > 0 && y < 120).toBe(true);
      const css = birdLifeCss(bird);
      for (const name of ["head", "lid", "flutter"]) expect(css).toContain(`@keyframes kzb-${bird}-${name}`);
      expect(css).toContain(`svg[data-bird="${bird}"]{--kzb-pivot:${x}px ${y}px`);
      // Braces balance: a stray one would swallow the rules after it.
      expect(css.split("{").length).toBe(css.split("}").length);
      expect(CHARACTERS[bird].head.seconds).toBeGreaterThan(0);
    }
    expect(sharedLifeCss().split("{").length).toBe(sharedLifeCss().split("}").length);
  });

  it("keeps the birds in character: the falcon scans, the owl blinks twice, the duck nods in bursts, the pigeon bobs", () => {
    expect(CHARACTERS.owl.blink.frames.match(/scaleY\(\.08\)/g)).toHaveLength(2);
    expect(CHARACTERS.falcon.blink.seconds).toBeGreaterThan(CHARACTERS.duck.blink.seconds);
    expect(CHARACTERS.duck.head.frames).toMatch(/\d+%(,\d+%){2}\{transform:translate\(0px,2px\)/); // three nods in a burst
    expect(CHARACTERS.pigeon.head.seconds).toBeLessThan(4);
    expect(birdLifeCss("pigeon")).toContain("--kzb-parcel-a");
    expect(birdLifeCss("owl")).not.toContain("--kzb-parcel-a");
  });

  it("only the leaping birds hop", () => {
    for (const bird of MASCOT_BIRDS) expect(birdLifeCss(bird).includes("@keyframes kzb-" + bird + "-leap")).toBe(CHARACTERS[bird].hop.seconds > 0);
  });

  it("holds every motion still under reduced motion", () => {
    expect(sharedLifeCss()).toMatch(/prefers-reduced-motion:reduce\)\{[^}]*\.kzb-head/);
  });

  it("is what blocks.css carries (run `node scripts/gen-mascot-life.mjs` after a change)", () => {
    const blocks = readFileSync(resolve(process.cwd(), "src/blocks.css"), "utf8");
    const from = blocks.indexOf("/* mascot-life:begin");
    const section = blocks.slice(blocks.indexOf("\n", from) + 1, blocks.indexOf("\n/* mascot-life:end */"));
    expect(section).toBe(lifeCss());
  });

  it("derives a stable phase in [0, 1) from an id", () => {
    expect(phaseOf("a")).toBe(phaseOf("a"));
    expect(phaseOf("a")).not.toBe(phaseOf("b"));
    for (const id of ["", "x", "r1", "é"]) {
      expect(phaseOf(id)).toBeGreaterThanOrEqual(0);
      expect(phaseOf(id)).toBeLessThan(1);
    }
  });
});
