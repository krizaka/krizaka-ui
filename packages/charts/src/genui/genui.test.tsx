import { baseGenUiCatalog, GenUiStream, validateMessage } from "@krizaka/ui/genui";
import { render, screen } from "@testing-library/react";

import { chartFormat, chartsGenUiCatalog } from "./index";

const catalog = { ...baseGenUiCatalog, ...chartsGenUiCatalog };
const message = (components: unknown[]) => ({ version: "v0.9", updateComponents: { surfaceId: "s", components } });

describe("chartsGenUiCatalog", () => {
  it("draws a KpiStat and a ChartCard bound to the data model", () => {
    const text = [
      "```a2ui",
      JSON.stringify({ version: "v0.9", createSurface: { surfaceId: "s", catalogId: "krizaka:genui/v1" } }),
      JSON.stringify(message([
        { id: "root", component: "Column", children: ["k", "c"] },
        { id: "k", component: "KpiStat", label: "Views", value: { path: "/views" }, previous: 100, format: "integer" },
        { id: "c", component: "ChartCard", title: "Per day", kind: "bar", x: "day", series: [{ key: "n", label: "Views" }], data: { path: "/days" } },
      ])),
      JSON.stringify({ version: "v0.9", updateDataModel: { surfaceId: "s", path: "/", value: { views: 150, days: [{ day: "Mon", n: 3 }, { day: "Tue", n: 5 }] } } }),
      "```",
    ].join("\n");
    render(<GenUiStream text={text} catalog={catalog} />);
    expect(screen.getAllByText("Views").length).toBeGreaterThan(0);
    expect(document.querySelector("[data-genui-surface]")).toBeTruthy();
    expect(screen.getAllByText("Per day").length).toBeGreaterThan(0);
  });

  it("refuses free-form formats, unknown kinds, bad series and extra properties", () => {
    const bad = [
      { id: "k", component: "KpiStat", label: "x", value: 1, format: "javascript:alert(1)" },
      { id: "k", component: "KpiStat", label: "x", value: "1e999" },
      { id: "k", component: "KpiStat", label: "x", value: 1, format: "money" },
      { id: "c", component: "ChartCard", title: "t", kind: "flash", x: "d", series: [{ key: "n", label: "n" }], data: { path: "/d" } },
      { id: "c", component: "ChartCard", title: "t", kind: "bar", x: "d", series: [{ key: "n", label: "n", color: "url(x)" }], data: { path: "/d" } },
      { id: "c", component: "ChartCard", title: "t", kind: "bar", x: "d", series: [], data: { path: "/d" } },
      { id: "c", component: "ChartCard", title: "t", kind: "bar", x: "d", series: [{ key: "n", label: "n" }], data: [{ inline: true }] },
      { id: "c", component: "ChartCard", title: "t", kind: "bar", x: "d", series: [{ key: "n", label: "n" }], data: { path: "/__proto__" } },
    ];
    for (const component of bad) expect(validateMessage(message([component]), catalog).ok, JSON.stringify(component)).toBe(false);
  });

  it("maps the closed formats onto the charts' formats", () => {
    expect(chartFormat("money", "CAD")).toEqual({ style: "money", currency: "CAD" });
    expect(chartFormat("percent", undefined)).toBe("percent");
    expect(chartFormat(undefined, undefined)).toBe("number");
  });
});
