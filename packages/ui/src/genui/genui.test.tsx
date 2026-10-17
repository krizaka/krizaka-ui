import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { baseGenUiCatalog, extractGenUi, GENUI_LIMITS, GenUiStream, GenUiSurface, readStream, sanitizeData, validateMessage } from "./index";

const V = "v0.9";
const line = (message: unknown) => JSON.stringify(message);
const create = (surfaceId = "s1") => line({ version: V, createSurface: { surfaceId, catalogId: "krizaka:genui/v1" } });
const components = (list: unknown[], surfaceId = "s1") => line({ version: V, updateComponents: { surfaceId, components: list } });
const data = (path: string, value: unknown, surfaceId = "s1") => line({ version: V, updateDataModel: { surfaceId, path, value } });
const answer = (...lines: string[]) => ["Here is what the data says.", "```a2ui", ...lines, "```", "Ask me to refine it."].join("\n");

const DASHBOARD = answer(
  create(),
  components([
    { id: "root", component: "Column", children: ["title", "note", "grid"] },
    { id: "title", component: "Text", variant: "heading", text: "Passes by city" },
    { id: "note", component: "Callout", tone: "warning", title: "Laval is down", text: { path: "/note" } },
    { id: "grid", component: "Table", caption: "Cities", columns: [{ key: "city", label: "City" }, { key: "passes", label: "Passes", format: "integer" }], rows: { path: "/cities" } },
  ]),
  data("/note", "-12 % on last month."),
  data("/cities", [{ city: "Montréal", passes: 412 }, { city: "Laval", passes: 121 }]),
);

describe("GenUi — a model's answer drawn from the catalog", () => {
  it("draws prose, a heading, a callout bound to the data and a table, accessibly", async () => {
    const { container } = render(<GenUiStream text={DASHBOARD} catalog={baseGenUiCatalog} />);
    expect(screen.getByText("Here is what the data says.")).toBeTruthy();
    expect(screen.getByText("Ask me to refine it.")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Passes by city" })).toBeTruthy();
    expect(screen.getByRole("alert").textContent).toContain("-12 % on last month.");
    expect(screen.getByRole("table")).toBeTruthy();
    expect(screen.getByText("Montréal")).toBeTruthy();
    expect(screen.getByText("412")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("streams: what has arrived is drawn, a half-written line waits, a missing child is a skeleton", () => {
    const partial = ["```a2ui", create(), components([{ id: "root", component: "Card", title: "Weekly", child: "body" }]), '{"version":"v0.9","updateCompo'].join("\n");
    const { container } = render(<GenUiStream text={partial} catalog={baseGenUiCatalog} streaming />);
    expect(screen.getByText("Weekly")).toBeTruthy();
    const surface = container.querySelector("[data-genui-surface]");
    expect(surface?.getAttribute("aria-busy")).toBe("true");
    expect(surface?.querySelector("[data-shape]"), "the card's body is still to come").toBeTruthy();
  });

  it("falls back to the text when the answer holds no valid surface", () => {
    render(<GenUiStream text={answer('{"version":"v0.9","createSurface":{"surfaceId":"s1","catalogId":"evil:catalog"}}')} catalog={baseGenUiCatalog} />);
    expect(screen.getByText(/Here is what the data says/)).toBeTruthy();
    expect(document.querySelector("[data-genui-surface]")).toBeNull();
  });

  it("an answer with no fence is its text", () => {
    render(<GenUiStream text="Just prose." catalog={baseGenUiCatalog} />);
    expect(screen.getByText("Just prose.")).toBeTruthy();
  });
});

describe("GenUi — malicious and malformed specs are refused", () => {
  const refused = (message: unknown) => validateMessage(message, baseGenUiCatalog);

  it("refuses another version, another catalog, two messages in one, unknown keys", () => {
    expect(refused({ version: "v0.8", deleteSurface: { surfaceId: "s1" } }).ok).toBe(false);
    expect(refused({ version: V, createSurface: { surfaceId: "s1", catalogId: "https://evil.example/catalog" } }).ok).toBe(false);
    expect(refused({ version: V, deleteSurface: { surfaceId: "s1" }, createSurface: { surfaceId: "s1", catalogId: "krizaka:genui/v1" } }).ok).toBe(false);
    expect(refused({ version: V, deleteSurface: { surfaceId: "s1", onload: "alert(1)" } }).ok).toBe(false);
  });

  it("refuses a component outside the catalog — no HTML, no script, no iframe", () => {
    for (const component of ["Html", "script", "iframe", "__proto__", "toString", "constructor"]) {
      const r = refused({ version: V, updateComponents: { surfaceId: "s1", components: [{ id: "root", component }] } });
      expect(r.ok, component).toBe(false);
    }
  });

  it("refuses unknown properties: no dangerouslySetInnerHTML, no style, no event handler, no href", () => {
    for (const extra of [{ dangerouslySetInnerHTML: { __html: "<img onerror=alert(1)>" } }, { style: { background: "url(javascript:1)" } }, { onClick: "alert(1)" }, { href: "javascript:alert(1)" }]) {
      const r = refused({ version: V, updateComponents: { surfaceId: "s1", components: [{ id: "root", component: "Text", text: "hi", ...extra }] } });
      expect(r.ok, Object.keys(extra)[0]).toBe(false);
    }
  });

  it("draws markup as text, never as HTML", () => {
    const text = answer(create(), components([{ id: "root", component: "Text", text: '<img src=x onerror="alert(1)"><script>alert(1)</script>' }]));
    const { container } = render(<GenUiStream text={text} catalog={baseGenUiCatalog} />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("script")).toBeNull();
    expect(container.textContent).toContain("<script>alert(1)</script>");
  });

  it("refuses prototype pollution through paths and data keys", () => {
    expect(refused({ version: V, updateDataModel: { surfaceId: "s1", path: "/__proto__/polluted", value: true } }).ok).toBe(false);
    expect(refused({ version: V, updateDataModel: { surfaceId: "s1", path: "/a/constructor/prototype", value: true } }).ok).toBe(false);
    expect(refused({ version: V, updateDataModel: { surfaceId: "s1", path: "/a", value: JSON.parse('{"__proto__":{"polluted":true}}') } }).ok).toBe(false);
    const state = readStream(answer(create(), data("/__proto__/polluted", true)), baseGenUiCatalog);
    expect(state.errors.length).toBe(1);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it("refuses data that is not plain JSON or out of bounds", () => {
    expect(sanitizeData(Array.from({ length: GENUI_LIMITS.array + 1 }, () => 1)).ok).toBe(false);
    expect(sanitizeData("x".repeat(GENUI_LIMITS.string + 1)).ok).toBe(false);
    let deep: unknown = 1;
    for (let i = 0; i < GENUI_LIMITS.dataDepth + 2; i++) deep = [deep];
    expect(sanitizeData(deep).ok).toBe(false);
    expect(sanitizeData(new Date()).ok).toBe(false);
    expect(sanitizeData(Number.NaN).ok).toBe(false);
  });

  it("refuses bad ids and too many components", () => {
    expect(refused({ version: V, updateComponents: { surfaceId: "s1", components: [{ id: "a b<", component: "Text", text: "x" }] } }).ok).toBe(false);
    const many = Array.from({ length: GENUI_LIMITS.components + 1 }, (_, i) => ({ id: `c${i}`, component: "Text", text: "x" }));
    expect(refused({ version: V, updateComponents: { surfaceId: "s1", components: many } }).ok).toBe(false);
  });

  it("draws a tree only: a cycle or a component with two parents is drawn once and reported", () => {
    const errors: string[] = [];
    const cyclic = readStream(
      answer(create(), components([{ id: "root", component: "Column", children: ["a", "a"] }, { id: "a", component: "Column", children: ["root"] }])),
      baseGenUiCatalog,
    );
    const surface = cyclic.surfaces.get("s1");
    if (!surface) throw new Error("surface");
    render(<GenUiSurface surface={surface} catalog={baseGenUiCatalog} onError={(e) => errors.push(e)} />);
    expect(errors.some((e) => e.includes("drawn twice"))).toBe(true);
  });

  it("keeps what was valid when a later message is refused", () => {
    const text = answer(create(), components([{ id: "root", component: "Text", text: "kept" }]), components([{ id: "root", component: "Iframe", src: "https://evil.example" }]), "not json");
    const errors: string[] = [];
    render(<GenUiStream text={text} catalog={baseGenUiCatalog} onError={(e) => errors.push(e)} />);
    expect(screen.getByText("kept")).toBeTruthy();
    expect(errors).toHaveLength(2);
  });
});

describe("GenUi — the fence", () => {
  it("splits prose and complete lines, open or closed", () => {
    expect(extractGenUi("a\n```a2ui\n{1}\n{2").lines).toEqual(["{1}"]);
    expect(extractGenUi("a\n```a2ui\n{1}\n{2}\n```\nb")).toMatchObject({ lines: ["{1}", "{2}"], closed: true, prose: "a\n\nb", found: true });
    expect(extractGenUi("no fence").found).toBe(false);
  });
});
