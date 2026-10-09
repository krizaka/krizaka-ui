import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as { exports: Record<string, unknown>; files: string[] };

describe("tailwind.css", () => {
  it("points Tailwind at the built package, so an app generates the primitives' classes", () => {
    expect(readFileSync(join(root, "tailwind.css"), "utf8")).toContain('@source "./dist";');
  });

  it("is exported and published", () => {
    expect(pkg.exports["./tailwind.css"]).toBe("./tailwind.css");
    expect(pkg.files).toContain("tailwind.css");
  });
});
