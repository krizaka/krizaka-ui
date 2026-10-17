import { anchorOf, changeFromTitle, changelogRss, draftFromTitles, kindOfTag, parseChangesets, parseReleaseBody, tagOf } from "./adapter";

const MD = `# @krizaka/ui

## 3.22.0

### Minor Changes

- [#293](https://github.com/krizaka/krizaka-ui/pull/293) [\`9c8\`](https://github.com/x/commit/9c8) Thanks [@x](https://github.com/x)! - Two blocks for landing pages. More.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tokens@3.22.0

## 3.21.0

### Major Changes

- BREAKING: Button drops its legacy prop.
`;

describe("changelog adapter", () => {
  it("reads changesets into dated, tagged releases and skips dependency plumbing", () => {
    const r = parseChangesets(MD, "@krizaka/ui", (v) => ({ "3.22.0": "2026-10-17", "3.21.0": "2026-10-16" })[v]);
    expect(r.map((x) => x.version)).toEqual(["3.22.0", "3.21.0"]);
    expect(r[0].changes).toEqual([{ tag: "feature", text: "Two blocks for landing pages.", pr: { number: 293, url: "https://github.com/krizaka/krizaka-ui/pull/293" } }]);
    expect(r[1].changes[0].tag).toBe("breaking");
    expect(parseChangesets(MD, "x", () => undefined)).toEqual([]);
  });

  it("tags security and breaking words", () => {
    expect(tagOf("Fixes an XSS", "fix")).toBe("security");
    expect(tagOf("BREAKING: x", "fix")).toBe("breaking");
  });

  it("reads release bodies and drafts from conventional titles, dropping housekeeping", () => {
    const items = parseReleaseBody("* feat(chat): voice replies by @x in https://github.com/o/r/pull/12\n* chore: bump");
    expect(items.map((i) => [i.tag, i.pr?.number])).toEqual([["feature", 12]]);
    expect(changeFromTitle("ci: cache")).toBeNull();
    expect(draftFromTitles(["fix(a): XSS in the form (#1)"], "1.0.0")).toContain("### Security");
  });

  it("maps tags to the template's kinds and builds an RSS 2.0 feed", () => {
    expect(["feature", "fix", "change", "security", "breaking"].map((t) => kindOfTag(t as never))).toEqual(["added", "fixed", "changed", "security", "breaking"]);
    const rel = { source: "@krizaka/ui", version: "3.22.0", date: "2026-10-17", changes: [{ tag: "feature" as const, text: "A & B" }] };
    const xml = changelogRss({ releases: [rel], title: "t", description: "d", siteUrl: "https://s", pageUrl: "https://s/changelog", feedUrl: "https://s/f.xml", language: "en", tagLabel: { feature: "New", fix: "Fixed", security: "Security", breaking: "Breaking", change: "Changed" } });
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain(`https://s/changelog#${anchorOf(rel)}`);
  });
});
