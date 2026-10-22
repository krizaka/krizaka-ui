import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(import.meta.dirname, "blocks.css"), "utf8");
const brandsDir = join(import.meta.dirname, "..", "..", "tokens", "src", "brands");
const productIds = readdirSync(brandsDir)
  .map((file) => file.replace(".brand.json", ""))
  .filter((id) => id !== "krizaka");

describe("products wear plain Krizaka UI (no notebook ink)", () => {
  const rule = /:is\(([^)]*)\)\s*\{\s*--kz-paper-rule-margin:\s*var\(--kz-accent-text\);([^}]*)\}/.exec(css);

  it("re-inks the margin red with the brand's accent under every product brand, and only the products", () => {
    expect(rule).not.toBeNull();
    const listed = rule![1]!.split(",").map((item) => item.trim().replace(".brand-", "")).sort();
    expect(listed).toEqual([...productIds].sort());
  });

  it.each(["krizaka"])("leaves the %s brand (the notebook sites) on the margin red", (id) => {
    expect(rule![1]).not.toContain(`.brand-${id}`);
  });

  it("sets the heading face to the sans and the mono to a system monospace (no Young Serif, no Courier Prime)", () => {
    const body = rule![2]!.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(body).toContain("--kz-font-display: var(--kz-font-sans)");
    expect(body).toMatch(/--kz-font-mono: ui-monospace/);
    expect(body).not.toMatch(/Young Serif|Courier Prime/);
  });
});
