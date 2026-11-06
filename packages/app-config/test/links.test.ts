import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

// 2026-11-06: krizaka-platform-kit is a deleted repository; the Java twin of this package lives in krizaka-java, folder krizaka-service-kit (krizaka-build was renamed krizaka-java, platform-kit became service-kit in 0.12.0).
const read = (file: string) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

describe("the Java twin is linked where it lives", () => {
  it.each(["README.md", "AGENTS.md"])("%s does not link a deleted repository", (file) => {
    expect(read(file)).not.toMatch(/github\.com\/krizaka\/(krizaka-platform-kit|krizaka-build|krizaka-users|krizaka-notifications|krizaka-billing)(?![-\w])/);
  });

  it("the README names the krizaka-java folder", () => {
    expect(read("README.md")).toContain("https://github.com/krizaka/krizaka-java/tree/main/krizaka-service-kit/krizaka-app-config");
  });
});
