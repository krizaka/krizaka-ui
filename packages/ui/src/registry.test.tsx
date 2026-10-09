// The registry's demos render, without an axe violation: what krizaka.com shows (and what the default stories show).
import { readdirSync } from "node:fs";
import { join } from "node:path";

import { render } from "@testing-library/react";
import type * as React from "react";

import { axeViolations } from "./test/axe";

const dir = join(import.meta.dirname, "..", "registry", "demos");
const names = readdirSync(dir)
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.replace(/\.tsx$/, ""));

describe("registry demos", () => {
  it.each(names)("%s renders, with no axe violation", async (name) => {
    const { default: Demo } = (await import(`../registry/demos/${name}.tsx`)) as { default: React.ComponentType };
    const { container } = render(<Demo />);
    expect(container.firstChild).not.toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });
});
