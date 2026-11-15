import nodeConsole from "node:console";

import { afterEach, describe, expect, it, vi } from "vitest";

import { axeViolations } from "./axe";

function containerWith(html: string): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.append(container);
  return container;
}

describe("axeViolations and iframes (krizaka-internal#3904)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("does not enter a frame happy-dom cannot load, so nothing is printed", async () => {
    const logs = [vi.spyOn(console, "log"), vi.spyOn(nodeConsole, "log"), vi.spyOn(console, "error"), vi.spyOn(nodeConsole, "error")];
    for (const log of logs) log.mockImplementation(() => {});
    expect(await axeViolations(containerWith('<iframe src="https://example.com/page" title="The page"></iframe>'))).toEqual([]);
    for (const log of logs) expect(log.mock.calls.flat().filter((arg) => typeof arg === "string" && arg.includes("content window"))).toEqual([]);
  });

  it("still audits the iframe element itself", async () => {
    const violations = await axeViolations(containerWith('<iframe src="https://example.com/page"></iframe>'));
    expect(violations.some((v) => v.startsWith("frame-title"))).toBe(true);
  });
});
