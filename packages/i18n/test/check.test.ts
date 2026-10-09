import path from "node:path";

import { checkMessages, findUnused, flatten, formatReport } from "../src/check-entry";
import { tree } from "./helpers";

const en = {
  nav: { title: "Home", lead: "{count} repos in <b>{org}</b>", link: "Read <a>docs</a>" },
  bids: { one: "{count} bid", other: "{count} bids" },
  steps: [{ title: "One" }, "Two"],
};

describe("flatten", () => {
  it("keys leaves by dotted path, lists by index, plural sets as one leaf", () => {
    expect([...flatten(en).keys()]).toEqual(["nav.title", "nav.lead", "nav.link", "bids", "steps[0].title", "steps[1]"]);
  });
});

describe("checkMessages", () => {
  it("passes complete catalogues", () => {
    const fr = {
      nav: { title: "Accueil", lead: "{count} dépôts chez <b>{org}</b>", link: "Lire <a>la doc</a>" },
      bids: { one: "{count} enchère", many: "{count} d'enchères", other: "{count} enchères" },
      steps: [{ title: "Un" }, "Deux"],
    };
    const result = checkMessages({ dir: tree({ "en.json": en, "fr.json": fr, "notes.txt": "x" }) });
    expect(result).toEqual({ ok: true, reference: "en", locales: ["en", "fr"], messages: 6, problems: [] });
    expect(formatReport(result)).toBe("✓ i18n: 6 messages, every locale complete");
  });

  it("passes a single reference catalogue", () => {
    const result = checkMessages({ dir: tree({ "en.json": en }) });
    expect(formatReport(result)).toBe("✓ i18n: 6 messages, en only");
  });

  it("reports missing, unknown, empty, placeholder, markup and plural problems", () => {
    const fr = {
      nav: { title: " ", lead: "{total} dépôts chez {org}", link: "Lire <a>la doc</a> <i>!</i>", extra: "x" },
      bids: "enchères",
      steps: [{ title: "Un" }],
    };
    const de = { nav: { title: "Start", lead: "{count} <b>{org}</b>", link: "<a>Doku</a>" }, bids: { other: "" }, steps: [{ title: 1 }, "Zwei"] };
    const result = checkMessages({ dir: tree({ "en.json": { ...en, empty: "" }, "fr.json": fr, "de.json": de }) });
    expect(result.ok).toBe(false);
    expect(result.problems.map((p) => p.message)).toEqual([
      "en: empty empty",
      "de: missing empty",
      "de: empty bids",
      "de: placeholders differ in bids",
      'de: steps[0].title is not a message (1)',
      "fr: missing steps[1]",
      "fr: missing empty",
      "fr: empty nav.title",
      "fr: placeholders differ in nav.lead",
      "fr: markup differs in nav.lead",
      "fr: unsupported markup <i> </i> in nav.link (only <b> and <a>)",
      "fr: markup differs in nav.link",
      "fr: unknown nav.extra (not in en.json)",
      "fr: bids must be a plural set as in en.json",
    ]);
  });

  it("reports a string expected where a plural set is given", () => {
    const result = checkMessages({ dir: tree({ "en.json": { a: "x" }, "fr.json": { a: { one: "y", other: "z" } } }) });
    expect(result.problems.map((p) => p.message)).toEqual(["fr: a must be a string as in en.json"]);
  });

  it("skips comparing a reference leaf that is not a message", () => {
    const result = checkMessages({ dir: tree({ "en.json": { n: 1 }, "fr.json": { n: "1" } }) });
    expect(result.problems.map((p) => p.kind)).toEqual(["invalid"]);
  });

  it("reports a missing reference, an unreadable catalogue and a missing folder", () => {
    expect(checkMessages({ dir: tree({ "fr.json": {} }) }).problems[0]?.message).toMatch(/^no en\.json in /);
    expect(checkMessages({ dir: "/nonexistent/krizaka" }).problems[0]?.kind).toBe("invalid");
    expect(checkMessages({ dir: tree({ "en.json": "{" }) }).problems[0]?.message).toMatch(/^en: cannot read /);
    const broken = checkMessages({ dir: tree({ "en.json": { a: "x" }, "fr.json": "{" }), reference: "en" });
    expect(broken.problems.map((p) => p.kind)).toEqual(["invalid"]);
    expect(checkMessages({ dir: tree({ "fr.json": { a: "x" } }), reference: "fr" }).ok).toBe(true);
  });

  it("limits the human report", () => {
    const many = Object.fromEntries(Array.from({ length: 60 }, (_, i) => [`k${i}`, ""]));
    const report = formatReport(checkMessages({ dir: tree({ "en.json": many }) }));
    expect(report.split("\n")[0]).toBe("✗ i18n: 60 problem(s)");
    expect(report).toContain("… and 10 more");
    expect(formatReport(checkMessages({ dir: tree({ "en.json": { a: "" } }) }))).toBe("✗ i18n: 1 problem(s)\n  en: empty a");
  });

  it("reports keys no source reads", () => {
    const dir = tree({
      "messages/en.json": { home: { title: "a", dead: "b" }, phase: { SOLD: "c" }, nav: { x: { y: "d" } }, legal: [{ t: "e" }], plus: { a: "f" }, sq: { a: "g" }, alias: { x: "h" }, legal2: { y: "i" } },
      "src/page.tsx": 'const a = t("home.title"); const b = t(`phase.${p}`); const c = t.nav[id]; messages.legal[0];',
      "src/more.js": 'const d = t("plus." + k); const e = t(\'sq.\' + k); const h = t.alias; messages("legal2");',
      "src/notes.md": "home.dead",
      "src/node_modules/x.js": "home.dead",
    });
    const result = checkMessages({ dir: path.join(dir, "messages"), unused: [path.join(dir, "src"), path.join(dir, "missing")] });
    expect(result.problems.map((p) => p.message)).toEqual([`unused home.dead (read nowhere in ${path.join(dir, "src")}, ${path.join(dir, "missing")})`]);
  });
});

describe("findUnused", () => {
  it("reads single files too", () => {
    const dir = tree({ "a.ts": 'k("x.y")' });
    expect(findUnused(["x.y", "x.z"], [path.join(dir, "a.ts")])).toEqual(["x.z"]);
    expect(findUnused(["x.y"], [path.join(dir, "a.ts.txt")])).toEqual(["x.y"]);
  });
});
