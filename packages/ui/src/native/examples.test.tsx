// The registry's React Native examples (registry/examples/<name>/native/*.tsx) render in React Native's renderer,
// inside the app's ThemeProvider: the code krizaka.com/docs/ui gives to copy runs as written.
import { readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "@jest/globals";
import { render } from "@testing-library/react-native";
import * as React from "react";

import { ThemeProvider } from "./theme";

const root = join(__dirname, "..", "..", "registry", "examples");
const files = readdirSync(root, { recursive: true, encoding: "utf8" })
  .filter((file) => /\/native\/[^/]+\.tsx$/.test(file))
  .sort();

describe("registry examples (native)", () => {
  test("finds the examples", () => expect(files.length).toBeGreaterThan(10));

  test.each(files)("%s renders", async (file) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest runs CommonJS: one require per example.
    const { default: Example } = require(join(root, file)) as { default: React.ComponentType };
    const { toJSON } = await render(
      <ThemeProvider mode="dark">
        <Example />
      </ThemeProvider>,
    );
    expect(toJSON()).not.toBeNull();
  });
});
