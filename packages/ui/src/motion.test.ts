import { readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(import.meta.dirname, "motion.css"), "utf8");

describe("motion.css", () => {
  it("reads the accent instead of a hard-coded violet", () => {
    expect(css).not.toContain("rgba(168");
    expect(css).not.toContain("rgba(124");
  });

  it("retires the spotlight, the lift, the sheen and the magnet (krizaka-ui#393)", () => {
    for (const gone of [".kz-spotlight", ".kz-lift", ".kz-sheen", "[data-kz-magnetic]", "kz-glow-turn"]) expect(css).not.toContain(`${gone} {`);
    expect(css).not.toMatch(/kz-sheen-sweep|kz-glow-turn/);
  });
});
