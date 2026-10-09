import { cn } from "./cn";

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
