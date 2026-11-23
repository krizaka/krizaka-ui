import { act, render, screen } from "@testing-library/react";

import Example from "../../registry/examples/story-scroll/document";
import { axeViolations } from "../test/axe";
import { StoryScroll, type StoryStep } from "./index";

const steps: StoryStep[] = [
  { id: "a", title: "It arrives", cue: "arrive" },
  { id: "b", title: "It reads", cue: "read", light: "accent-2", mood: "thinking" },
  { id: "c", title: "You decide", cue: "decide", light: "success", mood: "success" },
];

type Seen = (entries: { isIntersecting: boolean; target: Element }[]) => void;
let observed: { fire: Seen; targets: Element[] } | undefined;

function stubMotion(reduced: boolean) {
  vi.stubGlobal("matchMedia", (media: string) => ({ matches: reduced && media.includes("reduce"), media, addEventListener() {}, removeEventListener() {} }));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      targets: Element[] = [];
      constructor(fire: Seen) {
        observed = { fire, targets: this.targets };
      }
      observe(el: Element) {
        this.targets.push(el);
      }
      disconnect() {}
    },
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  observed = undefined;
});

describe("StoryScroll", () => {
  it("names the section, keeps each step a real heading, hides the scene, and has no axe violation", async () => {
    stubMotion(false);
    const { container } = render(<Example />);
    expect(screen.getByRole("region", { name: "How a file is checked" })).toBeTruthy();
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThanOrEqual(3);
    expect(container.querySelector(".kz-story-stage")?.getAttribute("aria-hidden")).toBe("true");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("moves the scene to the step in view: its id, its cue, the cues reached and its light", () => {
    stubMotion(false);
    const { container } = render(<StoryScroll label="Story" steps={steps} scene={<p>scene</p>} guide="owl" />);
    const stage = container.querySelector<HTMLElement>(".kz-story-stage");
    expect(stage?.dataset.step).toBe("a");
    act(() => observed?.fire([{ isIntersecting: true, target: observed.targets[1] as Element }]));
    expect(stage?.dataset.step).toBe("b");
    expect(stage?.dataset.cues).toBe("arrive read");
    expect(stage?.dataset.light).toBe("accent-2");
    expect(container.querySelectorAll(".kz-story-ticks [data-on]")).toHaveLength(2);
    expect(screen.getByText("It reads").closest("li")?.getAttribute("aria-current")).toBe("step");
  });

  it("is one still plate under reduced motion: the journey's end, every cue reached, nothing observed", () => {
    stubMotion(true);
    const { container } = render(<StoryScroll label="Story" steps={steps} scene={<p>scene</p>} />);
    const stage = container.querySelector<HTMLElement>(".kz-story-stage");
    expect(container.querySelector(".kz-story")?.getAttribute("data-tier")).toBe("still");
    expect(stage?.dataset.step).toBe("c");
    expect(stage?.dataset.cues).toBe("arrive read decide");
    expect(observed).toBeUndefined();
  });
});
