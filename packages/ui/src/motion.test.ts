import { readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(import.meta.dirname, "motion.css"), "utf8");

describe("motion.css", () => {
  it("reads the accent instead of a hard-coded violet", () => {
    expect(css).not.toContain("rgba(168");
    expect(css).not.toContain("rgba(124");
  });

  it("mixes the spotlight and the lift shadow from --kz-accent, with a fallback for hosts without tokens", () => {
    expect(css).toContain("color-mix(in oklab, var(--kz-accent, #a855f7) 16%, transparent)");
    expect(css).toContain("color-mix(in oklab, var(--kz-accent, #7c3aed) 45%, transparent)");
  });
});
