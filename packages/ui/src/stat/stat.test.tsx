import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";

import { axeViolations } from "../test/axe";
import { Stat } from "./index";

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
});
