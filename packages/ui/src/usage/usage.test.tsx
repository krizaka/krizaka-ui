import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";

import { axeViolations } from "../test/axe";
import { CreditsMeter, parsePeriod, PeriodSwitch, UsageChart, usageTile,UsageTiles } from "./index";
import { periodHref, usageBars } from "./model";

describe("period", () => {
  it("reads ?period= and falls back on anything not offered", () => {
    expect(parsePeriod("90")).toBe(90);
    expect(parsePeriod(["7", "30"])).toBe(7);
    for (const raw of ["12", "abc", "", undefined, null, "-7"]) expect(parsePeriod(raw)).toBe(30);
    expect(parsePeriod("5", [5, 10], 10)).toBe(5);
  });
  it("keeps the other parameters of the address", () => {
    expect(periodHref("/credits?tab=a", 7)).toBe("/credits?tab=a&period=7");
    expect(periodHref("/credits?period=90", 30)).toBe("/credits?period=30");
  });
});

describe("usageTile", () => {
  it("writes fr-CA figures and French words by default, the change against the previous period", () => {
    const t = usageTile({ id: "a", label: "Vérifications", value: 1280, previous: 1000 });
    expect(t.value).toMatch(/^1\s280$/);
    expect(t.trend).toBe("up");
    expect(String(t.trendLabel)).toContain("vs période précédente");
    expect(String(t.trendLabel)).toContain("+28");
  });
  it("is steady inside half a percent, has no trend without a previous period, and speaks English on request", () => {
    expect(usageTile({ id: "a", label: "A", value: 100, previous: 100 })).toMatchObject({ trend: "flat", trendLabel: "stable" });
    expect(usageTile({ id: "a", label: "A", value: 100 }).trend).toBeUndefined();
    expect(usageTile({ id: "a", label: "A", value: 0, previous: 0 }).trend).toBe("flat");
    expect(usageTile({ id: "a", label: "A", value: 5, previous: 0 }).trend).toBeUndefined();
    expect(String(usageTile({ id: "a", label: "A", value: 112, previous: 100 }, { locale: "en-CA" }).trendLabel)).toBe("+12% vs previous period");
  });
});

describe("usageBars", () => {
  it("scales to the tallest day and shares each bar by outcome", () => {
    const bars = usageBars([{ label: "a", values: { x: 3, y: 1 } }, { label: "b", values: { x: 2 } }, { label: "c", values: {} }], [{ id: "x", label: "X", tone: "success" }, { id: "y", label: "Y", tone: "danger" }]);
    expect(bars.map((b) => b.height)).toEqual([1, 0.5, 0]);
    expect(bars[0]?.segments.map((s) => s.share)).toEqual([0.75, 0.25]);
    expect(bars[2]?.segments.every((s) => s.share === 0)).toBe(true);
  });
});

const outcomes = [{ id: "done", label: "Terminées", tone: "success" as const }, { id: "failed", label: "Échouées", tone: "danger" as const }];
const days = [{ label: "1 nov.", values: { done: 4, failed: 1 } }, { label: "2 nov.", values: { done: 6 } }];

describe("the blocks", () => {
  it("CreditsMeter is a meter named by its label with its value in words", async () => {
    const { container } = render(<CreditsMeter label="Crédits" balance={820} total={1000} renewal="Renouvelés le 1er décembre" />);
    const meter = screen.getByRole("meter", { name: "Crédits" });
    expect(meter.getAttribute("aria-valuetext")).toMatch(/^820 sur 1\s000$/);
    expect(meter.getAttribute("data-level")).toBe("success");
    expect(await axeViolations(container)).toEqual([]);
  });
  it("CreditsMeter turns to danger when the balance runs low", () => {
    render(<CreditsMeter label="Crédits" balance={50} total={1000} locale="en" />);
    expect(screen.getByRole("meter").getAttribute("data-level")).toBe("danger");
    expect(screen.getByRole("meter").getAttribute("aria-valuetext")).toBe("50 of 1,000");
  });
  it("PeriodSwitch links each period and marks the shown one", async () => {
    const { container } = render(<PeriodSwitch label="Période" value={30} href="/credits" />);
    expect(screen.getByRole("link", { name: "30 j" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "7 j" }).getAttribute("href")).toBe("/credits?period=7");
    expect(screen.getByRole("link", { name: "90 j" }).getAttribute("aria-current")).toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });
  it("UsageTiles draws the strip, or a busy skeleton while loading", () => {
    const { container, rerender } = render(<UsageTiles tiles={[{ id: "a", label: "Vérifications", value: 10, previous: 5 }, { id: "b", label: "Signalées", value: 1 }]} />);
    expect(container.querySelectorAll("dt")).toHaveLength(2);
    rerender(<UsageTiles loading tiles={[]} />);
    expect(container.querySelector("dl")).toBeNull();
    expect(container.firstElementChild?.getAttribute("aria-busy")).toBe("true");
  });
  it("UsageChart has a legend with totals and a text version of every day, no axe violation", async () => {
    const { container } = render(<UsageChart title="Activité" days={days} outcomes={outcomes} columns={{ day: "Jour", total: "Total" }} emptyLabel="Rien" />);
    expect(screen.getByRole("table", { name: "Activité" })).toBeTruthy();
    expect(screen.getAllByRole("row")).toHaveLength(3);
    expect(screen.getAllByText("Terminées")[0]?.parentElement?.textContent).toContain("10");
    expect(await axeViolations(container)).toEqual([]);
  });
  it("UsageChart says it is empty, or busy, and renders on the server", () => {
    const empty = render(<UsageChart title="Activité" days={[{ label: "1", values: {} }]} outcomes={outcomes} columns={{ day: "Jour", total: "Total" }} emptyLabel="Rien" />);
    expect(screen.getByText("Rien")).toBeTruthy();
    empty.unmount();
    expect(renderToStaticMarkup(<UsageChart loading title="A" days={[]} outcomes={[]} columns={{ day: "J", total: "T" }} emptyLabel="Rien" />)).toContain('aria-busy="true"');
  });
});
