import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";

import { axeViolations } from "../test/axe";
import { Card, card } from "./index";

describe("Card", () => {
  it("composes a media card with no axe violation", async () => {
    const { container } = render(
      <Card.Root>
        <Card.Media aspect="square">
          <Card.Image src="/cover.jpg" alt="" />
          <Card.Overlay corner="bottom-right">12:04</Card.Overlay>
        </Card.Media>
        <Card.Body>
          <Card.Title>Night ride</Card.Title>
          <Card.Description>Ten minutes across the city.</Card.Description>
          <Card.Stat label="Views">1,204</Card.Stat>
          <Card.Footer>Yesterday</Card.Footer>
        </Card.Body>
      </Card.Root>,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Night ride" })).toBeTruthy();
    expect(container.querySelector("img")?.getAttribute("loading")).toBe("lazy");
    expect(container.querySelector("[data-aspect=square]")?.className).toContain("aspect-square");
    expect(container.querySelector("[data-corner=bottom-right]")?.className).toContain("right-2.5");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("loads lazily by default, eagerly when asked (the first cards of a page)", () => {
    const { container } = render(<Card.Image src="/hero.jpg" loading="eager" fetchPriority="high" />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("loading")).toBe("eager");
    expect(img?.getAttribute("fetchpriority")).toBe("high");
  });

  it("shows the fallback, hidden from assistive technology, when there is no image", () => {
    const { container } = render(<Card.Image src={null} fallback={<svg />} />);
    const fallback = container.querySelector("[data-fallback]");
    expect(fallback?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector("img")).toBeNull();
  });

  it("renders its child with asChild, interactive, with the classes merged", async () => {
    const { container } = render(
      <Card.Root asChild interactive className="rounded-none">
        <a href="/videos/1">
          <Card.Body>
            <Card.Title as="h2">Open</Card.Title>
          </Card.Body>
        </a>
      </Card.Root>,
    );
    const link = screen.getByRole("link");
    expect(link.className).toContain("kz-spotlight");
    expect(link.className).toContain("rounded-none");
    expect(link.className).not.toContain("rounded-xl");
    expect(link.hasAttribute("data-interactive")).toBe(true);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("turns `reveal` into a capped delay", () => {
    render(
      <>
        <Card.Root reveal={2} data-testid="a" />
        <Card.Root reveal={20} data-testid="b" />
      </>,
    );
    const a = screen.getByTestId("a");
    expect(a.hasAttribute("data-reveal")).toBe(true);
    expect(a.style.getPropertyValue("--kz-delay")).toBe("100ms");
    expect(screen.getByTestId("b").style.getPropertyValue("--kz-delay")).toBe("400ms");
  });

  it("renders on the server (no hook, no context) and exposes its slots", () => {
    expect(renderToStaticMarkup(<Card.Root tone="elevated">x</Card.Root>)).toContain("bg-surface-2");
    expect(card({ padding: "lg" }).body()).toContain("p-6");
  });
});
