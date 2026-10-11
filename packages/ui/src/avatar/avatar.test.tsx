import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Avatar } from "./index";

describe("Avatar", () => {
  it("shows the fallback without an image, with its size, and no axe violation", async () => {
    const { container } = render(<Avatar fallback="AB" size="lg" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.size).toBe("lg");
    expect(root.className).toContain("h-14");
    expect(await screen.findByText("AB")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("lets the product's className win", () => {
    const { container } = render(<Avatar fallback="AB" className="rounded-lg" />);
    const classes = (container.firstElementChild as HTMLElement).className.split(" ");
    expect(classes).toContain("rounded-lg");
    expect(classes).not.toContain("rounded-full");
  });

  it("groups avatars and counts the rest past max", async () => {
    const { container } = render(
      <Avatar.Group max={2}>
        <Avatar fallback="A" />
        <Avatar fallback="B" />
        <Avatar fallback="C" />
        <Avatar fallback="D" />
      </Avatar.Group>,
    );
    expect(await screen.findByText("+2")).toBeTruthy();
    expect(screen.queryByText("C")).toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("Avatar — presence", () => {
  it("shows a decorative status dot and keeps the 2.x markup without one", async () => {
    const { container, rerender } = render(<Avatar fallback="EB" status="online" />);
    const frame = container.firstElementChild as HTMLElement;
    expect(frame.dataset.status).toBe("online");
    const dot = frame.querySelector("span[data-status]:not([data-slot])") as HTMLElement;
    expect(dot.getAttribute("aria-hidden")).toBe("true");
    expect(dot.className).toContain("data-[status=online]:bg-success");
    expect(await axeViolations(container)).toEqual([]);
    rerender(<Avatar fallback="EB" />);
    expect((container.firstElementChild as HTMLElement).dataset.slot).toBe("avatar");
  });

  it("draws the presence ring of the brand", () => {
    const { container } = render(<Avatar fallback="EB" ring status="away" />);
    const frame = container.firstElementChild as HTMLElement;
    expect(frame.dataset.ring).toBe("");
    expect(frame.className).toContain("from-accent");
  });
});
