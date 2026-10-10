// The registry's web examples render, without an axe violation: what krizaka.com shows and what the stories show.
// (The React Native examples are rendered by Jest: src/native/examples.test.tsx.)
import { readdirSync } from "node:fs";
import { join } from "node:path";

import { render } from "@testing-library/react";
import type * as React from "react";

import { axeViolations } from "./test/axe";

const root = join(import.meta.dirname, "..", "registry", "examples");
const names = readdirSync(root, { recursive: true, encoding: "utf8" })
  .filter((file) => /^[^/]+\/[^/]+\.tsx$/.test(file))
  .map((file) => file.replace(/\.tsx$/, ""))
  .sort();

describe("registry examples (web)", () => {
  it("finds the examples", () => expect(names.length).toBeGreaterThan(30));

  it.each(names)("%s renders, with no axe violation", async (name) => {
    const { default: Example } = (await import(/* @vite-ignore */ join(root, `${name}.tsx`))) as { default: React.ComponentType };
    const { container } = render(<Example />);
    expect(container.firstChild).not.toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });
});
