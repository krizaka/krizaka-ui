import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Stepper } from "./index";

const labels = { done: "Done", current: "In progress", upcoming: "Upcoming", error: "Failed" };

describe("Stepper", () => {
  it("is an ordered list: states from `current`, said in words, the current step marked", async () => {
    const { container } = render(<Stepper aria-label="Job" labels={labels} current={1} steps={[{ title: "Upload" }, { title: "Transcode", value: 0.5 }, { title: "Publish" }]} />);
    const items = screen.getAllByRole("listitem");
    expect(items.map((li) => li.dataset.status)).toEqual(["done", "current", "upcoming"]);
    expect(items[1]?.getAttribute("aria-current")).toBe("step");
    expect(items.map((li) => li.querySelector("p")?.textContent)).toEqual(["Upload — Done", "Transcode — In progress", "Publish — Upcoming"]);
    expect(items[1]?.querySelector("svg")?.getAttribute("data-progress")).toBe("50");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("lets a step say it failed, and shows its content", () => {
    render(<Stepper labels={labels} current={0} steps={[{ title: "Transfer", status: "error", content: <button type="button">Retry</button> }]} />);
    const step = screen.getByRole("listitem");
    expect(step.dataset.status).toBe("error");
    expect(step.querySelector(".kz-loader-mark")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Retry" })).toBeTruthy();
  });
});
