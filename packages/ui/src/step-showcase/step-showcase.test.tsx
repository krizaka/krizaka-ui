import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { axeViolations } from "../test/axe";
import { DeviceFrame, StepShowcase } from "./index";

const steps = [
  { id: "sign-in", title: "Sign in", description: "Your workspace.", poster: "/p1.webp", alt: "Sign-in screen", video: { webm: "/v1.webm", mp4: "/v1.mp4" } },
  { id: "image", title: "Make an image", description: "A Studio run.", poster: "/p2.webp", alt: "A Studio", video: { webm: "/v2.webm" } },
  { id: "jobs", title: "Follow your jobs", description: "Every run.", poster: "/p3.webp", alt: "Jobs", duration: 3000 },
];

let visible: (on: boolean) => void = () => undefined;
beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: IntersectionObserverCallback) {
        visible = (on) => act(() => cb([{ isIntersecting: on } as IntersectionObserverEntry], this as unknown as IntersectionObserver));
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve());
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const tour = () => <StepShowcase label="In your pocket" device="phone" steps={steps} />;
const tabs = () => screen.getAllByRole("tab");

describe("StepShowcase", () => {
  it("is a named carousel: the steps a vertical tab list, the frame its panel named by the current step, no axe violation", async () => {
    const { container } = render(<main>{tour()}</main>);
    expect(screen.getByRole("region", { name: "In your pocket" }).getAttribute("aria-roledescription")).toBe("carousel");
    expect(screen.getByRole("tablist").getAttribute("aria-orientation")).toBe("vertical");
    expect(tabs().map((t) => t.getAttribute("aria-selected"))).toEqual(["true", "false", "false"]);
    expect(screen.getByRole("tabpanel").getAttribute("aria-labelledby")).toBe(tabs()[0].id);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("loads lazily: posters first, no video before the block has been seen", () => {
    const { container } = render(tour());
    expect(container.querySelectorAll("img")).toHaveLength(3);
    expect(container.querySelector("video")).toBeNull();
    visible(true);
    expect(container.querySelectorAll("video")).toHaveLength(1);
  });

  it("plays the current recording muted, inline, without native controls — only while in view", () => {
    const { container } = render(tour());
    visible(true);
    const v = container.querySelector("video") as HTMLVideoElement;
    expect(v.muted).toBe(true);
    expect(v.hasAttribute("controls")).toBe(false);
    expect(v.hasAttribute("playsinline")).toBe(true);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    visible(false);
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it("moves on when the recording ends, and the next one crossfades in", () => {
    const { container } = render(tour());
    visible(true);
    fireEvent.ended(container.querySelector("video")!);
    expect(tabs()[1].getAttribute("aria-selected")).toBe("true");
    const layers = container.querySelectorAll("[data-step]");
    expect(layers[1].className).toContain("opacity-100");
    expect(layers[0].className).toContain("opacity-0");
    expect(container.querySelector("video source")?.getAttribute("src")).toBe("/v2.webm");
  });

  it("fills the current step's bar with the recording's time", () => {
    const { container } = render(tour());
    visible(true);
    const v = container.querySelector("video") as HTMLVideoElement;
    Object.defineProperty(v, "duration", { value: 8, configurable: true });
    Object.defineProperty(v, "currentTime", { value: 2, configurable: true });
    fireEvent.timeUpdate(v);
    expect((container.querySelector("[data-fill]") as HTMLElement).style.transform).toBe("scaleX(0.25)");
  });

  it("jumps to a step on click, and walks them with the arrows", async () => {
    const user = userEvent.setup();
    render(tour());
    await user.click(tabs()[2]);
    expect(tabs()[2].getAttribute("aria-selected")).toBe("true");
    tabs()[2].focus();
    await user.keyboard("{ArrowDown}");
    expect(tabs()[0].getAttribute("aria-selected")).toBe("true");
  });

  it("holds on hover and keeps a visible play / pause button", async () => {
    const user = userEvent.setup();
    const { container } = render(tour());
    visible(true);
    const pause = screen.getByRole("button", { name: "Pause the steps" });
    vi.mocked(HTMLMediaElement.prototype.pause).mockClear();
    await user.click(pause);
    expect(screen.getByRole("button", { name: "Play the steps" }).getAttribute("aria-pressed")).toBe("true");
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    fireEvent.pointerLeave(container.querySelector("section")!);
  });

  it("swipes to the next step on a phone", () => {
    render(tour());
    const panel = screen.getByRole("tabpanel");
    fireEvent.pointerDown(panel, { clientX: 200 });
    fireEvent.pointerUp(panel, { clientX: 100 });
    expect(tabs()[1].getAttribute("aria-selected")).toBe("true");
  });

  it("under reduced motion: posters only, no autoplay, no pause button", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(((q: string) => ({ matches: q.includes("reduce"), media: q, addEventListener: () => undefined, removeEventListener: () => undefined })) as unknown as typeof window.matchMedia);
    const { container } = render(tour());
    visible(true);
    expect(container.querySelector("video")).toBeNull();
    expect(screen.queryByRole("button", { name: /Pause/ })).toBeNull();
  });
});

describe("DeviceFrame", () => {
  it.each(["phone", "browser", "desktop"] as const)("draws a %s around its content", (kind) => {
    const { container } = render(
      <DeviceFrame kind={kind} title="dev.orazaka.com">
        <p>screen</p>
      </DeviceFrame>,
    );
    expect(container.querySelector(`[data-device="${kind}"]`)).not.toBeNull();
    expect(within(container).getByText("screen")).toBeTruthy();
    if (kind !== "phone") expect(within(container).getByText("dev.orazaka.com")).toBeTruthy();
  });
});
