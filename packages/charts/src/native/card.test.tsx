// KpiStat and ChartCard on a phone (krizaka-ui#275): the figure, its change and the period read as one element; the
// direction's colour follows `good`; the card's title is a heading and the chart inside keeps its own summary.
import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";

import { BarChart, ChartCard, KpiStat } from "./index";

describe("native KpiStat and ChartCard", () => {
  it("writes the change against the previous period in words, read with the figure and the hint", async () => {
    await render(<KpiStat label="Jobs" value={144} previous={112} format="integer" hint="last 7 days" />);
    expect(screen.getByLabelText("Jobs, 144, +29% vs previous period, last 7 days")).toBeTruthy();
  });

  it("says nothing about a change it cannot compute, and draws the period's sparkline when there is one", async () => {
    await render(<KpiStat label="Spend" value={40} previous={0} format="integer" data={[10, 20, 40]} />);
    expect(screen.getByLabelText("Spend, 40")).toBeTruthy();
    expect(screen.getByRole("image").props.accessibilityLabel).toMatch(/^Spend\. /);
  });

  it("takes the author's words for the change", async () => {
    await render(<KpiStat label="Latency" value={640} previous={840} good="down" format="integer" trendLabel="200 ms faster" />);
    expect(screen.getByLabelText("Latency, 640, 200 ms faster")).toBeTruthy();
  });

  it("frames a chart: the title is a heading, the insight, the description and the footer follow", async () => {
    await render(
      <ChartCard title="Earnings" insight="$3,120 · +13 %" description="Net of fees" footer="Updated a minute ago">
        <BarChart title="Earnings" hideTitle data={[{ m: "2026-09", v: 1 }, { m: "2026-10", v: 2 }]} x="m" y="v" />
      </ChartCard>,
    );
    expect(screen.getByRole("heading", { name: "Earnings" })).toBeTruthy();
    for (const words of ["$3,120 · +13 %", "Net of fees", "Updated a minute ago"]) expect(screen.getByText(words)).toBeTruthy();
    expect(screen.getAllByRole("heading")).toHaveLength(1);
  });
});
