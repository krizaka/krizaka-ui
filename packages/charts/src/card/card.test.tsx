import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";

import { BarChart } from "../bar";
import { DonutChart } from "../pie";
import { axeViolations } from "../test/axe";
import { mockWidth } from "../test/setup";
import { ChartCard, KpiStat } from "./index";

mockWidth();

const rows = [
  { day: "2026-10-01", jobs: 12 },
  { day: "2026-10-02", jobs: 18 },
  { day: "2026-10-03", jobs: 9 },
];

describe("ChartCard", () => {
  it("hands the chart its title and insight, with the actions menu beside them", async () => {
    const { container } = render(
      <ChartCard title="Jobs per day" insight="39 jobs · +10 % vs last week" footer="Source: your jobs" actions={<button type="button">7 days</button>}>
        <BarChart data={rows} x="day" y="jobs" yLabel="Jobs" />
      </ChartCard>,
    );
    expect(container.querySelector(".kzc-title")!.textContent).toBe("Jobs per day");
    expect(container.querySelector(".kzc-insight")!.textContent).toBe("39 jobs · +10 % vs last week");
    expect(container.querySelector(".kzc-card-foot")!.textContent).toBe("Source: your jobs");
    expect(screen.getByRole("group", { name: "Jobs per day" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "7 days" })).toBeTruthy();
    expect(await screen.findByRole("button", { name: "Chart actions — Jobs per day" }, {}, { timeout: 15_000 })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("renders on the server with the placeholder and the data in the page", () => {
    const html = renderToString(
      <ChartCard title="Jobs per day" insight="39 jobs">
        <BarChart data={rows} x="day" y="jobs" yLabel="Jobs" />
      </ChartCard>,
    );
    expect(html).toContain("Jobs per day");
    expect(html).toContain("<table");
  });

  it("filters the parts of a donut from its legend chips, values in the chips", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ChartCard title="By kind">
        <DonutChart data={[{ k: "Images", n: 60 }, { k: "Video", n: 40 }]} label="k" value="n" format="integer" />
      </ChartCard>,
    );
    const chips = screen.getAllByRole("button", { pressed: true });
    expect(chips[0]!.textContent).toContain("60");
    expect(chips[0]!.textContent).toContain("60%");
    expect(container.querySelectorAll("svg path.kzc-mark")).toHaveLength(2);
    await user.click(chips[1]!);
    expect(container.querySelectorAll("svg path.kzc-mark")).toHaveLength(1);
  });
});

describe("KpiStat", () => {
  it("writes the change against the previous period and draws the shape of the period", () => {
    const { container } = render(<KpiStat label="Jobs" value={195} previous={157} data={[1, 3, 2, 5, 4]} />);
    expect(container.textContent).toContain("+24%");
    expect(container.textContent).toContain("vs previous period");
    expect(container.querySelector("[data-trend=up]")).not.toBeNull();
    expect(container.querySelector(".kzc-kpistat")!.getAttribute("data-good")).toBe("up");
    expect(container.querySelector("figure[data-kind=sparkline]")).not.toBeNull();
  });

  it("says a fall is good news when lower is better", () => {
    const { container } = render(<KpiStat label="Time" value={3} previous={4} good="down" format={{ style: "unit", unit: "minute" }} />);
    expect(container.querySelector("[data-trend=down]")).not.toBeNull();
    expect(container.querySelector(".kzc-kpistat")!.getAttribute("data-good")).toBe("down");
    expect(container.querySelector("figure")).toBeNull();
  });

  it("shows no trend without a previous value", () => {
    const { container } = render(<KpiStat label="Jobs" value={12} />);
    expect(container.querySelector("[data-trend]")).toBeNull();
  });
});
