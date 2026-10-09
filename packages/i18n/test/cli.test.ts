import path from "node:path";

import ts from "typescript";

import { main, USAGE } from "../src/check-entry";
import type { CliIO } from "../src/cli";
import { tree } from "./helpers";

function io(cwd: string, loadTypeScript: CliIO["loadTypeScript"] = async () => ts) {
  const out: string[] = [];
  const err: string[] = [];
  return { out, err, io: { stdout: (l: string) => out.push(l), stderr: (l: string) => err.push(l), cwd, loadTypeScript } };
}

const fixtures = path.join(import.meta.dirname, "fixtures", "app");

describe("krizaka-i18n", () => {
  it("prints the usage", async () => {
    const a = io("/");
    expect(await main([], a.io)).toBe(2);
    expect(await main(["--help"], a.io)).toBe(0);
    expect(a.out).toEqual([USAGE, USAGE]);
  });

  it("refuses unknown commands, options and missing arguments", async () => {
    const a = io("/");
    expect(await main(["nope"], a.io)).toBe(2);
    expect(await main(["check", "--bogus"], a.io)).toBe(2);
    expect(await main(["check"], a.io)).toBe(2);
    expect(await main(["scan"], a.io)).toBe(2);
    const first = a.err.map((l) => l.split("\n")[0]);
    expect(first[1]).toMatch(/^Unknown option '--bogus'/);
    expect(first.filter((_, i) => i !== 1)).toEqual([
      'Unknown command "nope".',
      "check takes one folder of catalogues.",
      "scan takes at least one folder.",
    ]);
  });

  it("checks catalogues, human and JSON", async () => {
    const dir = tree({ "messages/en.json": { a: "A {n}" }, "messages/fr.json": { a: "B {n}" }, "bad/en.json": { a: "" } });
    const ok = io(dir);
    expect(await main(["check", "messages"], ok.io)).toBe(0);
    expect(ok.out).toEqual(["✓ i18n: 1 messages, every locale complete"]);

    const bad = io(dir);
    expect(await main(["check", "bad", "--reference", "en"], bad.io)).toBe(1);
    expect(bad.err).toEqual(["✗ i18n: 1 problem(s)\n  en: empty a"]);

    const json = io(dir);
    expect(await main(["check", "messages", "--json", "--unused", "src"], json.io)).toBe(1);
    expect(JSON.parse(json.out[0] as string)).toMatchObject({ ok: false, problems: [{ kind: "unused", key: "a" }] });
  });

  it("scans sources, human, summary and JSON", async () => {
    const args = ["scan", "components", "app", "--allow", "Acme, Krizaka", "--allow", "", "--skip", "/app/api/"];
    const human = io(fixtures);
    expect(await main(args, human.io)).toBe(1);
    expect(human.out[0]).toBe("components/Card.tsx:3  [set setError]  Something went wrong");
    expect(human.err).toEqual(["✗ i18n: 15 hard-coded user-facing string(s): move them to the message catalogue."]);

    const summary = io(fixtures);
    expect(await main([...args, "--summary", "--skip", "page"], summary.io)).toBe(1);
    expect(summary.out).toEqual(["  15 components/Card.tsx"]);

    const many = io(path.join(fixtures, ".."));
    expect(await main(["scan", "app", "--summary"], many.io)).toBe(1);
    expect(many.out).toEqual(["  16 app/components/Card.tsx", "   1 app/app/api/route.tsx"]);

    const json = io(fixtures);
    expect(await main(["scan", "app", "--skip", "api", "--json"], json.io)).toBe(0);
    expect(JSON.parse(json.out[0] as string)).toEqual({ ok: true, offenders: [] });

    const clean = io(fixtures);
    expect(await main(["scan", "app", "--skip", "api"], clean.io)).toBe(0);
    expect(clean.out).toEqual(["✓ i18n: no hard-coded user-facing string."]);
  });

  it("explains that scan needs TypeScript", async () => {
    const a = io(fixtures, async () => {
      throw new Error("Cannot find module 'typescript'");
    });
    expect(await main(["scan", "app"], a.io)).toBe(2);
    expect(a.err).toEqual(["scan needs the typescript package: npm install -D typescript"]);
  });

  it("uses the process by default", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await main(["--help"])).toBe(0);
    expect(await main(["check", path.join(fixtures, "none")])).toBe(1);
    expect(await main(["scan", path.join(fixtures, "app", "page.tsx")])).toBe(0);
    expect(log).toHaveBeenCalledWith(USAGE);
    expect(error).toHaveBeenCalled();
    log.mockRestore();
    error.mockRestore();
  });
});
