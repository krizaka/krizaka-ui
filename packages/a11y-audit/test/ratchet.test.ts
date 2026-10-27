import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { A11yCollector, type A11yFinding,compare, finish, lowered, readBaseline } from "../src/index.js";

const f = (rule: string, target: string, impact: A11yFinding["impact"] = "serious"): A11yFinding => ({ rule, target, impact, help: rule });
const file = () => join(mkdtempSync(join(tmpdir(), "a11y-")), "a11y-baseline.json");

describe("A11yCollector", () => {
  it("counts a node once per rule, route, theme and selector — not once per width", () => {
    const c = new A11yCollector("demo");
    c.add({ route: "/", theme: "dark" }, [f("color-contrast", ".a")]);
    c.add({ route: "/", theme: "dark" }, [f("color-contrast", ".a")]);
    c.add({ route: "/", theme: "light" }, [f("color-contrast", ".a")]);
    c.add({ route: "/x", theme: "dark" }, [f("button-name", "button", "critical"), f("color-contrast", ".b", "minor")]);
    expect(c.counts()).toEqual({ "color-contrast": { impact: "serious", count: 3 }, "button-name": { impact: "critical", count: 1 } });
    expect(c.summary()[0]).toContain("critical");
    expect(c.examples("color-contrast", 1)).toHaveLength(1);
  });

  it("keeps the worst impact seen for a rule", () => {
    const c = new A11yCollector("demo");
    c.add({ route: "/", theme: "dark" }, [f("r", ".a", "moderate"), f("r", ".b", "critical"), f("r", ".c", "minor")]);
    expect(c.counts()["r"]).toEqual({ impact: "critical", count: 3 });
  });
});

describe("compare / lowered", () => {
  const base = { app: "demo", rules: { a: { impact: "serious" as const, count: 2 }, b: { impact: "minor" as const, count: 1 } } };

  it("fails on more violations than recorded and on a new rule; reports gains", () => {
    const out = compare(base, { a: { impact: "serious", count: 3 }, c: { impact: "critical", count: 1 } });
    expect(out.problems).toHaveLength(2);
    expect(out.gains).toEqual(["b: 1 -> 0"]);
  });

  it("passes at the baseline", () => {
    expect(compare(base, { a: { impact: "serious", count: 2 }, b: { impact: "minor", count: 1 } }).problems).toEqual([]);
  });

  it("lowers, never raises; init records as is; zero rules disappear", () => {
    const now = { a: { impact: "serious" as const, count: 5 }, b: { impact: "minor" as const, count: 0 }, z: { impact: "minor" as const, count: 1 } };
    expect(lowered(base, now, false).rules).toEqual({ a: { impact: "serious", count: 2 }, z: { impact: "minor", count: 1 } });
    expect(lowered(base, now, true).rules["a"]?.count).toBe(5);
  });
});

describe("finish", () => {
  it("init writes today's counts, then the same crawl passes, a worse one fails, a better one is noted then lowered", () => {
    const path = file();
    const crawl = (...fs: A11yFinding[]) => {
      const c = new A11yCollector("demo");
      c.add({ route: "/", theme: "dark" }, fs);
      return c;
    };
    expect(finish(crawl(f("a", ".1"), f("a", ".2")), { baseline: path, init: true }).problems).toEqual([]);
    expect(readBaseline(path, "demo").rules["a"]?.count).toBe(2);
    expect(finish(crawl(f("a", ".1"), f("a", ".2")), { baseline: path }).problems).toEqual([]);

    const worse = finish(crawl(f("a", ".1"), f("a", ".2"), f("a", ".3")), { baseline: path });
    expect(worse.problems[0]).toMatch(/^a11y a \(serious\): 3 > baseline 2; e\.g\. /);
    expect(finish(crawl(f("a", ".1"), f("a", ".2")), { baseline: path, update: true }).notes.join()).toContain("written");

    const better = finish(crawl(f("a", ".1")), { baseline: path });
    expect(better.problems).toEqual([]);
    expect(better.notes.join()).toContain("--a11y-update");
    finish(crawl(f("a", ".1")), { baseline: path, update: true });
    expect(JSON.parse(readFileSync(path, "utf8")).rules.a.count).toBe(1);
  });

  it("reads the flags of the command line, and a missing baseline is empty", () => {
    const path = file();
    const c = new A11yCollector("demo");
    c.add({ route: "/", theme: "dark" }, [f("a", ".1")]);
    expect(finish(c, { baseline: path }).problems).toHaveLength(1);
    const argv = process.argv;
    process.argv = [...argv, "--a11y-init"];
    try {
      expect(finish(c, { baseline: path }).problems).toEqual([]);
    } finally {
      process.argv = argv;
    }
    writeFileSync(path, "not json");
    expect(readBaseline(path, "demo").rules).toEqual({});
  });
});
