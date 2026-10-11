import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";

import { axeViolations } from "../test/axe";
import { mockWidth } from "../test/setup";
import { AreaChart, LineChart } from "./index";

const earnings = [
  { month: "2026-01", earnings: 182000, tips: 21000 },
  { month: "2026-02", earnings: 164000, tips: 18000 },
  { month: "2026-03", earnings: 231000, tips: 26000 },
  { month: "2026-04", earnings: 298000, tips: 31000 },
  { month: "2026-05", earnings: 276000, tips: 35000 },
  { month: "2026-06", earnings: 342000, tips: 41000 },
];
const series = [
  { key: "earnings", label: "Earnings" },
  { key: "tips", label: "Tips" },
] as const;
const money = { style: "money", currency: "EUR" } as const;

beforeEach(() => mockWidth());

describe("LineChart", () => {
  it("renders on the server: the frame, the summary and the data table, a placeholder of the exact height", () => {
    const html = renderToString(<LineChart title="Earnings" data={earnings} x="month" series={series} format={money} height={240} />);
    expect(html).toContain("Earnings");
    expect(html).toContain("height:240px");
    expect(html).toContain("<table");
    expect(html).toContain("€3,420.00");
    expect(html).toContain("Line chart, 2 × 6 (Jan 2026 – Jun 2026).");
    expect(html).not.toContain("<path");
  });

  it("draws in the browser, writes the summary with min, max and trend, and passes axe", async () => {
    const { container } = render(<LineChart title="Earnings" data={earnings} x="month" series={series} format={money} />);
    expect(container.querySelectorAll("path.kzc-line")).toHaveLength(2);
    const summary = container.querySelector(".kzc-sr")!.parentElement!.querySelector("p.kzc-sr:not(.kzc-title)");
    expect(container.textContent).toContain("Earnings: from €1,820.00 to €3,420.00, lowest €1,640.00 (Feb 2026), highest €3,420.00 (Jun 2026), up 88%.");
    expect(summary).not.toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("walks the points with the keyboard and announces each one", () => {
    const { container } = render(<LineChart title="Earnings" data={earnings} x="month" series={series} format={money} />);
    const plot = screen.getByRole("group");
    act(() => plot.focus());
    fireEvent.keyDown(plot, { key: "ArrowRight" });
    expect(container.querySelector("[aria-live]")!.textContent).toBe("Jan 2026: Earnings €1,820.00, Tips €210.00");
    fireEvent.keyDown(plot, { key: "End" });
    expect(container.querySelector("[aria-live]")!.textContent).toContain("Jun 2026");
    expect(container.querySelector(".kzc-tip")).not.toBeNull();
    fireEvent.keyDown(plot, { key: "Escape" });
    expect(container.querySelector(".kzc-tip")).toBeNull();
  });

  it("writes the figures in the locale", () => {
    const { container } = render(<LineChart title="Revenus" data={earnings} x="month" y="earnings" yLabel="Revenus" format={money} locale="fr-FR" />);
    expect(container.querySelector("table")!.textContent).toContain("3 420,00 €".replace(/ /g, " ").replace(" €", " €"));
  });

  it("shows the data table on demand", () => {
    const { container } = render(<LineChart title="Earnings" data={earnings} x="month" series={series} />);
    const button = screen.getByRole("button", { name: "Show data" });
    expect(container.querySelector("table")!.parentElement!.className).toBe("kzc-sr");
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(container.querySelector("table")!.parentElement!.className).toBe("kzc-table-wrap");
  });

  it("says loading, empty and error at the chart's height", () => {
    const { rerender, container } = render(<LineChart title="Earnings" data={[]} x="month" series={series} loading />);
    expect(screen.getByRole("status").textContent).toBe("Loading chart…");
    rerender(<LineChart title="Earnings" data={[]} x="month" series={series} />);
    expect(screen.getByRole("status").textContent).toBe("No data for this period yet.");
    rerender(<LineChart title="Earnings" data={earnings} x="month" series={series} error />);
    expect(screen.getByRole("alert").textContent).toBe("The chart could not be loaded.");
    expect(container.querySelector(".kzc-plot")!.getAttribute("style")).toContain("height: 280px");
  });

  it("draws thresholds and stacked areas", () => {
    const { container } = render(<AreaChart title="Earnings" data={earnings} x="month" series={series} stacked thresholds={[{ value: 300000, label: "Payout threshold", tone: "success" }]} format={money} />);
    expect(container.querySelectorAll("path.kzc-area")).toHaveLength(2);
    expect(container.textContent).toContain("Payout threshold at €3,000.00");
  });
});
