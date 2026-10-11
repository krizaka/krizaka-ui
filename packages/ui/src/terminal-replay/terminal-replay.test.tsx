import { act, fireEvent, render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { TerminalReplay } from "./index";

const steps = [
  { command: "npx tool install", output: ["Phase 1", { text: "✔ done", tone: "success" as const }] },
  { command: "npx tool start", output: ["ready"] },
];
const words = { label: "Terminal session", playLabel: "Play", pauseLabel: "Pause", replayLabel: "Replay" };

/** happy-dom has an IntersectionObserver that never fires: one that reports the element in view at once. */
function inView(visible = true) {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(private callback: IntersectionObserverCallback) {}
      observe(el: Element) {
        this.callback([{ isIntersecting: visible, target: el } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
      disconnect() {}
    },
  );
}
const motion = (reduce: boolean) => vi.stubGlobal("matchMedia", (query: string) => ({ matches: reduce && query.includes("reduce"), media: query }));

describe("TerminalReplay", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("holds the whole transcript in a named region, with no axe violation", async () => {
    motion(true);
    const { container } = render(<TerminalReplay steps={steps} {...words} copyLabel="Copy" copiedLabel="Copied" />);
    const region = screen.getByRole("region", { name: "Terminal session" });
    expect(region.querySelector("pre")?.textContent).toBe("$ npx tool install\nPhase 1\n✔ done\n\n$ npx tool start\nready");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("rests whole under reduced motion: every command and line is shown", () => {
    motion(true);
    inView();
    const { container } = render(<TerminalReplay steps={steps} {...words} />);
    const live = container.querySelector(".kz-replay-live")!;
    expect(live.textContent).toContain("npx tool start");
    expect(live.textContent).toContain("ready");
    expect(container.querySelector("figure")?.dataset.state).toBe("final");
    expect(screen.getByRole("button", { name: "Play" })).toBeTruthy();
  });

  it("types the commands and prints their output when in view, then offers to replay", () => {
    vi.useFakeTimers();
    motion(false);
    inView();
    const { container } = render(<TerminalReplay steps={steps} {...words} typingSpeed={1} lineDelay={1} stepDelay={1} />);
    const live = () => container.querySelector(".kz-replay-live")!.textContent ?? "";
    expect(container.querySelector("figure")?.dataset.state).toBe("playing");
    for (let i = 0; i < 4; i++) act(() => void vi.advanceTimersByTime(2));
    expect(live()).toContain("$ npx");
    expect(live()).not.toContain("start");
    for (let i = 0; i < 80; i++) act(() => void vi.advanceTimersByTime(10));
    expect(live()).toContain("ready");
    expect(container.querySelector("figure")?.dataset.state).toBe("done");
    fireEvent.click(screen.getByRole("button", { name: "Replay" }));
    expect(container.querySelector("figure")?.dataset.state).toBe("playing");
    expect(live()).not.toContain("ready");
  });

  it("waits off screen, and pauses on demand", () => {
    vi.useFakeTimers();
    motion(false);
    inView(false);
    const { container } = render(<TerminalReplay steps={steps} {...words} typingSpeed={1} />);
    expect(container.querySelector("figure")?.dataset.state).toBe("idle");
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    expect(container.querySelector("figure")?.dataset.state).toBe("paused");
  });

  it("rests whole with autoPlay={false}", () => {
    motion(false);
    inView();
    const { container } = render(<TerminalReplay steps={steps} {...words} autoPlay={false} />);
    expect(container.querySelector("figure")?.dataset.state).toBe("final");
  });
});
