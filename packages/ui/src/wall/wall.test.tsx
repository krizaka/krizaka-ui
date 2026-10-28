import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

import { themes } from "@krizaka/tokens/native";
import { act, fireEvent, render, screen, within } from "@testing-library/react";

import FrenchCompositionExample from "../../registry/examples/wall/composition-fr";
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
  it("demonstrates a self-contained composed French wall", () => {
    render(<FrenchCompositionExample />);
    expect(screen.getByRole("list", { name: "Dans notre atelier" })).toBeTruthy();
    expect(screen.getByText("La vue d’ici")).toBeTruthy();
    expect(screen.getByText("Fait avec patience. Partagé avec plaisir.")).toBeTruthy();
    expect(screen.getByRole("img", { name: "La montagne au-dessus de notre atelier" })).toBeTruthy();
    expect(screen.queryByText("Made slowly. Shared gladly.")).toBeNull();
  });
  it("sorts a real focusable list stably by z without mutating its data", async () => {
    const { container } = render(<Wall aria-label="Our wall" items={items} />);
    const list = screen.getByRole("list", { name: "Our wall" });
    expect(list.getAttribute("role")).toBe("list");
    const entries = within(list).getAllByRole("listitem");
    expect(entries.map((item) => item.textContent)).toEqual(["First", "Second", "Last"]);
    expect(entries.every((item) => item.tabIndex === 0)).toBe(true);
    expect(items.map((item) => item.id)).toEqual(["late", "first", "second"]);
    expect(entries[0].style.getPropertyValue("--kz-wall-x")).toBe("10%");
    expect(entries[0].style.getPropertyValue("--kz-wall-y")).toBe("20%");
    expect(entries[0].style.getPropertyValue("--kz-wall-rotation")).toBe("-2deg");
    expect(entries[0].style.zIndex).toBe("0");
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

  it("sanitizes non-finite z values before stable sorting and rendering", () => {
    render(<Wall items={[
      { ...items[0], z: Number.NaN },
      { ...items[1], z: Number.POSITIVE_INFINITY },
      { ...items[2], z: -1 },
    ]} />);
    const entries = screen.getAllByRole("listitem");
    expect(entries.map((item) => item.textContent)).toEqual(["Second", "Last", "First"]);
    expect(entries.map((item) => item.style.zIndex)).toEqual(["0", "1", "2"]);
  });

  it.each(["ridge", "zellige"] as const)("keeps negative and fractional z items above the %s decoration", (texture) => {
    render(<Wall texture={texture} items={items.map((item, index) => ({ ...item, z: [-1, -20, -1.5][index]! }))} />);
    const entries = screen.getAllByRole("listitem");
    expect(entries.map((item) => item.textContent)).toEqual(["First", "Second", "Last"]);
    expect(entries.map((item) => item.style.zIndex)).toEqual(["0", "1", "2"]);
  });

  it("stacks the same DOM order on phones and disables all motion under reduced motion", () => {
    const css = readFileSync("src/blocks.css", "utf8");
    expect(css).toMatch(/@media\s*\(min-width:\s*48rem\)/);
    expect(css).toMatch(/\.kz-wall-item\s*\{[^}]*position:\s*relative/);
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(css).toMatch(/\.kz-polaroid-photo[^}]*animation:\s*none/);
  });

  it("uses published token roles for every wall colour and material", () => {
    const require = createRequire(`${process.cwd()}/package.json`);
    const tokens = readFileSync(require.resolve("@krizaka/tokens/tokens.css"), "utf8");
    const css = readFileSync("src/blocks.css", "utf8").split("/* ─── Wall:")[1]!.split("/* ─── Page:")[0]!;
    const svg = readFileSync("src/wall/wall.tsx", "utf8");
    // `--kz-hue-text` is the page's hue (set by the host's data-hue, with a published fallback), not a published token.
    const roles = [...(css + svg).matchAll(/var\((--kz-[\w-]+)/g)].map((match) => match[1]!);
    const localRoles = new Set([...css.matchAll(/(--kz-[\w-]+)\s*:/g)].map((match) => match[1]!));
    for (const role of new Set(roles.filter((name) => !name.startsWith("--kz-wall-") && name !== "--kz-note-lines" && !localRoles.has(name) && name !== "--kz-hue-text"))) {
      expect(tokens, `${role} must exist in the published tokens CSS`).toContain(`${role}:`);
    }
  });

  it("keeps brick terracotta across brands, warms plaster, and leaves phone items untilted", () => {
    const css = readFileSync("src/blocks.css", "utf8");
    const brick = css.split('.kz-wall[data-texture="brick"] {')[1]!.split("}")[0]!;
    const plaster = css.split('.kz-wall[data-texture="plaster"] {')[1]!.split("}")[0]!;
    const phoneItem = css.split(".kz-wall-item {")[1]!.split("}")[0]!;
    expect(brick).toContain("var(--kz-paper-rule-margin)");
    expect(brick).not.toContain("var(--kz-accent");
    expect(plaster).toContain("var(--kz-paper-tag)");
    expect(phoneItem).toContain("transform: none");
  });

  it("reuses the taped print and caption styles rather than drawing a second print", () => {
    const css = readFileSync("src/blocks.css", "utf8");
    expect(css).not.toContain("--kz-polaroid-paper");
    render(<Polaroid img={<span>Photo</span>} caption="Caption" rotation={-3} attachmentRotation={8} />);
    const figure = screen.getByRole("figure");
    expect(figure.classList.contains("kz-taped")).toBe(true);
    expect(figure.getAttribute("data-tape")).toBe("top");
    expect(figure.style.getPropertyValue("--kz-taped-tilt")).toBe("-3deg");
    expect(figure.style.getPropertyValue("--kz-wall-attachment-rotation")).toBe("8deg");
    expect(figure.querySelector(".kz-taped-caption")?.textContent).toBe("Caption");
    expect(figure.querySelector(".kz-wall-tape")).toBeNull();
  });

  it("disables TapedPhoto tape when a pin holds the Polaroid", () => {
    const { container } = render(<Polaroid img={<span>Photo</span>} attachment="pin" />);
    expect(container.querySelector("figure")?.getAttribute("data-tape")).toBe("none");
    expect(container.querySelectorAll(".kz-wall-pin")).toHaveLength(1);
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

  it("fits a shop sign's text to its width instead of cutting or hyphenating a word", () => {
    const css = readFileSync("src/blocks.css", "utf8").split("/* ─── Wall:")[1]!.split("/* ─── Page:")[0]!;
    const sign = css.split(".kz-shop-sign {")[1]!.split("}")[0]!;
    const logo = css.split(".kz-shop-sign-logo {")[1]!.split("}")[0]!;
    expect(sign).toContain("container-type: inline-size");
    expect(sign).toContain("overflow-wrap: normal");
    expect(sign).not.toMatch(/hyphens:\s*auto|overflow-wrap:\s*(anywhere|break-word)/);
    expect(logo).toMatch(/font:\s*min\(1\.75rem,\s*\d+cqi\)/);
    expect(logo).toContain("overflow-wrap: normal");
    render(<Wall itemWidth={220} items={[{ id: "s", kind: "sign", x: 50, y: 50, z: 1, logo: "Neighbourhood workshop" }]} />);
    expect(screen.getByText("Neighbourhood workshop").className).toContain("kz-shop-sign-logo");
  });

  it("paints a white Polaroid frame in both themes, and keeps every wall rank above the decoration", () => {
    const css = readFileSync("src/blocks.css", "utf8").split("/* ─── Wall:")[1]!.split("/* ─── Page:")[0]!;
    const frame = css.split(".kz-polaroid.kz-taped, :root:not(.light) .kz-polaroid.kz-taped {")[1]!.split("}")[0]!;
    expect(frame).toMatch(/--kz-print:\s*hsl\(0 0% 100%\)/);
    expect(frame).toContain("padding-bottom");
    expect(css).toMatch(/\.kz-wall-decoration\s*\{[^}]*z-index:\s*-1/);
    render(<Wall texture="brick" items={[{ ...items[0]!, z: -50 }, { ...items[1]!, z: -3 }]} />);
    const ranks = screen.getAllByRole("listitem").filter((li) => li.classList.contains("kz-wall-item")).map((li) => Number(li.style.zIndex));
    expect(ranks.every((rank) => rank >= 0)).toBe(true);
  });
});

describe("the wall's addendum (krizaka-ui#604)", () => {
  const wallCss = () => readFileSync("src/blocks.css", "utf8").split("/* ─── Wall:")[1]!.split("/* ─── Page:")[0]!;

  it("ShopSign renders its text children as the page's heading, live text, with the logo optional", async () => {
    const { container } = render(<ShopSign>Cèdre &amp; Ciseaux</ShopSign>);
    expect(screen.getByRole("heading", { level: 1, name: "Cèdre & Ciseaux" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("ShopSign takes another heading level or none, and keeps a logo beside the name", () => {
    const { rerender } = render(<ShopSign as="h2">Atelier</ShopSign>);
    expect(screen.getByRole("heading", { level: 2, name: "Atelier" })).toBeTruthy();
    rerender(<ShopSign as="p">Atelier</ShopSign>);
    expect(screen.queryByRole("heading")).toBeNull();
    rerender(<ShopSign logo={<img alt="" src="/l.png" />}>Atelier</ShopSign>);
    expect(screen.getByRole("heading", { name: "Atelier" }).closest(".kz-shop-sign")?.querySelector("img")).toBeTruthy();
  });

  it('offers the variant "none": the name alone on paper, with no plate and no screws', () => {
    const { container } = render(<ShopSign variant="none">Atelier</ShopSign>);
    expect(container.querySelector("[data-variant]")?.getAttribute("data-variant")).toBe("none");
    expect(container.querySelectorAll(".kz-shop-sign-screw")).toHaveLength(0);
    expect(wallCss()).toMatch(/\.kz-wall \.kz-shop-sign\[data-variant="none"\]\s*\{[^}]*background:\s*var\(--kz-surface-0\)/);
  });

  it("the neon flickers once, on its first view, and never loops", () => {
    motion();
    const { container, unmount } = render(<ShopSign variant="neon">Néon</ShopSign>);
    const sign = container.querySelector(".kz-shop-sign")!;
    expect(sign.getAttribute("data-lit")).toBe("waiting");
    act(() => intersect([{ isIntersecting: false }] as IntersectionObserverEntry[], {} as IntersectionObserver));
    expect(sign.getAttribute("data-lit")).toBe("waiting");
    act(() => intersect([{ isIntersecting: true }] as IntersectionObserverEntry[], {} as IntersectionObserver));
    expect(sign.getAttribute("data-lit")).toBe("ready");
    expect(disconnect).toHaveBeenCalled();
    expect(wallCss()).toMatch(/\[data-lit="ready"\][^{]*\{\s*animation:\s*kz-wall-neon 2\.4s ease-in-out 1;/);
    expect(wallCss()).not.toMatch(/animation:[^;]*infinite/);
    unmount();
  });

  it("the neon stays lit and still under reduced motion or without observers, or with animated={false}", () => {
    motion(true);
    expect(render(<ShopSign variant="neon">N</ShopSign>).container.querySelector(".kz-shop-sign")?.getAttribute("data-lit")).toBeNull();
    vi.stubGlobal("IntersectionObserver", undefined);
    expect(render(<ShopSign variant="neon">N</ShopSign>).container.querySelector(".kz-shop-sign")?.getAttribute("data-lit")).toBeNull();
    motion();
    expect(render(<ShopSign variant="neon" animated={false}>N</ShopSign>).container.querySelector(".kz-shop-sign")?.getAttribute("data-lit")).toBeNull();
  });

  it("PinnedNote takes an ink, is held through Stuck, and keeps a fixed box of N lines", () => {
    const { container } = render(<PinnedNote text="Fermé à 15 h jeudi" ink="margin" hold="pin" rotation={-2} />);
    const note = container.querySelector(".kz-pinned-note") as HTMLElement;
    expect(note.getAttribute("data-ink")).toBe("margin");
    expect(note.style.getPropertyValue("--kz-note-lines")).toBe("4");
    const stuck = container.querySelector(".kz-stuck-body") as HTMLElement;
    expect(stuck.getAttribute("data-hold")).toBe("pin");
    expect(stuck.style.getPropertyValue("--kz-stuck-tilt")).toBe("-2deg");
    expect(stuck.querySelector(".kz-stuck-pin")).toBeTruthy();
    expect(container.querySelector(".kz-wall-pin")).toBeNull();
  });

  it("PinnedNote takes a post-it paper, an action inside the note and a longer limit", () => {
    const long = "x".repeat(300);
    const { container } = render(<PinnedNote text={long} limit={500} paper="rose" action={<a href="/s/x">Voir X</a>} />);
    const note = container.querySelector(".kz-pinned-note") as HTMLElement;
    expect(note.getAttribute("data-paper")).toBe("rose");
    expect(note.querySelector(".kz-pinned-note-action a")?.getAttribute("href")).toBe("/s/x");
    expect(container.querySelector(".kz-pinned-note-text")?.textContent).toHaveLength(300);
    expect(wallCss()).toMatch(/\[data-paper="butter"\][^{]*\{[^}]*background/);
  });

  it("PinnedNote has no paper attribute by default and still caps at 140", () => {
    const { container } = render(<PinnedNote text={"y".repeat(200)} />);
    expect((container.querySelector(".kz-pinned-note") as HTMLElement).hasAttribute("data-paper")).toBe(false);
    expect(container.querySelector(".kz-pinned-note-text")?.textContent).toHaveLength(140);
  });

  it("PinnedNote lines and ink default to 4 and blue, and the hold to tape", () => {
    const { container, rerender } = render(<PinnedNote text="Mot" />);
    expect((container.querySelector(".kz-pinned-note") as HTMLElement).getAttribute("data-ink")).toBe("blue");
    expect(container.querySelector(".kz-stuck-body")?.getAttribute("data-hold")).toBe("tape");
    rerender(<PinnedNote text="Mot" lines={6} ink="hue" />);
    expect((container.querySelector(".kz-pinned-note") as HTMLElement).style.getPropertyValue("--kz-note-lines")).toBe("6");
    expect(wallCss()).toMatch(/\.kz-pinned-note-text\s*\{[^}]*(block-size|height):\s*calc\(var\(--kz-note-lines\)/);
  });

  it("every note ink reads at least 4.5:1 on the note's paper in both themes", () => {
    const luminance = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
      return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
    };
    const ratio = (a: string, b: string) => { const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (hi! + 0.05) / (lo! + 0.05); };
    for (const mode of ["dark", "light"] as const) {
      for (const ink of ["accentText", "paperRuleMargin"] as const) expect(ratio(themes[mode][ink], themes[mode].surface0), `${ink} ${mode}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("Polaroid develops with opacity and saturation only, never a blur (ADR-004)", () => {
    const css = wallCss();
    expect(css).not.toMatch(/blur\(/);
    expect(css).toMatch(/\.kz-polaroid\[data-develop="waiting"\] \.kz-polaroid-photo\s*\{[^}]*saturate\([^)]*\)[^}]*opacity/);
  });

  it("Wall draws at most `max` items (12 by default), in z order, in a fixed 16:9 box on a desktop", () => {
    const many: WallItem[] = Array.from({ length: 15 }, (_, i) => ({ id: `n${i}`, kind: "note", x: i * 5, y: i * 5, z: i, text: `Note ${i}` }));
    const { container, rerender } = render(<Wall aria-label="Wall" items={many} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(12);
    expect(screen.getAllByRole("listitem")[11]?.textContent).toContain("Note 11");
    rerender(<Wall aria-label="Wall" items={many} max={5} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(container.firstElementChild?.getAttribute("data-count")).toBe("5");
    expect(wallCss()).toMatch(/\.kz-wall\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/);
  });

  it("a wall sign is a paragraph, not a second h1, and every word of the wall sits on paper", () => {
    render(<Wall items={[{ id: "s", kind: "sign", x: 10, y: 10, z: 1, children: "Atelier" }]} />);
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
    const css = wallCss();
    expect(css).toMatch(/\.kz-shop-sign\[data-variant="painted"\][^{]*\{[^}]*background:/);
  });
});
