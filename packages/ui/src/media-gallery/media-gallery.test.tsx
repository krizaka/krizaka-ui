import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { MediaGallery } from "./index";

const items = [
  { id: "a", src: "/a.jpg", alt: "The shop front", caption: "Front" },
  { id: "b", src: "/b.jpg", alt: "A walk", shape: "wide" as const },
  { id: "c", src: "/c.jpg", alt: "A clip", video: { webm: "/c.webm" } },
];

describe("MediaGallery", () => {
  it("lists the photos with their alt text and captions, the first featured, with no axe violation", async () => {
    const { container } = render(<MediaGallery label="Photos" items={items} />);
    expect(screen.getByRole("list", { name: "Photos" })).toBeTruthy();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByAltText("The shop front")).toBeTruthy();
    expect(screen.getByText("Front")).toBeTruthy();
    const tiles = container.querySelectorAll("li");
    expect(tiles[0]!.hasAttribute("data-featured")).toBe(true);
    expect(tiles[1]!.hasAttribute("data-featured")).toBe(false);
    expect(tiles[1]!.getAttribute("data-shape")).toBe("wide");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("does not feature a tile when there are only two", () => {
    const { container } = render(<MediaGallery label="Photos" items={items.slice(0, 2)} />);
    expect(container.querySelector("[data-featured]")).toBeNull();
  });

  it("starts no video until its tile is seen", () => {
    const { container } = render(<MediaGallery label="Photos" items={items} />);
    expect(container.querySelector("video")).toBeNull();
  });
});
