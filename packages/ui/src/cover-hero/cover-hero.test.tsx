import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { CoverHero } from "./index";

const reduced = (matches: boolean) =>
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({ matches, media: query, addEventListener: () => {}, removeEventListener: () => {} }),
  });

describe("CoverHero", () => {
  it("shows the name as the h1, the promise, the facts and the action over the cover, with no axe violation", async () => {
    reduced(false);
    const { container } = render(
      <CoverHero cover={{ src: "/cover.jpg", alt: "A dog in the snow" }} eyebrow="Saint-Henri" title="Pattes" lead="Dog walks" facts={<span>Open now</span>} actions={<a href="#book">Book</a>} />,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Pattes" })).toBeTruthy();
    expect(screen.getByText("Dog walks")).toBeTruthy();
    expect(screen.getByText("Open now")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Book" })).toBeTruthy();
    expect(screen.getByAltText("A dog in the snow").getAttribute("src")).toBe("/cover.jpg");
    expect(container.querySelector("header")!.hasAttribute("data-cover")).toBe(true);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("plays the loop over the still, and keeps the still alone under reduced motion", async () => {
    reduced(false);
    const cover = { src: "/cover.jpg", video: { webm: "/c.webm", mp4: "/c.mp4" } };
    const { container, unmount } = render(<CoverHero cover={cover} title="Pattes" />);
    expect(container.querySelector("video")).toBeTruthy();
    expect(container.querySelector("video source")!.getAttribute("src")).toBe("/c.webm");
    unmount();
    reduced(true);
    const reducedRender = render(<CoverHero cover={cover} title="Pattes" />);
    expect(reducedRender.container.querySelector("video")).toBeNull();
    expect(reducedRender.container.querySelector("img")).toBeTruthy();
  });

  it("wears the brand's colours without a cover", () => {
    const { container } = render(<CoverHero title="Atelier" />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("header")!.hasAttribute("data-cover")).toBe(false);
  });

  it("offers a way back", () => {
    render(<CoverHero title="Atelier" back={{ href: "/", label: "Home" }} />);
    expect(screen.getByRole("link", { name: /Home/ }).getAttribute("href")).toBe("/");
  });
});
