import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

// 2026-11-06: krizaka-platform-kit is a deleted repository; the Java twin of this package lives in krizaka-build (ADR-021).
const read = (file: string) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

describe("the Java twin is linked where it lives", () => {
  it.each(["README.md", "AGENTS.md"])("%s does not link a deleted repository", (file) => {
    expect(read(file)).not.toMatch(/github\.com\/krizaka\/(krizaka-platform-kit|krizaka-users|krizaka-notifications|krizaka-billing)(?![-\w])/);
  });

  it("the README names the krizaka-build folder", () => {
    expect(read("README.md")).toContain("https://github.com/krizaka/krizaka-build/tree/main/krizaka-platform-kit/krizaka-app-config");
  });
});
