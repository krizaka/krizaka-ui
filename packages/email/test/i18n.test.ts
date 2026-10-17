import path from "node:path";

import { checkMessages } from "@krizaka/i18n/check";
import { describe, expect, it } from "vitest";

describe("catalogues", () => {
  it("pass the same check as every Krizaka app: same keys, no empty string, same placeholders and markup, no unused key", () => {
    const result = checkMessages({ dir: path.join(__dirname, "../messages"), unused: [path.join(__dirname, "../src")] });
    expect(result.problems).toEqual([]);
    expect(result.locales).toEqual(["en", "fr"]);
  });
});
