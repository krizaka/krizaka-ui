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

describe('ServiceCard variant="index" (krizaka-ui#603)', () => {
  const props = { ...base, duration: "30 min", capacity: "1 dog", priceFrom: "From", description: "One dog, one walker.", included: ["Fresh water", "A photo after"], tag: "Popular", href: "/book?service=solo" };
  const spoken = (container: Element) => {
    const clone = container.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("[aria-hidden]").forEach((node) => node.remove());
    return (clone.textContent ?? "").replace(/\s+/g, " ").trim();
  };

  it("reads the same to a keyboard and a screen reader as the default card", async () => {
    const plain = render(<ServiceCard {...props} />);
    const plainRoles = ["heading", "link", "list", "listitem"].map((role) => screen.getAllByRole(role).map((node) => [role, spoken(node), node.getAttribute("href")]));
    const plainSpeech = spoken(plain.container);
    plain.unmount();
    const index = render(<ServiceCard {...props} variant="index" />);
    const indexRoles = ["heading", "link", "list", "listitem"].map((role) => screen.getAllByRole(role).map((node) => [role, spoken(node), node.getAttribute("href")]));
    expect(indexRoles).toEqual(plainRoles);
    expect(spoken(index.container)).toBe(plainSpeech);
    expect(screen.getByRole("link").getAttribute("aria-describedby")).toBe(screen.getByRole("heading").id);
    expect(await axeViolations(index.container)).toEqual([]);
  });

  it("is a ruled card, straight, with a decorative punched hole and the duration and the price stamped", () => {
    const { container } = render(<ServiceCard {...props} variant="index" />);
    const card = container.querySelector("article") as HTMLElement;
    expect(card.dataset.variant).toBe("index");
    expect(card.className).toContain("rounded-none");
    expect(card.className).not.toMatch(/(^|\s)-?rotate-/);
    const hole = card.querySelector("[data-hole]") as SVGElement;
    expect(hole.getAttribute("aria-hidden")).toBe("true");
    const stamps = [...card.querySelectorAll(".kz-stamp")].map((node) => node.textContent);
    expect(stamps).toEqual(expect.arrayContaining(["30 min", "$22.00"]));
    for (const node of card.querySelectorAll(".kz-stamp")) expect(node.hasAttribute("data-straight")).toBe(true);
  });

  it("does not stretch its link over the whole card (the name stays selectable) and uses a secondary Button", () => {
    render(<ServiceCard {...props} variant="index" />);
    const link = screen.getByRole("link");
    expect(link.className).not.toContain("after:absolute");
    expect(link.className).toContain("border-border-default");
    expect(link.className).toContain("min-h-");
  });

  it("lifts on hover and focus in 120 ms, and not at all under reduced motion", () => {
    const { container } = render(<ServiceCard {...props} variant="index" />);
    const cls = (container.querySelector("article") as HTMLElement).className;
    expect(cls).toContain("duration-120");
    expect(cls).toContain("hover:-translate-y-0.5");
    expect(cls).toContain("focus-within:-translate-y-0.5");
    expect(cls).toContain("motion-reduce:transition-none");
    expect(cls).toContain("motion-reduce:hover:translate-y-0");
  });

  it("has a list density for one column", () => {
    const { container } = render(<ServiceCard {...props} variant="index" density="list" />);
    expect((container.querySelector("article") as HTMLElement).dataset.density).toBe("list");
  });

  it("keeps the press of a client parent", () => {
    const onSelect = vi.fn();
    render(<ServiceCard {...base} variant="index" onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: /Book/ }));
    expect(onSelect).toHaveBeenCalledOnce();
  });
});

