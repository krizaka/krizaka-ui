import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";

import Example from "../../registry/examples/docs-source/article";
import { axeViolations } from "../test/axe";
import { docsSource } from "./index";
import { readDocsFolder } from "./node";

const files = [
  { path: "index.en.md", content: "---\ntitle: Home\norder: 0\n---\nWelcome." },
  { path: "install.en.md", content: "---\ntitle: Install\ngroup: Guide\norder: 2\nupdated: 2026-11-16\n---\n## Download\ntext\n### The macOS build\nmore\n## Verify\n```md\n## not a heading\n```" },
  { path: "install.fr.md", content: "---\ntitle: Installer\ngroup: Guide\norder: 2\n---\n## Télécharger\ntexte" },
  { path: "start.en.md", content: "# Start here\n\n## First steps\nGo." },
  { path: "guides/backup.en.md", content: "---\ntitle: Backups\ngroup: Guide\norder: 3\n---\nBody." },
  { path: "logo.png", content: "ignored" },
];

describe("docsSource", () => {
  it("lists the pages in reading order, grouped, with their addresses", () => {
    const docs = docsSource(files, { locale: "en" });
    expect(docs.locales).toEqual(["en", "fr"]);
    expect(docs.pages.map((p) => p.href)).toEqual(["/docs", "/docs/start", "/docs/install", "/docs/guides/backup"]);
    expect(docs.groups.map((g) => [g.title, g.items.map((i) => i.label)])).toEqual([
      ["Docs", ["Home", "Start here"]],
      ["Guide", ["Install", "Backups"]],
    ]);
  });

  it("gives DocsArticlePage its contents, pager and breadcrumb, with ids Markdown also gives", () => {
    const page = docsSource(files, { locale: "en", basePath: "/docs/" }).page("install");
    expect(page?.toc.items).toEqual([{ id: "download", label: "Download" }, { id: "verify", label: "Verify" }]);
    expect(page?.headings.map((h) => h.depth)).toEqual([2, 3, 2]);
    expect(page?.pager.previous).toEqual({ href: "/docs/start", title: "Start here" });
    expect(page?.pager.next?.href).toBe("/docs/guides/backup");
    expect(page?.breadcrumb).toEqual([{ href: "/docs", label: "Docs" }, { href: "/docs/install", label: "Install" }]);
    expect(page?.updated).toBe("2026-11-16");
    expect(page?.readingMinutes).toBe(1);
  });

  it("answers in the reader's language and falls back to the default one, flagged", () => {
    const docs = docsSource(files, { locale: "fr" });
    expect(docs.page("install")).toMatchObject({ title: "Installer", fallback: false, locale: "fr" });
    expect(docs.page("start")).toMatchObject({ title: "Start here", fallback: true });
    expect(docs.page("nope")).toBeUndefined();
  });

  it("takes the title of the first # heading and refuses a page without any", () => {
    expect(docsSource(files, { locale: "en" }).page("start")?.title).toBe("Start here");
    expect(() => docsSource([{ path: "a.en.md", content: "just text" }], { locale: "en" })).toThrow(/a\.en\.md.*no title/);
  });

  it("refuses what it cannot use, naming the file", () => {
    expect(() => docsSource([{ path: "a.md", content: "# A" }], { locale: "en" })).toThrow(/a\.md.*<page>\.<locale>\.md/);
    expect(() => docsSource([{ path: "a.en.md", content: "---\ntitle: A\norder: x\n---\n" }], { locale: "en" })).toThrow(/order/);
    expect(() => docsSource([{ path: "a.en.md", content: "---\ntitle: A\nupdated: yesterday\n---\n" }], { locale: "en" })).toThrow(/updated/);
    expect(() => docsSource([{ path: "a.en.md", content: "# A" }, { path: "a.en.md", content: "# B" }], { locale: "en" })).toThrow(/two files/);
  });

  it("renders in the docs frame from the example, with no axe violation", async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole("heading", { level: 1, name: "Getting started" })).toBeTruthy();
    expect(container.querySelector("a[rel=\"next\"]")?.textContent).toContain("Backups");
    expect(container.querySelector("#start")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("readDocsFolder", () => {
  it("reads the Markdown files under a folder, relative and sorted, and rejects a missing folder", async () => {
    const dir = await mkdtemp(join(tmpdir(), "docs-source-"));
    try {
      await mkdir(join(dir, "guides"));
      await writeFile(join(dir, "b.en.md"), "# B");
      await writeFile(join(dir, "guides", "a.fr.md"), "# A");
      await writeFile(join(dir, "note.txt"), "no");
      expect(await readDocsFolder(dir)).toEqual([{ path: "b.en.md", content: "# B" }, { path: "guides/a.fr.md", content: "# A" }]);
      await expect(readDocsFolder(join(dir, "missing"))).rejects.toThrow();
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
