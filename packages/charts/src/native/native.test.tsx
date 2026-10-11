import { describe, expect, it } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react-native";

import CreatorEarnings from "../../registry/examples/line-chart/native/creator-earnings";
import CreditSpend from "../../registry/examples/pie-chart/native/credit-spend";
import { BarChart, ChartsProvider, Gauge, LineChart, Sparkline } from "./index";

const layout = { nativeEvent: { layout: { width: 320, height: 200, x: 0, y: 0 } } };
const data = [
  { month: "2026-04", v: 182_000 },
  { month: "2026-05", v: 164_000 },
  { month: "2026-06", v: 231_000 },
];

describe("native charts", () => {
  it("label the plot with the title and the written summary, and walk the points with the screen reader's actions", async () => {
    await render(<LineChart title="Earnings" data={data} x="month" y="v" yLabel="Earnings" format={{ style: "money", currency: "EUR" }} />);
    const plot = screen.getByRole("adjustable");
    expect(plot.props.accessibilityLabel).toContain("Earnings. Line chart, 3 (Apr 2026 – Jun 2026). Earnings: from €1,820.00 to €2,310.00");
    await act(async () => fireEvent(plot, "layout", layout));
    await act(async () => fireEvent(plot, "accessibilityAction", { nativeEvent: { actionName: "increment" } }));
    expect(screen.getByRole("adjustable").props.accessibilityValue.text).toBe("Apr 2026: Earnings €1,820.00");
    await act(async () => fireEvent(plot, "accessibilityAction", { nativeEvent: { actionName: "increment" } }));
    expect(screen.getByText("May 2026: Earnings €1,640.00", { includeHiddenElements: true })).toBeTruthy();
  });

  it("render the registry's examples once measured", async () => {
    const { toJSON } = await render(<CreatorEarnings />);
    await act(async () => fireEvent(screen.getByRole("adjustable"), "layout", layout));
    expect(JSON.stringify(toJSON())).toContain("Payout threshold");
    await render(<CreditSpend />);
    expect(screen.getAllByText(/Chat · /, { includeHiddenElements: true }).length).toBeGreaterThan(0);
  });

  it("write the figures in the provider's locale and follow its brand", async () => {
    await render(
      <ChartsProvider locale="fr-FR" brand="orazaka" scheme="light">
        <BarChart title="Crédits" data={data} x="month" y="v" yLabel="Crédits" format="compact" />
      </ChartsProvider>,
    );
    expect(screen.getByRole("adjustable").props.accessibilityLabel).toContain("juin 2026");
  });

  it("say the empty state and a gauge's value", async () => {
    await render(<Sparkline title="Views" data={[]} />);
    expect(screen.getByText("No data for this period yet.")).toBeTruthy();
    await render(<Gauge title="Credits" value={41_250} max={50_000} format="compact" />);
    expect(screen.getByRole("image").props.accessibilityLabel).toContain("41.3K / 50K");
  });
});
