// Every web chart: rendered on the server (frame, summary, table, a placeholder of the right height), drawn in the
// browser, audited by axe, walked with the keyboard, its figures in the locale, its palette following the brand.
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ComponentType } from "react";
import { renderToString } from "react-dom/server";

import CreditsUsage from "../registry/examples/area-chart/credits-usage";
import JobsByStatus from "../registry/examples/bar-chart/jobs-by-status";
import TopSupporters from "../registry/examples/bar-chart/top-supporters";
import Publishing from "../registry/examples/calendar-heatmap/publishing";
import AuctionBids from "../registry/examples/candlestick/auction-bids";
import PolarUploads from "../registry/examples/chart/polar-uploads";
import FrenchOrazaka from "../registry/examples/charts-provider/french-orazaka";
import Signup from "../registry/examples/funnel/signup";
import CreditsQuota from "../registry/examples/gauge/credits-quota";
import Viewers from "../registry/examples/geo-map/viewers";
import DeploymentRegions from "../registry/examples/globe/deployment-regions";
import UploadActivity from "../registry/examples/heatmap/upload-activity";
import CreditSpend from "../registry/examples/pie-chart/credit-spend";
import ModelComparison from "../registry/examples/radar-chart/model-comparison";
import CreditFlow from "../registry/examples/sankey/credit-flow";
import WatchTime from "../registry/examples/scatter-chart/watch-time";
import StatTrend from "../registry/examples/sparkline/stat-trend";
import Storage from "../registry/examples/treemap/storage";
import { loadWorld } from "./geo/world";
import { axeViolations } from "./test/axe";
import { mockWidth } from "./test/setup";
import { CSS } from "./web/styles";

const EXAMPLES: [string, ComponentType, string][] = [
  ["area", CreditsUsage, "Area chart, 3 × 8"],
  ["bar", JobsByStatus, "Bar chart, 3 × 7"],
  ["horizontal bar", TopSupporters, "Bar chart, 6"],
  ["donut", CreditSpend, "Donut chart, 5. Chat · Mistral Large 18,400 (48%)"],
  ["gauge", CreditsQuota, "Gauge: 41.3K (50K), Nearing the limit."],
  ["sparkline", StatTrend, "Sparkline, 30"],
  ["map", Viewers, "Map, 12. France 48.2K (32%), Canada 31.5K (21%)"],
  ["globe", DeploymentRegions, "Globe, 5. Paris · eu-west-3 99.98%, Frankfurt · eu-central-1 99.95%"],
  ["radar", ModelComparison, "Radar chart, 2 × 5. Mistral Large: lowest 55 (Cost efficiency), highest 95 (French)."],
  ["heatmap", UploadActivity, "Heatmap, 8 × 7."],
  ["calendar", Publishing, "Calendar heatmap,"],
  ["sankey", CreditFlow, "Flow diagram, 7 · 11. Chat → Delivered 211 (47%)"],
  ["funnel", Signup, "Visited the creator page → Created an account 20%"],
  ["candlestick", AuctionBids, "Candlestick chart, 24 (12:00 AM – 11:00 PM). Opened at CA$120.00, closed at CA$228.60"],
  ["treemap", Storage, "Treemap, 4. Documentary “Fleuve” 546 GB"],
  ["scatter", WatchTime, "Scatter chart, 36. Length (min): 1 – 47; Average watch (min): 0.5 – 31.1; correlation 0.98."],
  ["chart", PolarUploads, "Uploads by hour: quietest at 02:00 (1), busiest at 19:00 (61)."],
];

beforeEach(() => mockWidth(640, 320));
// The map and the globe draw the world's countries, a lazy chunk: on a loaded runner its first import can outlast
// `waitFor`'s second (krizaka-ui#115; src/geo/world-slow.test.tsx). Loaded once before the suite, whatever it takes.
beforeAll(() => loadWorld(), 30_000);

describe.each(EXAMPLES)("%s", (_name, Example, summary) => {
  it("renders on the server with its summary and its data table, without drawing", () => {
    const html = renderToString(<Example />);
    expect(html.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/\u00a0|\u202f/g, " ")).toContain(summary.replace(/\u00a0|\u202f/g, " "));
    expect(html).toContain("<table");
    expect(html).toContain("kzc-sr");
  });

  it("is drawn in the browser and passes axe", async () => {
    const { container } = render(<Example />);
    await waitFor(() => expect(container.querySelector("figure")?.getAttribute("data-state")).not.toBe("loading"));
    expect(container.querySelector("figure")!.getAttribute("aria-labelledby")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("keyboard", () => {
  it("walks the items of an ECharts chart and announces each one", async () => {
    const { container } = render(<Signup />);
    const plot = await screen.findByRole("group");
    act(() => plot.focus());
    fireEvent.keyDown(plot, { key: "ArrowRight" });
    fireEvent.keyDown(plot, { key: "ArrowRight" });
    expect(container.querySelector("[aria-live]")!.textContent).toBe("Created an account: 9,640 (20%)");
    fireEvent.keyDown(plot, { key: "End" });
    expect(container.querySelector("[aria-live]")!.textContent).toBe("Made a first sale: 1,180 (37%)");
  });

  it("walks the slices of a donut and the bars of a ranking", () => {
    const { container, unmount } = render(<CreditSpend />);
    const plot = screen.getByRole("group");
    fireEvent.keyDown(plot, { key: "ArrowRight" });
    expect(container.querySelector("[aria-live]")!.textContent).toBe("Chat · Mistral Large: 18,400 (48%)");
    unmount();
    render(<TopSupporters />);
    fireEvent.keyDown(screen.getByRole("group"), { key: "Home" });
    expect(document.querySelector("[aria-live]")!.textContent).toBe("Léa Fontaine: Total €485.00");
  });
});

describe("theme and locale", () => {
  it("writes the figures in the provider's locale and marks the brand on the chart", () => {
    const { container } = render(<FrenchOrazaka />);
    expect(container.querySelector("figure")!.getAttribute("data-brand")).toBe("orazaka");
    expect(screen.getByRole("button", { name: /Actions du graphique/ })).toBeTruthy();
    expect(container.textContent).toContain("Histogramme, 4 (juin 2026 – sept. 2026).");
  });

  it("ships the palettes in light-dark() for every brand and guards every entrance with reduced motion", () => {
    expect(CSS).toContain("[data-kzc]{--kzc-1:light-dark(#2a78d6,#3987e5)");
    expect(CSS).toContain("[data-kzc][data-brand=orazaka]{--kzc-1:light-dark(#eb6834,#d95926)");
    expect(CSS).toContain(":where(.brand-orochia) [data-kzc]{--kzc-1:light-dark(#6250d6,#9085e9)");
    const motion = CSS.slice(CSS.indexOf("@media (prefers-reduced-motion:no-preference)"));
    expect(CSS.slice(0, CSS.indexOf("@media (prefers-reduced-motion:no-preference)"))).not.toMatch(/animation:kzc-/);
    expect(motion).toContain("kzc-draw");
  });
});
