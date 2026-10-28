import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// The live map needs WebGL; the gate's job is the box around it. The stand-in shows the class the gate gives the map.
vi.mock("@krizaka/ui/map", () => ({
  Map: ({ className }: { className?: string }) => <div data-testid="live" className={className} />,
  StaticMap: () => <div data-testid="still" />,
}));

import { MapGate } from "./index";

const props = { label: "Where", center: [-73.58, 45.48] as [number, number], showLabel: "Show the map" };

function wide(matches: boolean) {
  window.matchMedia = ((query: string) => ({ matches, media: query, addEventListener: () => {}, removeEventListener: () => {} })) as unknown as typeof window.matchMedia;
}

describe("the map gate gives the live map a box (akinaza#488)", () => {
  it("fills the aspect-ratio frame: the live map is `absolute inset-0` inside, so without a height of its own it draws as an empty 0 px box", () => {
    wide(true);
    render(<MapGate {...props} />);
    const live = screen.getByTestId("live");
    expect(live.className).toContain("h-full");
    expect(live.className).toContain("w-full");
  });

  it("lets the host's own class on the map win", () => {
    wide(true);
    render(<MapGate {...props} map={{ className: "h-80" }} />);
    expect(screen.getByTestId("live").className).toBe("h-80");
  });

  it("shows the still and the button on a phone, no live map", () => {
    wide(false);
    render(<MapGate {...props} />);
    expect(screen.queryByTestId("live")).toBeNull();
    expect(screen.getByRole("button", { name: "Show the map" })).toBeTruthy();
  });
});
