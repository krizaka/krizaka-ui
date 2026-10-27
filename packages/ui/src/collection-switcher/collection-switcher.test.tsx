import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { axeViolations } from "../test/axe";
import { CollectionSwitcher, collectionTree } from "./index";

const COLLECTIONS = [
  { id: "all", name: "Everything", isDefault: true, count: 42 },
  { id: "y", name: "2026" },
  { id: "s", name: "Spring", parentId: "y" },
];
const base = { collections: COLLECTIONS, value: "y", label: "Collections", defaultLabel: "Default" } as const;

describe("CollectionSwitcher", () => {
  it("marks the current collection and the default one, and chooses another", async () => {
    const onValueChange = vi.fn();
    const { container } = render(<CollectionSwitcher {...base} onValueChange={onValueChange} />);
    expect(screen.getByRole("navigation", { name: "Collections" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /2026/ }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByText("Default")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Spring/ }));
    expect(onValueChange).toHaveBeenCalledWith("s");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("gives every row an address when `href` is passed", () => {
    render(<CollectionSwitcher {...base} href={(id) => `/c/${id}`} />);
    expect(screen.getByRole("link", { name: /Spring/ }).getAttribute("href")).toBe("/c/s");
  });

  it("never offers to remove the default collection", () => {
    const onRemove = vi.fn();
    render(<CollectionSwitcher {...base} onRemove={onRemove} removeLabel={(name) => `Remove ${name}`} />);
    expect(screen.queryByRole("button", { name: "Remove Everything" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Remove 2026" }));
    expect(onRemove).toHaveBeenCalledWith("y");
  });

  it("nests in the tree layout", async () => {
    const { container } = render(<CollectionSwitcher {...base} layout="tree" />);
    const parent = container.querySelector('[data-collection="y"]')!;
    expect(parent.querySelector('[data-collection="s"]')).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("in entity mode shows the current one and lists the others in a popover", async () => {
    const onValueChange = vi.fn();
    render(<CollectionSwitcher {...base} value="all" mode="entity" label="Switch shop" onValueChange={onValueChange} />);
    const trigger = screen.getByRole("button", { name: /Switch shop/ });
    expect(trigger.textContent).toContain("Everything");
    fireEvent.click(trigger);
    fireEvent.click(await screen.findByRole("button", { name: /2026/ }));
    expect(onValueChange).toHaveBeenCalledWith("y");
    expect(screen.queryByRole("navigation", { name: "Switch shop" })).toBeNull();
  });
});

describe("collectionTree", () => {
  it("makes an unknown parent a root and survives a cycle", () => {
    const roots = collectionTree([
      { id: "a", name: "A", parentId: "missing" },
      { id: "b", name: "B", parentId: "c" },
      { id: "c", name: "C", parentId: "b" },
      { id: "d", name: "D", parentId: "d" },
    ]);
    const ids = (nodes: typeof roots): string[] => nodes.flatMap((n) => [n.item.id, ...ids(n.children)]);
    expect(ids(roots).sort()).toEqual(["a", "b", "c", "d"]);
  });
});
