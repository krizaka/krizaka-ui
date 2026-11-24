import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";

import Bands from "../../registry/examples/product-page/bands";
import Fixture from "../../registry/examples/product-page/fixture";
import Footer from "../../registry/examples/product-page/footer";
import Hero from "../../registry/examples/product-page/hero";
import Scenes from "../../registry/examples/product-page/scenes";
import { axeViolations } from "../test/axe";
import { CahierSheet, ClosingBand, ProductPage } from "./index";

function stubMotion(reduced: boolean) {
  vi.stubGlobal("matchMedia", (media: string) => ({ matches: reduced && media.includes("reduce"), media, addEventListener() {}, removeEventListener() {} }));
}

afterEach(() => vi.unstubAllGlobals());

describe("ProductPage", () => {
  it("assembles a fixture product from data only: one h1, the moment, the story, the demo, the scenes, the limits, the closing, the footer", async () => {
    stubMotion(false);
    const { container } = render(<Fixture />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("figure", { name: "A fictional lease, read, one clause found" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "How a lease is checked" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "A deposit of two months of rent.", pressed: true })).toBeTruthy();
    expect(container.querySelectorAll(".kz-pp-scene")).toHaveLength(2);
    expect(screen.getByRole("region", { name: "What it does not do" })).toBeTruthy();
    expect(screen.getByRole("contentinfo")).toBeTruthy();
    expect(container.querySelector(".kz-pp")?.classList.contains("brand-verikora")).toBe(true);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("a scene with no device frame renders its recording alone, and the default stays framed", () => {
    const { container } = render(<Scenes />);
    const rows = container.querySelectorAll(".kz-pp-scene");
    expect(rows[0]?.querySelector("[data-device='browser']")).not.toBeNull();
    expect(rows[2]?.querySelector("[data-device='none']")).not.toBeNull();
    expect(rows[2]?.querySelector(".kz-pp-device [class*='rounded-xl']")).toBeNull();
    expect(rows[2]?.querySelector("img")).not.toBeNull();
  });

  it("a scene's alt text is rendered on its media; without it the still stays decorative", () => {
    const { container } = render(<Scenes />);
    expect(screen.getByRole("img", { name: "The binder lists every document of the file." })).toBeTruthy();
    const rows = container.querySelectorAll(".kz-pp-scene");
    expect(rows[1]?.querySelector("img")?.getAttribute("alt")).toBe("");
  });

  it("draws only the parts it is given: no story, no demo, no scenes, no footer without their data", () => {
    stubMotion(false);
    const { container } = render(
      <ProductPage data={{ hero: { title: "Hello", primary: { href: "#a", label: "Start" } }, closing: { title: "Start now", action: { href: "#a", label: "Start" } } }} />,
    );
    expect(container.querySelector(".kz-story, .kz-clause, .kz-pp-scene, .kz-pp-limits, footer, figure")).toBeNull();
    expect(container.querySelector(".kz-pp-hero-grid")?.hasAttribute("data-split")).toBe(false);
  });

  it("is still under reduced motion: the story is its last plate and the hero's depth listens to nothing", () => {
    stubMotion(true);
    const { container } = render(<Fixture />);
    expect(container.querySelector(".kz-story")?.getAttribute("data-tier")).toBe("still");
    expect(container.querySelector(".kz-story-stage")?.getAttribute("data-cues")).toBe("arrive read light attach decide");
    expect(container.querySelector(".kz-depth")?.getAttribute("data-tier")).toBe("still");
    expect(container.querySelector(".kz-depth")?.hasAttribute("data-live")).toBe(false);
  });
});

describe("the product-page blocks", () => {
  it.each([
    ["hero", Hero],
    ["scenes", Scenes],
    ["bands", Bands],
    ["footer", Footer],
  ])("%s renders with no axe violation", async (_name, Example) => {
    stubMotion(false);
    const { container } = render(<Example />);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("numbers each line of the sheet in the margin and marks the flagged one", () => {
    const { container } = render(<CahierSheet lines={[{ text: "one" }, { text: "two", flagged: true }]} reading />);
    expect([...container.querySelectorAll(".kz-sheet-par")].map((n) => n.textContent)).toEqual(["§1", "§2"]);
    expect(container.querySelector("[data-flag]")?.textContent).toContain("two");
  });

  it("underlines the closing's last words with the pen and names the band by its whole sentence", () => {
    render(<ClosingBand title="See it on" inked="a lease." action={<a href="#a">Go</a>} />);
    expect(screen.getByRole("region", { name: "See it on a lease." })).toBeTruthy();
    expect(screen.getByText("a lease.").className).toBe("kz-pp-ink");
  });

  it("types no product name in any block: the words are data", () => {
    const dirs = ["product-page", "story-scroll", "clause-demo", "motion-tier"].map((d) => join(import.meta.dirname, "..", d));
    for (const dir of dirs) {
      for (const file of readdirSync(dir).filter((f) => !f.includes(".test."))) {
        expect(readFileSync(join(dir, file), "utf8"), `${dir}/${file}`).not.toMatch(/verikora|sovkora|folioviv|wu-?sama/i);
      }
    }
  });
});
