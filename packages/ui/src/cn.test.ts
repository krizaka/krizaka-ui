import { cn, twMergeConfig } from "./cn";

describe("cn", () => {
  it("joins, skips the falsy values and lets the last conflicting class win", () => {
    expect(cn("px-2 py-1", false, null, undefined, ["text-sm", { "font-bold": true, italic: false }], "px-4")).toBe(
      "py-1 text-sm font-bold px-4",
    );
  });

  it("knows the preset's roles: a text colour does not remove a text size", () => {
    expect(cn("text-sm text-fg", "text-fg-secondary")).toBe("text-sm text-fg-secondary");
    expect(cn("bg-surface-1", "bg-accent")).toBe("bg-accent");
  });
});

describe("cn — the Krizaka material (twMergeConfig)", () => {
  it("keeps a surface colour under the sheen, a background image", () => {
    expect(cn("bg-surface-2 bg-sheen")).toBe("bg-surface-2 bg-sheen");
    expect(cn("bg-sheen", "bg-none")).toBe("bg-none");
  });

  it("lets a product's shadow replace a signature shadow, and an inset shadow another", () => {
    expect(cn("shadow-raised", "shadow-none")).toBe("shadow-none");
    expect(cn("shadow-glow", "shadow-floating")).toBe("shadow-floating");
    expect(cn("inset-shadow-edge", "inset-shadow-well")).toBe("inset-shadow-well");
  });

  it("exports the class groups for a product's own merge", () => {
    expect(twMergeConfig.extend.classGroups.shadow[0].shadow).toContain("raised");
  });
});
