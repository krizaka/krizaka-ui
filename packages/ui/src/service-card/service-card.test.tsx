import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { axeViolations } from "../test/axe";
import { ServiceCard } from "./index";

const base = { name: "Solo walk", price: "$22.00", actionLabel: "Book" };

describe("ServiceCard", () => {
  it("shows the name, the facts, the price, the inclusions and the tag, with no axe violation", async () => {
    const { container } = render(
      <ServiceCard {...base} duration="30 min" capacity="1 dog" priceFrom="From" description="One dog, one walker." included={["Fresh water", "A photo after"]} tag="Popular" href="/book?service=solo" />,
    );
    expect(screen.getByRole("heading", { name: "Solo walk" })).toBeTruthy();
    expect(screen.getByText("30 min")).toBeTruthy();
    expect(screen.getByText("1 dog")).toBeTruthy();
    expect(screen.getByText("From")).toBeTruthy();
    expect(screen.getByText("$22.00")).toBeTruthy();
    expect(screen.getByText("Fresh water")).toBeTruthy();
    expect(screen.getByText("Popular")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("leads to its address, described by the service's name, and stretches over the whole card", () => {
    render(<ServiceCard {...base} href="/book?service=solo" />);
    const link = screen.getByRole("link", { name: /Book/ });
    expect(link.getAttribute("href")).toBe("/book?service=solo");
    expect(link.getAttribute("aria-describedby")).toBe(screen.getByRole("heading").id);
    expect(link.className).toContain("after:absolute");
  });

  it("is a pressable choice with onSelect: aria-pressed follows `selected`", () => {
    const onSelect = vi.fn();
    const { rerender, container } = render(<ServiceCard {...base} onSelect={onSelect} />);
    const button = screen.getByRole("button", { name: /Book/ });
    expect(button.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(button);
    expect(onSelect).toHaveBeenCalledOnce();
    rerender(<ServiceCard {...base} onSelect={onSelect} selected />);
    expect(screen.getByRole("button", { name: /Book/ }).getAttribute("aria-pressed")).toBe("true");
    expect(container.querySelector("article")!.hasAttribute("data-selected")).toBe(true);
  });

  it("leaves out what it is not given: no tag, no inclusions, no way in", () => {
    const { container } = render(<ServiceCard name="Visit" price="$18.00" actionLabel="Book" />);
    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.querySelector("article")!.hasAttribute("data-reveal")).toBe(false);
  });
});
