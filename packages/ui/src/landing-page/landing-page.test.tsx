import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";

import Example from "../../registry/examples/landing-page/krizaka";
import Showcase from "../../registry/examples/landing-page/showcase";
import { axeViolations } from "../test/axe";
import { LandingPage } from "./index";

describe("LandingPage", () => {
  it("renders the template with its h1, its parts, and no axe violation", async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole("heading", { level: 1, name: "Products that keep what is yours" })).toBeTruthy();
    expect(container.querySelector(".kz-tpl-bento [data-size='lg']")).toBeTruthy();
    expect(container.querySelectorAll(".kz-tpl-band dt")).toHaveLength(3);
    expect(await axeViolations(container)).toEqual([]);
  });

  const base = { title: "Hello", features: [{ id: "a", title: "A", text: "a" }] } as const;

  it("renders no figure and no empty stage without a visual, in a single-column hero", () => {
    const { container } = render(<LandingPage {...base} proofs={[{ value: "1", label: "one" }]} />);
    expect(container.querySelector("figure")).toBeNull();
    expect(container.querySelector(".kz-tpl-stage")).toBeNull();
    expect(container.querySelector(".kz-tpl-split")?.getAttribute("data-single")).toBe("");
  });

  it("keeps the split hero with its figure when a visual is given", () => {
    const { container } = render(<LandingPage {...base} visual={<p>demo</p>} />);
    expect(container.querySelectorAll("figure")).toHaveLength(1);
    expect(container.querySelector(".kz-tpl-split")?.hasAttribute("data-single")).toBe(false);
  });

  it("renders the showcase after the proofs and before #features", () => {
    const { container } = render(<LandingPage {...base} featuresHeading={{ title: "Features" }} proofs={[{ value: "1", label: "one" }]} showcase={<div data-testid="show">carousel</div>} />);
    const band = container.querySelector(".kz-tpl-band") as Element;
    const show = screen.getByTestId("show");
    const features = container.querySelector("#features") as Element;
    expect(features).toBeTruthy();
    expect(band.compareDocumentPosition(show) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(show.compareDocumentPosition(features) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("leaves the default render unchanged: grid and drift layers, no showcase wrapper", () => {
    const { container } = render(<LandingPage {...base} visual={<p>demo</p>} />);
    expect(container.querySelector(".kz-backdrop-grid")).toBeTruthy();
    expect(container.querySelector(".kz-backdrop-drift")).toBeTruthy();
    expect(container.querySelector(".kz-backdrop-dome")).toBeTruthy();
    expect(container.querySelector("[data-landing-showcase]")).toBeNull();
  });

  it("quiet keeps the still dome and drops the grid and the drift", () => {
    const { container } = render(<LandingPage {...base} backdrop="quiet" />);
    expect(container.querySelector(".kz-backdrop-dome")).toBeTruthy();
    expect(container.querySelector(".kz-backdrop-grid")).toBeNull();
    expect(container.querySelector(".kz-backdrop-drift")).toBeNull();
  });

  it("the grid backdrop's drift is stilled under reduced motion (the stylesheet)", () => {
    const css = readFileSync(join(process.cwd(), "src/motion.css"), "utf8");
    const reduced = css.slice(css.indexOf("prefers-reduced-motion: reduce"));
    expect(reduced).toContain(".kz-backdrop-drift");
  });

  it("with a carousel in the showcase, has no axe violation", async () => {
    const { container } = render(<Showcase />);
    expect(container.querySelector("[data-landing-showcase] [aria-roledescription='carousel']")).toBeTruthy();
    expect(container.querySelector(".kz-tpl-stage")).toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is exported", () => {
    expect(typeof LandingPage).toBe("function");
  });
});
