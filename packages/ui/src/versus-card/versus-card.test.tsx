import { render } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { VersusCard } from "./index";

const left = { name: "2.0", bird: "duck", stats: [{ label: "Bundle", value: 4, max: 8, display: "4 kB" }, { label: "Coverage", value: 94 }] } as const;
const right = { name: "1.9", bird: "owl", caption: "The one that reads", stats: [{ label: "Bundle", value: 6, max: 8, display: "6 kB" }, { label: "Coverage", value: 88 }] } as const;

describe("VersusCard", () => {
  it("is a named section: both subjects, the VS, every figure as text, and no axe violation", async () => {
    const { container, getByRole } = render(<VersusCard label="2.0 versus 1.9" left={left} right={right} source="size-limit" />);
    expect(getByRole("region", { name: "2.0 versus 1.9" })).toBeTruthy();
    expect(container.querySelector(".kz-versus-mark")?.textContent).toBe("VS");
    expect(container.querySelectorAll(".kz-versus-name")).toHaveLength(2);
    expect(container.querySelectorAll("dl")).toHaveLength(2);
    expect([...container.querySelectorAll(".kz-versus-value")].map((n) => n.textContent)).toEqual(["4 kB", "94", "6 kB", "88"]);
    expect(container.querySelector(".kz-versus-source")?.textContent).toBe("size-limit");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("fills each bar from the real value of its max, hides the bars and the birds from assistive technology", () => {
    const { container } = render(<VersusCard label="match" left={left} right={right} />);
    const fills = [...container.querySelectorAll<HTMLElement>(".kz-versus-bar")].map((n) => n.style.getPropertyValue("--kz-versus-fill"));
    expect(fills).toEqual(["50%", "94%", "75%", "88%"]);
    for (const bar of container.querySelectorAll(".kz-versus-bar")) expect(bar.getAttribute("aria-hidden")).toBe("true");
    for (const bird of container.querySelectorAll(".kz-versus-bird")) expect(bird.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector("[data-side='right'] .kz-versus-caption")?.textContent).toBe("The one that reads");
  });

  it("leaves out a stat that is not real data, and clamps a value above its max", () => {
    const { container } = render(
      <VersusCard label="match" left={{ ...left, stats: [{ label: "Broken", value: Number.NaN }, { label: "Over", value: 12, max: 10 }, { label: "Zero max", value: 1, max: 0 }] }} right={right} />,
    );
    const stats = [...container.querySelectorAll("[data-side='left'] dt")].map((n) => n.textContent);
    expect(stats).toEqual(["Over"]);
    expect((container.querySelector("[data-side='left'] .kz-versus-bar") as HTMLElement).style.getPropertyValue("--kz-versus-fill")).toBe("100%");
  });
});
