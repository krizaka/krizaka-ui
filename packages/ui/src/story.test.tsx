// The storytelling kit: ScrollStage, Scene, ChoiceGrid, ProfileCard, StageBanner, GoalGauge, ContinuePrompt, Achievement,
// Landscape and the Phoenix.
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { act, fireEvent, render, screen } from "@testing-library/react";

import { Achievement, AchievementList, Emblem } from "./achievement";
import { ChoiceGrid } from "./choice-grid";
import { ContinuePrompt } from "./continue-prompt";
import { GoalGauge } from "./goal-gauge";
import { Landscape } from "./landscape";
import { Phoenix } from "./mascots";
import { ProfileCard, StatGauge } from "./profile-card";
import { PromiseCard } from "./promise-card";
import { Scene, ScrollStage } from "./scroll-stage";
import { StageBanner } from "./stage-banner";
import { axeViolations } from "./test/axe";

const items = [
  { id: "a", visual: <span />, name: "Starter" },
  { id: "b", visual: <span />, name: "Creator" },
  { id: "c", visual: <span />, name: "Studio", disabled: true },
];

function mockMotion(reduce: boolean) {
  const observed: Element[] = [];
  let callback: IntersectionObserverCallback = () => {};
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: reduce && q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} }));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: IntersectionObserverCallback) {
        callback = cb;
      }
      observe(el: Element) {
        observed.push(el);
      }
      disconnect() {}
      unobserve() {}
    },
  );
  const fire = (el: Element, isIntersecting: boolean) => act(() => callback([{ target: el, isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver));
  return { observed, fire };
}

describe("ScrollStage", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("plays a scene once (data-in stays) and runs its loop only while visible (data-live)", () => {
    const { observed, fire } = mockMotion(false);
    render(
      <ScrollStage variant="arcade" data-testid="stage">
        <Scene brand="yomizaka" data-testid="scene">
          <p>Chapter</p>
        </Scene>
      </ScrollStage>,
    );
    const stage = screen.getByTestId("stage");
    const scene = screen.getByTestId("scene");
    expect(stage.getAttribute("data-kzs-stage")).toBe("on");
    expect(stage.className).toContain("kzs-arcade");
    expect(scene.className).toBe("brand-yomizaka");
    expect(observed).toContain(scene);
    fire(scene, true);
    expect(scene.hasAttribute("data-in") && scene.hasAttribute("data-live")).toBe(true);
    fire(scene, false);
    expect(scene.hasAttribute("data-in")).toBe(true);
    expect(scene.hasAttribute("data-live")).toBe(false);
  });

  it("never switches motion on under prefers-reduced-motion", () => {
    const { observed } = mockMotion(true);
    render(
      <ScrollStage data-testid="stage">
        <Scene>
          <p>Chapter</p>
        </Scene>
      </ScrollStage>,
    );
    expect(screen.getByTestId("stage").hasAttribute("data-kzs-stage")).toBe(false);
    expect(observed).toEqual([]);
  });
});

describe("ChoiceGrid", () => {
  it("selectable: a radio group, one tab stop, the arrows choose and skip what is disabled", async () => {
    const chosen: string[] = [];
    const { container } = render(<ChoiceGrid label="Choose your plan" items={items} defaultValue="a" onValueChange={(id) => chosen.push(id)} />);
    const group = screen.getByRole("radiogroup", { name: "Choose your plan" });
    const radios = screen.getAllByRole("radio");
    expect(group).toBeTruthy();
    expect(radios.map((r) => r.getAttribute("tabindex"))).toEqual(["0", "-1", "-1"]);
    fireEvent.keyDown(radios[0]!, { key: "ArrowRight" });
    expect(chosen).toEqual(["b"]);
    expect(radios[1]!.getAttribute("aria-checked")).toBe("true");
    fireEvent.keyDown(radios[1]!, { key: "ArrowRight" });
    expect(chosen).toEqual(["b", "a"]);
    fireEvent.keyDown(radios[0]!, { key: "End" });
    expect(chosen.at(-1)).toBe("b");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("a showcase is a named list, played on mount unless still", () => {
    const { container } = render(<ChoiceGrid label="The line-up" items={items} variant="arcade" animated={false} />);
    expect(screen.getByRole("list", { name: "The line-up" }).children).toHaveLength(3);
    expect(screen.queryByRole("radio")).toBeNull();
    const root = container.firstElementChild!;
    expect(root.className).toContain("kzs-arcade");
    expect(root.hasAttribute("data-animated")).toBe(false);
  });
});

describe("ProfileCard", () => {
  it("is an article headed by the name, each gauge a meter with its value in words", async () => {
    const { container } = render(
      <ProfileCard
        visual={<span />}
        name="Elena"
        statLabel="Profile complete"
        value={80}
        stats={[{ label: "Challenges met", value: 12, max: 15, valueText: "12 of 15" }]}
        caption="Montréal"
        brand="yomizaka"
      />,
    );
    expect(screen.getByRole("article").className).toContain("brand-yomizaka");
    expect(screen.getByRole("heading", { level: 3, name: "Elena" })).toBeTruthy();
    const meters = screen.getAllByRole("meter");
    expect(meters.map((m) => m.getAttribute("aria-valuetext"))).toEqual(["80 %", "12 of 15"]);
    expect(meters[1]!.getAttribute("aria-valuenow")).toBe("80");
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("GoalGauge", () => {
  it("is a meter counted in steps; fill animates the lit steps, drain the spent ones", () => {
    const { rerender } = render(<GoalGauge label="Backers" segments={10} value={6} />);
    const meter = screen.getByRole("meter", { name: "Backers" });
    expect(meter.getAttribute("aria-valuenow")).toBe("6");
    expect(meter.getAttribute("aria-valuemax")).toBe("10");
    expect(meter.getAttribute("aria-valuetext")).toBe("6 / 10");
    expect(meter.querySelectorAll("[data-lit][data-animate]")).toHaveLength(6);
    rerender(<GoalGauge label="Seats left" segments={12} value={3} mode="drain" valueText="3 seats left" />);
    expect(screen.getByRole("meter").querySelectorAll("[data-animate]:not([data-lit])")).toHaveLength(9);
  });
});

describe("StageBanner, ContinuePrompt, Achievement", () => {
  it("announces a chapter, large with a heading", () => {
    render(<StageBanner size="lg" titleAs="h2" stage="Final round" title="The last boss" />);
    expect(screen.getByRole("heading", { level: 2, name: "The last boss" })).toBeTruthy();
  });

  it("the prompt's action is a button with onAction, a link with href", async () => {
    const onAction = vi.fn();
    const { container, rerender } = render(<ContinuePrompt title="Continue?" countdown={{ from: 9, to: 7 }} actionKey="1P Start" actionLabel="Back to the top" onAction={onAction} variant="arcade" />);
    fireEvent.click(screen.getByRole("button", { name: "Back to the top" }));
    expect(onAction).toHaveBeenCalledOnce();
    expect(container.querySelector(".kzs-prompt-screen")?.className).toContain("theme-dark");
    expect(container.querySelector("style")?.textContent).toContain("kzs-count-9-7");
    expect(await axeViolations(container)).toEqual([]);
    rerender(<ContinuePrompt title="Keep your studio?" actionLabel="Continue" href="#plans" />);
    expect(screen.getByRole("link", { name: "Continue" }).getAttribute("href")).toBe("#plans");
  });

  it("achievements are an ordered list, what they replaced deleted text, each staggered", async () => {
    const { container } = render(
      <AchievementList>
        <Achievement icon={<Emblem kind="sword" />} eyebrow="01" badge="Done" replaced="Paying 30 %" title="90 % to you" />
        <Achievement eyebrow="02" badge="Locked" locked title="Your first auction" />
      </AchievementList>,
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[1]!.getAttribute("style")).toContain("--i: 1");
    expect(container.querySelector("del")?.textContent).toBe("Paying 30 %");
    expect(container.querySelector("[data-locked]")?.textContent).toContain("Locked");
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("ChoiceGrid links, StatGauge, PromiseCard", () => {
  it("tiles with href are links in a named list", async () => {
    const { container } = render(
      <ChoiceGrid label="The products" items={[{ id: "a", visual: <span />, name: "Orazaka", href: "#a", badge: "P1", extra: <StatGauge label="Share" value={90} />, meta: "Stage 01" }]} />,
    );
    expect(screen.getByRole("list", { name: "The products" })).toBeTruthy();
    expect(screen.getByRole("link").getAttribute("href")).toBe("#a");
    expect(screen.getByRole("meter", { name: "Share" }).getAttribute("aria-valuetext")).toBe("90 %");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("a promise reads its label, words and bearer; the keys are hidden", async () => {
    const { container } = render(<PromiseCard label="Our promise" promise="Your data never leaves home." keys={["⌘", "K"]} bearer={<span />} bearerName="The owl" />);
    expect(container.textContent).toContain("Your data never leaves home.");
    expect(container.querySelector(".kzs-promise-keys")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelectorAll("kbd")).toHaveLength(2);
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("Landscape and Phoenix", () => {
  it("the landscape is decorative, its ids unique per instance, its loops held when still", () => {
    const { container } = render(
      <>
        <Landscape animated={false} />
        <Landscape tone="brand" flock={false} phoenix={false} />
      </>,
    );
    const [a, b] = Array.from(container.querySelectorAll(".kzl"));
    expect(a!.getAttribute("aria-hidden")).toBe("true");
    expect(a!.hasAttribute("data-still")).toBe(true);
    const ids = Array.from(container.querySelectorAll("[id]")).map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(b!.querySelector(".kzl-falcon-bot")).toBeNull();
    expect(b!.querySelector(".kzl-cyber-phoenix")).toBeNull();
    expect(a!.querySelector(".kzl-falcon-bot")).not.toBeNull();
  });

  it("the phoenix is an image only with a title", () => {
    render(<Phoenix title="The phoenix" tone="brand" />);
    expect(screen.getByRole("img", { name: "The phoenix" })).toBeTruthy();
  });
});

describe("story.css", () => {
  const css = readFileSync(join(import.meta.dirname, "story.css"), "utf8");
  it("plays its keyframes only without a reduced-motion preference, and uses tokens only", () => {
    const motion = css.slice(css.indexOf("@media (prefers-reduced-motion: no-preference)"));
    expect(css.slice(0, css.indexOf("@media (prefers-reduced-motion: no-preference)"))).not.toMatch(/animation:/);
    expect(motion).toMatch(/\[data-in\] \.kzs-profile/);
    expect(css).not.toMatch(/#[0-9a-f]{3,6}\b/i);
  });
});
