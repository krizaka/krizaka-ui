// ADR-006 §7, krizaka-ui#674 — the first reduction batch: 28 entries with no user and no filed need are deprecated in 3.55
// and removed in 4.0. This test lists them, so a deprecation cannot be dropped, nothing kept can lean on them, and the
// development warning does what it says: once, in development, never in production. Nothing is removed in this minor.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DEPRECATED_SINCE, REMOVED_IN, resetDeprecationWarnings, warnDeprecated } from "./deprecated";
import { PointerLight } from "./pointer-light";

const SRC = import.meta.dirname;
const SITE = join(SRC, "..", "..", "..", "apps", "site");
const EXAMPLES = join(SRC, "..", "registry", "examples");

/** Showcase and effects (8; RetroTv came back for Akinaza's shop pages, krizaka-ui#605), data views (2), engagement (4), web media editors (3), web lifecycle screens (3), page templates (4). */
const WEB_ENTRIES = [
  "terminal-replay", "showcase", "pointer-light", "scroll-stage", "landscape", "signature", "anatomy-plate", "elephant",
  "tree-view", "kanban",
  "continue-prompt", "promise-card", "swipe-deck", "match-dialog",
  "media-capture", "video-trimmer", "image-cropper",
  "update-prompt", "force-update-screen", "maintenance-screen",
  "product-page", "gallery-page", "component-page", "status-page",
] as const;
/** Deprecated in the batch, then brought back by a filed need: they work without a warning. */
const RETURNED = ["retro-tv"] as const; // krizaka/akinaza#312 (the shop's reel), krizaka-ui#605
/** Native entries no app imports: the web entry of `vertical-video` and `markdown` stays (products use it); `media-capture` is in the list above. */
const NATIVE_ONLY_DEPRECATIONS = ["vertical-video", "markdown"] as const;
/** On watch (kept now, deprecated in the next pass if still unused): never deprecated here. */
const ON_WATCH = ["pricing-page", "contact-page", "docs-layout"] as const;
/** Deprecated in an earlier minor: their own release, not this one's. */
const EARLIER = { "tree-view": "3.6.0", "pointer-light": "3.31.0" } as Record<string, string>;

const metaText = (entry: string) => readFileSync(join(SRC, entry, "meta.ts"), "utf8");

describe("the first reduction batch (#674): 28 entries", () => {
  it("counts the 28 of the issue: 25 whole entries and 3 native entries (media-capture is both)", () => {
    expect(WEB_ENTRIES.length + RETURNED.length + NATIVE_ONLY_DEPRECATIONS.length + 1).toBe(28); // + native/media-capture, deprecated with its component
  });

  it.each(WEB_ENTRIES)("%s: meta says status deprecated, since its release, removed in 4.0.0, with a reason", (entry) => {
    const text = metaText(entry);
    expect(text).toMatch(/status: "deprecated"/);
    expect(text).toContain(`since: "${EARLIER[entry] ?? DEPRECATED_SINCE}"`);
    expect(text).toContain(`removedIn: "${REMOVED_IN}"`);
    expect(text).toMatch(/reason: "[^"]{20,}"/);
  });

  it.each(NATIVE_ONLY_DEPRECATIONS)("%s: only its React Native entry is deprecated (the web entry stays stable or beta)", (entry) => {
    const text = metaText(entry);
    expect(text).not.toMatch(/status: "deprecated"/);
    expect(text).toMatch(new RegExp(`native: \\{\\n\\s+entry: "@krizaka/ui/native/${entry}",\\n\\s+deprecated: \\{ since: "${DEPRECATED_SINCE}", removedIn: "${REMOVED_IN}"`));
  });

  it("does not deprecate what is on watch", () => {
    for (const entry of ON_WATCH) expect(metaText(entry), entry).not.toMatch(/status: "deprecated"/);
  });

  it.each([...WEB_ENTRIES])("%s: its components carry @deprecated JSDoc and the development warning", (entry) => {
    const sources = readdirSync(join(SRC, entry)).filter((f) => /\.tsx?$/.test(f) && !/\.(test|stories)\.|^index\.ts$|^meta\.ts$/.test(f) && !/^Pointer/.test(f));
    const text = sources.map((f) => readFileSync(join(SRC, entry, f), "utf8")).join("\n");
    expect(text, entry).toContain("@deprecated");
    expect(text, entry).toContain(`warnDeprecated("${entry}"`);
  });

  it.each(["media-capture", "vertical-video", "markdown"])("native/%s: its components carry @deprecated JSDoc and the development warning", (entry) => {
    const text = readFileSync(join(SRC, "native", `${entry}.tsx`), "utf8");
    expect(text).toContain("@deprecated");
    expect(text).toContain(`warnDeprecated("native/${entry}"`);
  });
});

/** The files of a tree whose name matches. */
function files(dir: string, test: RegExp): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (name === "node_modules" || name === ".next" || name === "out" || name === "dist") return [];
    return statSync(path).isDirectory() ? files(path, test) : test.test(name) ? [path] : [];
  });
}

describe("nothing kept leans on a deprecated entry", () => {
  const dep = WEB_ENTRIES.join("|");
  const byPackage = new RegExp(`@krizaka/ui/(${dep})["'/]`);

  it("the documentation site and its examples do not import one", () => {
    const offenders = files(SITE, /\.(tsx?|mdx)$/)
      .filter((f) => byPackage.test(readFileSync(f, "utf8")))
      .map((f) => relative(SITE, f));
    expect(offenders).toEqual([]);
  });

  it("the registry examples of another component do not import one", () => {
    const offenders = files(EXAMPLES, /\.tsx$/).flatMap((f) => {
      const owner = relative(EXAMPLES, f).split("/")[0]!;
      const m = byPackage.exec(readFileSync(f, "utf8"));
      return m && m[1] !== owner ? [`${relative(EXAMPLES, f)} -> ${m[1]}`] : [];
    });
    expect(offenders).toEqual([]);
  });

  it("no kept source file imports a deprecated entry (the native twins of the same name are different files)", () => {
    const relative_ = new RegExp(`from "\\.\\.?/(${dep})(/|")`);
    const offenders = files(SRC, /\.tsx?$/)
      .filter((f) => !/\.(test|stories)\./.test(f))
      .filter((f) => !f.startsWith(join(SRC, "native") + "/") && !WEB_ENTRIES.some((e) => f.startsWith(join(SRC, e) + "/")))
      .filter((f) => relative_.test(readFileSync(f, "utf8")))
      .map((f) => relative(SRC, f));
    expect(offenders).toEqual([]);
  });

  it("no kept component's meta sends the reader to a deprecated one", () => {
    const offenders: string[] = [];
    for (const dir of readdirSync(SRC)) {
      if (WEB_ENTRIES.includes(dir as never)) continue;
      let text: string;
      try { text = metaText(dir); } catch { continue; }
      for (const e of WEB_ENTRIES) if (new RegExp(`use: "${e}"|related: \\[[^\\]]*"${e}"`).test(text)) offenders.push(`${dir} -> ${e}`);
    }
    expect(offenders).toEqual([]);
  });
});

describe("warnDeprecated", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    resetDeprecationWarnings();
  });

  it("warns once per entry, in development, naming the entry, the release, the major and where to object", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("NODE_ENV", "development");
    warnDeprecated("kanban");
    warnDeprecated("kanban");
    warnDeprecated("showcase");
    expect(warn).toHaveBeenCalledTimes(2);
    const message = String(warn.mock.calls[0]![0]);
    expect(message).toContain("@krizaka/ui/kanban");
    expect(message).toContain(`since ${DEPRECATED_SINCE}`);
    expect(message).toContain(REMOVED_IN);
    expect(message).toContain("krizaka-ui#674");
    expect(message).toContain("https://ui.krizaka.com/components/kanban");
  });

  it("says the release of an earlier deprecation, and the page of a native entry", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("NODE_ENV", "development");
    warnDeprecated("tree-view", "3.6.0");
    warnDeprecated("native/markdown");
    expect(String(warn.mock.calls[0]![0])).toContain("since 3.6.0");
    expect(String(warn.mock.calls[1]![0])).toContain("https://ui.krizaka.com/components/markdown");
  });

  it("is silent in production", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("NODE_ENV", "production");
    warnDeprecated("kanban");
    expect(warn).not.toHaveBeenCalled();
  });

  it("is what a deprecated component does when it renders (and it still renders)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("NODE_ENV", "development");
    expect(renderToStaticMarkup(<PointerLight />)).toBe("<span hidden=\"\"></span>");
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]![0])).toContain("@krizaka/ui/pointer-light");
  });
});
