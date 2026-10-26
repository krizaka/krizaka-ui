// The native form ships on its own entry, `@krizaka/ui/native/form` (#380): its field names (Checkbox, Switch, Select…) are the
// primitives' names in the root, so the root cannot re-export them, and the form engine stays out of every app that has no form.
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "@jest/globals";

import * as nativeForm from "./form";

const root = join(__dirname, "..", "..");
const read = (file: string) => readFileSync(join(root, file), "utf8");

const FUNCTIONS = [
  "createKrizakaForm", "TextField", "TextArea", "Checkbox", "Switch", "RadioGroup", "Select", "Combobox", "DateField", "Money", "Slider",
  "FormField", "FieldArray", "Watch", "Submit", "FormError", "useFormContext", "useFormStatus", "useFormValue", "useKrizakaField", "useKrizakaFieldArray",
];

describe("@krizaka/ui/native/form", () => {
  test("exposes the factory, every field, the hooks and the helpers", () => {
    for (const name of FUNCTIONS) expect(typeof (nativeForm as Record<string, unknown>)[name]).toBe("function");
    expect(typeof nativeForm.latestBirthDate).toBe("function");
    expect(typeof nativeForm.formMessages).not.toBe("undefined");
  });

  test("is built and published as its own subpath", () => {
    const pkg = JSON.parse(read("package.json")) as { exports: Record<string, { import: string; types: string }> };
    expect(pkg.exports["./native/form"]).toEqual({ types: "./dist/native/form.d.ts", import: "./dist/native/form.js" });
    expect(read("tsup.config.ts")).toContain('"native/form": "src/native/form.tsx"');
  });

  test("the root entry says where the form lives, and does not shadow the primitives with the form fields", () => {
    const index = read("src/native/index.ts");
    expect(index).toContain("@krizaka/ui/native/form");
    expect(index).not.toMatch(/from "\.\/form"/);
  });
});
