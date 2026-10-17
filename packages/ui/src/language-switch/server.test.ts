import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { languageHref, languagesFor } from "./server";

describe("@krizaka/ui/language-switch/server", () => {
  it("builds the languages for a page, each named in its own language", () => {
    expect(languagesFor("/fr/baux?x=1#a")).toEqual([
      { code: "en", name: "English", href: "/en/baux?x=1#a" },
      { code: "fr", name: "Français", href: "/fr/baux?x=1#a" },
    ]);
    expect(languageHref("/baux", "fr")).toBe("/fr/baux");
  });

  it("imports no React and is not a client module", () => {
    for (const file of ["server.ts", "href.ts"]) {
      const source = readFileSync(resolve(__dirname, file), "utf8");
      expect(source).not.toMatch(/from "react"|^["']use client["']/m);
    }
  });

  it("is built without the client banner (a Server Component can import it)", () => {
    const dist = resolve(__dirname, "../../dist/language-switch/server.js");
    let built: string | undefined;
    try {
      built = readFileSync(dist, "utf8");
    } catch {
      return; // not built in this run: the build check of CI covers it
    }
    expect(built).not.toMatch(/^\s*["']use client["']/);
  });
});
