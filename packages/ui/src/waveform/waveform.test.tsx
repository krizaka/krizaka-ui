import { readFileSync } from "node:fs";
import { join } from "node:path";

import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { axeViolations } from "../test/axe";
import { Waveform } from "./index";

describe("Waveform", () => {
  it("is decorative by default: hidden from assistive technology, one bar per count", async () => {
    const { container } = render(<Waveform peaks={[0.2, 0.9, 0.4, 0.7]} bars={4} />);
    const root = container.querySelector<HTMLElement>(".kz-wave")!;
    expect(root.getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByRole("img")).toBeNull();
    expect(root.querySelectorAll("[data-bar]")).toHaveLength(4);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is an accessible image with a label", async () => {
    const { container } = render(<Waveform label="Voice note, 0:42" peaks={[0.5]} bars={1} />);
    const root = container.querySelector<HTMLElement>(".kz-wave")!;
    expect(root.getAttribute("aria-hidden")).toBeNull();
    expect(screen.getByRole("img", { name: "Voice note, 0:42" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("draws the peaks resampled to the bars, the loudest at full height", () => {
    const { container } = render(<Waveform peaks={[0.1, 0.5, 0.2, 0.25]} bars={2} />);
    const heights = [...container.querySelectorAll<HTMLElement>("[data-bar]")].map((bar) => bar.style.height);
    expect(heights).toEqual(["100%", "50%"]);
  });

  it("draws a flat low line without peaks", () => {
    const { container } = render(<Waveform bars={3} />);
    const heights = [...container.querySelectorAll<HTMLElement>("[data-bar]")].map((bar) => bar.style.height);
    expect(heights).toEqual(["15%", "15%", "15%"]);
  });

  it("takes its size and tone as props, and moves only while playing", () => {
    const { container, rerender } = render(<Waveform peaks={[1]} bars={1} size="lg" tone="neutral" />);
    const root = container.querySelector<HTMLElement>(".kz-wave")!;
    expect(root.className).toContain("h-16");
    expect(container.querySelector("[data-bar]")?.className).toContain("bg-border-strong");
    expect(root.hasAttribute("data-playing")).toBe(false);
    rerender(<Waveform peaks={[1]} bars={1} playing />);
    expect((container.querySelector<HTMLElement>(".kz-wave")!).hasAttribute("data-playing")).toBe(true);
  });

  it("keeps its motion behind a no-preference query only, and uses tokens only", () => {
    const { container } = render(<Waveform peaks={[1]} bars={1} playing />);
    const css = container.querySelector("style")?.textContent ?? "";
    expect(css).toContain("@media (prefers-reduced-motion: no-preference)");
    expect(css).toContain("@keyframes kz-wave");
    const source = readFileSync(join(import.meta.dirname, "waveform.tsx"), "utf8");
    expect(source).not.toMatch(/#[0-9a-f]{3,6}\b/i);
    expect(source).not.toMatch(/\b(bg|text|border)-(zinc|slate|gray|neutral|red|blue|green|amber|emerald)-\d/);
  });

  describe("off screen", () => {
    const observers: Array<(entries: Array<{ isIntersecting: boolean }>) => void> = [];
    afterEach(() => {
      observers.length = 0;
      vi.unstubAllGlobals();
    });

    it("pauses its motion while it is out of view", () => {
      class FakeObserver {
        constructor(callback: (entries: Array<{ isIntersecting: boolean }>) => void) {
          observers.push(callback);
        }
        observe() {}
        disconnect() {}
        unobserve() {}
      }
      vi.stubGlobal("IntersectionObserver", FakeObserver);
      const { container } = render(<Waveform peaks={[1]} bars={1} playing />);
      const root = container.querySelector<HTMLElement>(".kz-wave")!;
      expect(root.hasAttribute("data-paused")).toBe(false);
      act(() => observers.forEach((notify) => notify([{ isIntersecting: false }])));
      expect(root.hasAttribute("data-paused")).toBe(true);
      act(() => observers.forEach((notify) => notify([{ isIntersecting: true }])));
      expect(root.hasAttribute("data-paused")).toBe(false);
    });
  });
});
