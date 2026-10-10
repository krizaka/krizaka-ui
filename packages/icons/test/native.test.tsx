import { render } from "@testing-library/react";
import { createElement, type ReactNode } from "react";

// react-native-svg as plain elements: the test checks what the native icon asks react-native-svg to draw.
vi.mock("react-native-svg", () => {
  const el = (tag: string) => (props: Record<string, unknown> & { children?: ReactNode }) => {
    const { children, ...rest } = props;
    const attrs = Object.fromEntries(Object.entries(rest).map(([k, v]) => [`data-${k.toLowerCase()}`, typeof v === "object" ? JSON.stringify(v) : String(v)]));
    return createElement(`x-${tag}`, attrs, children);
  };
  return { default: el("svg"), Path: el("path"), Circle: el("circle") };
});

const native = await import("../src/native/index");

describe("@krizaka/icons/native", () => {
  it("exports the web's names", async () => {
    const web = await import("../src/index");
    const names = (m: object) => Object.keys(m).filter((k) => /^[A-Z]\w*Icon$/.test(k)).sort();
    expect(names(native)).toEqual(names(web));
  });

  it("draws the glyph in the given colour, the node in nodeColor, hidden without title", () => {
    const { container } = render(<native.ChatIcon size={28} color="#111111" nodeColor="#f67e23" />);
    const svg = container.querySelector("x-svg")!;
    expect(svg.getAttribute("data-width")).toBe("28");
    expect(svg.getAttribute("data-accessibilityelementshidden")).toBe("true");
    expect(container.querySelector("x-path")?.getAttribute("data-stroke")).toBe("#111111");
    const node = [...container.querySelectorAll("x-circle")].at(-1)!;
    expect(node.getAttribute("data-fill")).toBe("#f67e23");
  });

  it("is an image with a title; the node follows color by default", () => {
    const { container } = render(<native.LockIcon title="Private" color="#222222" />);
    const svg = container.querySelector("x-svg")!;
    expect(svg.getAttribute("data-accessibilitylabel")).toBe("Private");
    expect(svg.getAttribute("data-accessibilityrole")).toBe("image");
    expect(container.querySelector("x-circle")?.getAttribute("data-fill")).toBe("#222222");
    expect(native.LockIcon.displayName).toBe("LockIcon");
  });

  it("draws stroked circles", () => {
    const { container } = render(<native.ClockIcon />);
    expect(container.querySelector("x-circle")?.getAttribute("data-fill")).toBe("none");
  });
});
