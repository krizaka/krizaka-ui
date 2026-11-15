import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandLogo } from "./BrandLogo";

const read = (file: string) => readFileSync(new URL(file, import.meta.url), "utf8");

describe("BrandLogo keeps Kridoc out of the shared chrome (krizaka-ui#837 budget)", () => {
  it("draws the four brands", () => {
    for (const id of ["krizaka", "sovkora", "verikora", "folioviv"] as const) {
      expect(render(<BrandLogo id={id} />).container.querySelector("svg")).not.toBeNull();
    }
  });
  it.each(["./BrandLogo.tsx", "../family-mark.tsx", "../site-footer/site-footer.tsx"])("%s never imports the crane", (file) => {
    expect(read(file)).not.toMatch(/^import .*(Kridoc|ProductLogo)/m);
  });
});
