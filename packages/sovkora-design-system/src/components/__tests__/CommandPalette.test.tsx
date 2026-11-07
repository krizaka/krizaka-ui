import { act, fireEvent, render, screen } from "@testing-library/react";

import { CommandPalette } from "../CommandPalette";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const labels = {
  label: "Palette",
  placeholder: "Search",
  results: "Results",
  empty: "Nothing",
  navigate: "Move",
  open: "Go",
  close: "Shut",
};

const open = async () => {
  await act(async () => {
    fireEvent.keyDown(window, { key: "k", metaKey: true });
  });
};

describe("CommandPalette (on @krizaka/ui/command)", () => {
  beforeAll(() => {
    // cmdk scrolls the active item into view; jsdom has neither scrollIntoView nor ResizeObserver.
    Element.prototype.scrollIntoView = vi.fn();
    globalThis.ResizeObserver ??= class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  });
  afterEach(() => vi.clearAllMocks());

  it("is closed until ⌘K, then shows the given entries under their section", async () => {
    render(
      <CommandPalette
        labels={labels}
        commands={[{ id: "studios", label: "Studios", icon: "dashboard", href: "/studios", section: "Go to" }]}
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await open();
    expect(screen.getByRole("dialog", { name: "Palette" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    expect(screen.getByText("Go to")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Studios/ })).toBeInTheDocument();
  });

  it("navigates through onNavigate, then closes", async () => {
    const onNavigate = vi.fn();
    render(
      <CommandPalette
        labels={labels}
        onNavigate={onNavigate}
        commands={[{ id: "packs", label: "Packs", icon: "dashboard", href: "/packs", section: "Go to" }]}
      />,
    );
    await open();
    await act(async () => {
      fireEvent.click(screen.getByRole("option", { name: /Packs/ }));
    });
    expect(onNavigate).toHaveBeenCalledWith("/packs");
    expect(push).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
