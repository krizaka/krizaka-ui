import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { DecisionList } from "./index";

const labels = { chose: "We chose", refused: "We refused", because: "Because", cost: "What it costs you" };

describe("DecisionList", () => {
  it("numbers the decisions, each with its four labelled parts, with no axe violation", async () => {
    const { container } = render(
      <DecisionList
        labels={labels}
        decisions={[
          { id: "a", chose: "Local", refused: "Hosted", because: "No leak", cost: "A GPU" },
          { id: "b", chose: "No telemetry", refused: "Stats", because: "Privacy", cost: "Tell us" },
        ]}
      />,
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]?.textContent).toContain("01");
    expect(items[1]?.textContent).toContain("What it costs you");
    expect(items[1]?.getAttribute("data-reveal")).toBe("soft");
    expect((items[1] as HTMLElement).style.getPropertyValue("--kz-delay")).toBe("70ms");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("can stay still", () => {
    const { container } = render(<DecisionList reveal={false} labels={labels} decisions={[{ chose: "A", refused: "B", because: "C", cost: "D" }]} />);
    expect(container.querySelector("[data-reveal]")).toBeNull();
  });
});
