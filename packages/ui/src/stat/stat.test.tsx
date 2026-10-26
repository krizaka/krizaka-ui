import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";

import { axeViolations } from "../test/axe";
import { Stat, StatGrid } from "./index";

describe("Stat", () => {
  it("shows the label, the value, the hint and the trend in words, with no axe violation", async () => {
    const { container } = render(<Stat label="Revenue" value="€1,204" hint="this week" trend="up" trendLabel="+12 %" />);
    expect(screen.getByText("€1,204").className).toContain("tabular-nums");
    const trend = screen.getByText("+12 %");
    expect(trend.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect((container.firstChild as HTMLElement).dataset.trend).toBe("up");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("draws no arrow without words, and renders on the server", () => {
    const { container } = render(<Stat label="Views" value="12" trend="down" />);
    expect(container.querySelector("svg")).toBeNull();
    expect(renderToStaticMarkup(<Stat label="Views" value="12" />)).toContain("Views");
  });

  describe("StatGrid variant=strip", () => {
    const items = [
      { id: "a", label: "Checks run in the last thirty days", value: "128", trend: "up" as const, trendLabel: "+12 % vs previous", chart: <span data-testid="spark" /> },
      { id: "b", label: "Flagged", value: "9", trend: "down" as const, trendLabel: "−2 vs previous" },
    ];

    it("is a description list of figures read in order: label, value, trend in words", async () => {
      const { container } = render(<StatGrid variant="strip" aria-label="Activity" items={items} />);
      const dl = container.querySelector("dl");
      expect(dl).not.toBeNull();
      expect(Array.from(dl!.querySelectorAll("dt, dd")).map((n) => n.tagName + ":" + n.textContent)).toEqual([
        "DT:Checks run in the last thirty days",
        "DD:128",
        "DD:+12 % vs previous",
        "DD:",
        "DT:Flagged",
        "DD:9",
        "DD:−2 vs previous",
      ]);
      expect(await axeViolations(container)).toEqual([]);
    });

    it("keeps the full label as the name of a truncated one, one row, and a period slot", () => {
      render(<StatGrid variant="strip" items={items} period={<button type="button">30 d</button>} />);
      expect(screen.getByText("Flagged").closest("dl")?.className).toContain("flex");
      expect(screen.getByText("Checks run in the last thirty days").getAttribute("title")).toBe("Checks run in the last thirty days");
      expect(screen.getByRole("button", { name: "30 d" })).toBeTruthy();
    });

    it("refuses nothing on the server and draws the sparkline slot", () => {
      expect(renderToStaticMarkup(<StatGrid variant="strip" items={items} />)).toContain('data-testid="spark"');
    });
  });
});
