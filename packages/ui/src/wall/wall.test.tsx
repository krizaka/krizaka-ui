import { readFileSync } from "node:fs";

import { act, fireEvent, render, screen, within } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { PinnedNote, Polaroid, ShopSign, Wall, type WallItem } from "./index";

const items: WallItem[] = [
  { id: "late", kind: "note", x: 70, y: 40, rotation: 4, z: 3, text: "Last" },
  { id: "first", kind: "sign", x: 10, y: 20, rotation: -2, z: 1, logo: "First" },
  { id: "second", kind: "note", x: 30, y: 60, rotation: 0, z: 1, text: "Second" },
];

let intersect: IntersectionObserverCallback;
let preference: (event: MediaQueryListEvent) => void;
const disconnect = vi.fn();
function motion(reduced = false) {
  const query = {
    matches: reduced,
    addEventListener: (_: string, cb: typeof preference) => { preference = (event) => { query.matches = event.matches; cb(event); }; },
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal("matchMedia", vi.fn(() => query));
  vi.stubGlobal("IntersectionObserver", class {
    constructor(cb: IntersectionObserverCallback) { intersect = cb; }
    observe = vi.fn();
    disconnect = disconnect;
  });
}

afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });

describe("Wall", () => {
  it("sorts a real focusable list stably by z without mutating its data", async () => {
    const { container } = render(<Wall aria-label="Our wall" items={items} />);
    const list = screen.getByRole("list", { name: "Our wall" });
    const entries = within(list).getAllByRole("listitem");
    expect(entries.map((item) => item.textContent)).toEqual(["First", "Second", "Last"]);
    expect(entries.every((item) => item.tabIndex === 0)).toBe(true);
    expect(items.map((item) => item.id)).toEqual(["late", "first", "second"]);
    expect(entries[0].style.getPropertyValue("--kz-wall-x")).toBe("10%");
    expect(entries[0].style.getPropertyValue("--kz-wall-y")).toBe("20%");
    expect(entries[0].style.getPropertyValue("--kz-wall-rotation")).toBe("-2deg");
    expect(entries[0].style.zIndex).toBe("1");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("renders every texture deterministically and gives each SVG pattern a unique id", () => {
    const { container, rerender } = render(<Wall items={items} texture="brick" />);
    expect(container.firstElementChild?.getAttribute("data-texture")).toBe("brick");
    for (const texture of ["zellige", "ridge", "plaster"] as const) {
      rerender(<Wall items={items} texture={texture} />);
      expect(container.firstElementChild?.getAttribute("data-texture")).toBe(texture);
    }
    rerender(<><Wall items={[]} texture="zellige" /><Wall items={[]} texture="zellige" /></>);
    const ids = [...container.querySelectorAll("pattern")].map((p) => p.id);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
  });

  it("clamps invalid coordinates and uses documented layout props rather than caller styles", () => {
    const { container } = render(<Wall items={[{ ...items[0], x: -5, y: 120 }]} height={640} itemWidth={240} />);
    const item = screen.getByRole("listitem");
    expect(item.style.getPropertyValue("--kz-wall-x")).toBe("0%");
    expect(item.style.getPropertyValue("--kz-wall-y")).toBe("100%");
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue("--kz-wall-height")).toBe("640px");
  });

  it("stacks the same DOM order on phones and disables all motion under reduced motion", () => {
    const css = readFileSync("src/blocks.css", "utf8");
    expect(css).toMatch(/@media\s*\(min-width:\s*48rem\)/);
    expect(css).toMatch(/\.kz-wall-item\s*\{[^}]*position:\s*relative/);
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(css).toMatch(/\.kz-polaroid-photo[^}]*animation:\s*none/);
  });
});

describe("wall objects", () => {
  it("develops a slotted image on its first intersection only, and cleans up", () => {
    motion();
    const { container, unmount } = render(<Polaroid img={<img alt="Workshop" src="/photo.jpg" />} caption="Our first day" attachment="tape" attachmentRotation={8} rotation={-3} />);
    const figure = container.querySelector("figure")!;
    expect(screen.getByAltText("Workshop")).toBeTruthy();
    expect(figure.getAttribute("data-develop")).toBe("waiting");
    act(() => intersect([{ isIntersecting: false }] as IntersectionObserverEntry[], {} as IntersectionObserver));
    expect(figure.getAttribute("data-develop")).toBe("waiting");
    act(() => intersect([{ isIntersecting: true }] as IntersectionObserverEntry[], {} as IntersectionObserver));
    expect(figure.getAttribute("data-develop")).toBe("ready");
    expect(disconnect).toHaveBeenCalled();
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(2);
  });

  it("leaves photos sharp without observer support or with reduced motion, including a preference change", () => {
    motion(true);
    const { container, unmount } = render(<Polaroid img={<span>Photo</span>} caption="Still" />);
    expect(container.querySelector("figure")?.getAttribute("data-develop")).toBeNull();
    unmount();
    motion();
    const next = render(<Polaroid img={<span>Photo</span>} caption="Still" />);
    act(() => preference({ matches: true } as MediaQueryListEvent));
    expect(next.container.querySelector("figure")?.getAttribute("data-develop")).toBeNull();
    next.unmount();
    vi.stubGlobal("IntersectionObserver", undefined);
    const fallback = render(<Polaroid img={<span>Photo</span>} />);
    expect(fallback.container.querySelector("figure")?.getAttribute("data-develop")).toBeNull();
  });

  it("keeps notes short by Unicode characters, with signature and a cut corner", () => {
    const { container } = render(<PinnedNote text={"💌".repeat(141)} signature="Sam" attachment="pin" />);
    expect(Array.from(container.querySelector(".kz-pinned-note-text")!.textContent!)).toHaveLength(140);
    expect(screen.getByText("Sam")).toBeTruthy();
    expect(container.querySelector("[data-shape=cut]")).toBeTruthy();
  });

  it.each(["enamel", "neon", "painted"] as const)("renders the %s sign with the caller's accessible logo", async (variant) => {
    const { container } = render(<ShopSign variant={variant} logo={<svg role="img" aria-label="Atelier"><path d="M0 0h10v10Z" /></svg>} />);
    expect(screen.getByRole("img", { name: "Atelier" })).toBeTruthy();
    expect(container.querySelector("[data-variant]")?.getAttribute("data-variant")).toBe(variant);
    expect(container.querySelectorAll(".kz-shop-sign-screw")).toHaveLength(variant === "enamel" ? 4 : 0);
    fireEvent.focus(container.firstElementChild!);
    expect(await axeViolations(container)).toEqual([]);
  });
});
