# Docs and info sites: one Krizaka UI face

> Status: **proposed** · krizaka-internal#3781 · 2026-11-17 · design only, no product code.
> Builds on #3786 (site shell, docs template, `SiteMascot`), #3562 (family footer), #3886 (docs-source), #3916 and #3785
> (site data from `@krizaka/org`), #3783 / #3784 (the guards), #3025 (GitHub Pages). It does not repeat them: it puts
> them in one picture, fills the gaps (the home of a library, the Rust case, the rendered-face guard) and orders the
> slices.

## 0. The vision in ten lines

1. Every docs or info site of the family (ui, ts, java, lab, rust, agents, the `/docs` of krizaka.com) wears **one face**:
   the same bar, the same footer, the same home, the same docs page. Only the words, the bird and the content differ.
2. **Who the site is** (id, name, bird, tone, description, family, footer selection) is data in `@krizaka/org`, never in a
   site. **What the site says** (versions, install line, example, guides) is its own content, in Markdown and one typed config.
3. **The face is code in `@krizaka/ui`**: `SiteShell`, `SiteMascot`, `LibraryHero`, `InstallCommand`, `PackageCards`,
   `OpenSourceIndex`, the docs frame, `FamilyFooter`. A site composes them; it owns no bar, footer or theme file.
4. **One home pattern** for a library: name and bird, one sentence, the version, the install line, a 5–10 line example,
   the packages, the guides, the sibling libraries. Fable's four points for Rust are this pattern.
5. **Markdown in, pages out**: `docs-source` (#3886) turns a folder of `*.{en,fr}.md` into pages, nav, contents, previous/next.
6. **A site that cannot import React still gets the face**: a small generator (`@krizaka/docs`) renders the same blocks
   to static HTML, and gives rustdoc the Cahier through its stable flags (`--extend-css`, `--html-before-content`,
   `--html-after-content`).
7. **The guard reads what ships, not the source**: one check runs on the built pages of every site (Next, Vite or
   static) and fails when the bar, the footer, the bird, the kit version or the home's facts are not the kit's.
8. Dependabot groups `@krizaka/*` everywhere (Rust too, through a one-line `site/package.json`), so the face moves
   with the kit, one minor at a time.
9. The visual check compares each site to the kit's reference pages (`/foundations/site-shell`, `/foundations/docs-site`).
10. Order: Rust's home first (it is the newest and the most visible), then krizaka.com's `/docs` list, then the kit
    blocks, then each site moves onto them, one pull request per repository.

## 1. Scope and method

Sites: ui.krizaka.com, ts.krizaka.com, java.krizaka.com, lab.krizaka.com, rust.krizaka.com, www.krizaka.com (home and
`/docs`). agents.krizaka.com does not answer yet (DNS not created, krizaka-internal#3122): it adopts the template from
its first commit (slice 15). The blog and the three coming-soon pages are info sites of #3781 too; they take the shell
only (#3790, #3792), not the docs frame, and are not re-audited here.

Renders: Playwright 1.64.1 (the version pinned by this repository, Chromium 1248), `colorScheme` light and dark,
viewports 1440 × 900 and 390 × 844, home and one docs page per site, 2026-11-17. 48 captures plus a DOM probe per
render (classes from the kit `kz-*` versus local, header and footer, `data-bird`, the first install line and version
found in the text, the family links, sideways overflow, page errors). The captures are 5 MB and stay out of git:

```text
workspace/tmp/teams/registre-scratch/3781-renders/
  render.mjs, render-com.mjs     the capture + probe scripts (rerun: node render.mjs <out>)
  shots/<site>-<home|docs>-<390|1440>-<light|dark>.png    48 files
  shots/facts.json               the probe of every render
  sheet-desktop.png, sheet-phone.png   contact sheets
workspace/tmp/teams/rust-shots-2026-11-17/   the CTO's Rust captures (desktop light/dark, phone, API page)
```

| Site | Docs page rendered |
| :-- | :-- |
| ui | `/components/button/` |
| ts | `/start/` |
| java | `/start/` |
| lab | `/krizaka-ui` |
| rust | `/krizaka_rust/index.html` (rustdoc), over **http**: https refused the connection (certificate not issued yet) |
| krizaka.com | `/docs` |

## 2. Audit from the renders

### 2.1 One table

| Site | Shared (from the kit) | Local (the site's own code) | Off-kit (fails the target) |
| :-- | :-- | :-- | :-- |
| **ui** (`apps/site`, Next + Fumadocs, kit `workspace:`) | `NavBar` (`kz-site-bar`), `FamilyFooter` from `footerFor("ui")`, `CodeBlock`, `ChangelogPage`, the docs blocks inside Fumadocs | `SiteBar.tsx`, `SiteRoot.tsx`, `SiteTheme.tsx`, `lib/docs-source.ts` (the third copy of the shell; docs-source not in a package, #3886) | Light scheme renders **dark** (default theme forced dark, #3583 decided `system`). **No bird** shown (magpie decided). Docs page body is Fumadocs chrome, not `DocsArticlePage`. |
| **ts** (`site/`, Next + Fumadocs, kit ^4.13.0) | `NavBar`, `CodeBlock`, tokens and fonts | 13 files in `app/components/` (`SiteRoot`, `TopBar`, `SiteFooter`, `FamilyFooterView`, `SiteTheme`, `DocsShell`, `DocsProviders`, `DocPage`, `I18nProvider`, `mdx`, `InstallTabs`, `GitHubMark`, `Home`); `scripts/postbuild.mjs` types the family by hand for `llms.txt` | No `@krizaka/org` dependency: **local footer without the family** (« Krizaka TypeScript · npm · Source code »). Light scheme renders **dark**. No bird. Docs page: 12 kit classes, the rest Fumadocs. No link to lab or rust. |
| **java** (`site/`, Next + Fumadocs, kit **^4.11.0**) | `NavBar`, `CodeBlock`, Cahier card (`SiteCahier` pieces) on the home | Same copied shell as ts (drifted, #3786), plus `ChangelogBody`, `BuildingBlocksMap` with a CSS module (12 KB), `ProjectGenerator` | **Two minors behind** the kit (4.11 vs 4.13). No `@krizaka/org`: local footer without the family, says « Krizaka UI 4.11.0 ». Bird literals in `Home.tsx` (falcon and pigeon rendered). Shows v0.19.0 and BOM 0.13.0 on one screen (#3781 audit). No link to ts, lab or rust. |
| **lab** (Vite + React, kit **^4.11.0**) | `NavBar` (but restyled by a local `lab-bar`), tokens, motion | `src/App.tsx`, `src/index.css` (17 KB) | Two minors behind. No `@krizaka/org`, **no family footer** (a local one: « The lab · Guides · Experiments … »). No bird (flamingo decided). |
| **rust** (`site/index.html` hand-written + `cargo doc`) | Nothing: zero kit class | One static HTML page with its own CSS (raw colours `#f7f3e8`, `#1d2f6f`, Georgia) imitating the Cahier; rustdoc's default theme on the API pages | **HTTPS not answering** (certificate pending). **No version, no install line, no example** on the home. Links only to krizaka.com: **no sibling library**. No bar, no family footer, no bird (the org has none for Rust yet). API pages: default rustdoc, nothing of Krizaka. |
| **krizaka.com** (home + `/docs`, Next, kit ^4.13.0, org ^1.11.0) | `NavBar`, `FamilyFooter` from the org (Rust listed first, krizaka-com#739), the Cahier sections | `/docs` reads `lib/stack.ts`: four typed entries (UI, Lab, Java, TypeScript) | **`/docs` has no Rust** and duplicates the org family. `/docs` throws React error #418 (hydration text mismatch) in the console. Light scheme renders dark. |

What is already one face, and should not be redone: the bar (every Next site renders the kit's `NavBar`, identical
classes on ui, ts, java and krizaka.com), the family footer block (#3562, worn by ui and krizaka.com), the code block,
the changelog template, the Cahier vocabulary (`SiteCahier`, `PageHero`, `TapedPhoto`). The gaps are the **frame around
them** (copied shells, three theme files), the **identity data** (birds as literals or missing, footers without the
org), the **home of a library** (each site invents it), the **docs page body** (Fumadocs defaults on ts and java) and
**Rust**, which has none of it.

### 2.2 Cross-cutting findings

1. **Theme default.** ui, ts and krizaka.com render dark when the reader asks for light; java and lab follow the system.
   #3583 decided `system`. One prop of `SiteShell` (`defaultTheme="system"`), tested, settles it for all.
2. **The kit does not know Rust or Agents.** `SiteId` in `packages/ui/src/sites/sites.ts` lists `motion` and not `rust`
   or `agents`; `@krizaka/org` 1.11.0 has a `rust` row without a site and without a bird. #3916 moves the kit's site
   list to the org; Rust's row must get its site and bird first (slice 2).
3. **All nine birds are taken** (`MASCOT_BIRDS`: falcon, owl, duck, flamingo, pigeon, lovebird, crane, magpie, beaver).
   Rust and Agents each need a new bird drawn in `@krizaka/ui/mascots` and added to the closed set in `@krizaka/org`
   (Decisions).
4. **`SiteCahier` takes `bird` as a prop**, so a site can still hard-code one. `SiteShell` replaces its frame; the `bird`
   prop is deprecated in the same minor (`deprecated: { since, removedIn, reason }`).
5. **The family is typed by hand in at least three places outside the org**: ts `postbuild.mjs` (`llms.txt`), krizaka.com
   `lib/stack.ts`, the local footers of ts, java and lab. Each is a slice below.
6. **No site shows a 390 px sideways scroll** on these pages (`scrollWidth - innerWidth = 0` on all 48 renders); the
   known phone defects are the changelog pages (#3786 done-when, ≥ 280 px column).

## 3. The one template

### 3.1 Two sources, never a third

| What | Where it lives | Read by |
| :-- | :-- | :-- |
| Who the site is: `id`, `name`, `mascot { bird, tone }`, `description`, the family, `footer.sites[id]` (source, licence, legal, socials, version line) | `@krizaka/org` (krizaka-ts `packages/org/src/family.ts`, #3785, #3913) | `siteFor(id)` and `footerFor(id)` (new: `siteFor` returns the `FamilyMember` and its footer selection in one object) |
| What the site says: versions, the install commands, the example, the packages, the guides, the changelog | The site's repository: `docs/*.{en,fr}.md` (docs-source) and one typed `site.config.ts` (or `site.json` for a non-JS repo) | The site's build |

`site.config.ts`, the one file a docs site writes besides its Markdown:

```ts
import type { DocsSiteConfig } from "@krizaka/docs";

export default {
  site: "rust",                                    // an org id; everything about identity is read from it
  version: { value: "0.4.0", href: "https://github.com/krizaka/krizaka-rust/releases/tag/v0.4.0" },
  install: { cargo: 'krizaka-rust = { git = "https://github.com/krizaka/krizaka-rust", tag = "v0.4.0" }' },
  example: { file: "examples/refused.rs", language: "rust", caption: { en: "A path outside the grant is refused", fr: "Un chemin hors du dossier accordé est refusé" } },
  packages: [{ name: "krizaka-rust", href: "/krizaka_rust/", line: { en: "The rules: pure Rust, no Tauri dependency.", fr: "…" } }],
  content: "docs",                                 // the Markdown folder read by docs-source
} satisfies DocsSiteConfig;
```

The version and the example are read from the repository at build time (`Cargo.toml`, `package.json`, the BOM, an
example file that CI compiles), never typed twice: the config points at them.

### 3.2 The blocks

Library-first: what exists is reused, what is new is the smallest block that removes a copy. Every block ships with its
`meta.ts`, registry example, story (axe + dark/light screenshots) and tests, per the repository contract.

| Block | Status | Props (essentials) | Replaces |
| :-- | :-- | :-- | :-- |
| `NavBar` (+ `NavBar.Family`, `NavBar.Repo`, `NavBar.Badge`) | exists | as today | — |
| `FamilyFooter` | exists (#3562) | `footer` (= `footerFor(id)`), `current`, `labels`, `sourceLabel`, `version?`, `extra?` | the local footers of ts, java, lab, rust |
| `CodeBlock`, `CopyButton`, `ChangelogPage`, `LinkCard`, `CardGrid`, `PageHero`, `Toc`, `DocsNav`, `DocsLayout`, `DocsArticlePage` | exist | as today | the Fumadocs page body, the local cards |
| **`SiteShell`** | new (#3786 part 1) | `site: OrgSiteView` (from `siteFor(id)`), `locale`, `nav: { href, label, current? }[]`, `linkAs?`, `search?`, `defaultTheme?: "system"`, `version?`, `children` | `SiteRoot`, `TopBar`, `SiteTheme`, `SiteBar`, `SiteFooter`, `FamilyFooterView`, `I18nProvider` copies; the frame of `SiteCahier` |
| **`SiteMascot`** | new (#3786) | `site: OrgSiteView`, `mood?`, `size?` — **no `bird` prop**; renders `data-kz-bird` | every `bird="…"` literal |
| **`InstallCommand`** | new (promotes ts `InstallTabs`) | `install: { npm?, pnpm?, yarn?, bun?, cargo?, maven?, gradle? }` (a string each; tabs in that order, the first given is selected), `labels` | ts `InstallTabs`, ui's and java's hand install blocks |
| **`LibraryHero`** | new, on `PageHero` | `site`, `eyebrow?`, `title`, `lead`, `version: { value, href? }`, `install` (an `InstallCommand`), `example: { code, language, caption }`, `actions?` — the bird (`SiteMascot`) is the aside | ui's landing hero, ts and java `Home.tsx` heroes, Rust's `<h1>` |
| **`PackageCards`** | new, on `CardGrid` + `LinkCard` | `packages: { name, href, line, version?, status? }[]`, `title` | ts « Pick a package » table, java building blocks list, ui « Where the pieces live », Rust's two cards |
| **`OpenSourceIndex`** | new, on `CardGrid` + `LinkCard` | `members` (org `family` filtered on the open-source group, live sites only), `current?`, `labels` | krizaka.com `lib/stack.ts` list, the « other libraries » of each home (Fable's point 4) |
| **`DocsSite`** (the docs frame) | new (#3786 part 2) | `tree` and `page` from `docs-source`, `locale`, `labels`, `linkAs?`, `children` (the rendered Markdown) — composes `DocsArticlePage` + `DocsNav` + `Toc` + pager; Fumadocs stays the engine on the Next sites | `DocsShell`, `DocPage`, `DocsProviders`, `mdx.tsx` copies |
| **`docs-source`** | new (#3886) | `readDocs(dir, { locales })` → `{ pages, tree, toc(page), pager(page) }`, pure | ui `lib/docs-source.ts`, the Fumadocs source boilerplate of ts and java |

`OrgSiteView` is the structural type of what `siteFor(id)` returns (`id`, `name`, `mascot`, `description`, `footer`). The
kit does not import `@krizaka/org` at runtime (the same rule `FamilyFooter` follows: data in, nothing fetched); the
sites pass `siteFor(id)` through. The bird therefore arrives inside the org's record, never as a loose literal, and the
guard (§4) checks that the rendered bird is the org's.

### 3.3 The two page shapes

```text
Home of a library                          A docs page
┌ SiteShell ───────────────────────────┐   ┌ SiteShell ───────────────────────────┐
│ NavBar: bird · name · nav · search   │   │ NavBar                               │
│ LibraryHero                          │   │ DocsSite                             │
│   title · lead · version             │   │   DocsNav │ article (Markdown) │ Toc │
│   InstallCommand · example · SiteMascot  │   previous / next                  │
│ PackageCards  (the crates / packages)│   │                                      │
│ LinkCards     (top guides, docs-source)  │                                      │
│ OpenSourceIndex (the other libraries)│   │                                      │
│ FamilyFooter (footerFor(id))         │   │ FamilyFooter                         │
└──────────────────────────────────────┘   └──────────────────────────────────────┘
```

The home ships as a registry example flagged `template` (`purpose: "convince"`, `why: "a developer sees what it is, the
version, how to install it and that it works, in one screen"`), so ui.krizaka.com/templates shows it and every site
copies nothing. krizaka.com `/docs` is an `OpenSourceIndex` plus its product entries, inside krizaka.com's own shell.

### 3.4 The sites that cannot import React: Rust

`rust.krizaka.com` is built by `cargo doc` and a static `site/` in a Rust repository with no Node toolchain. Three ways
to give it the face:

| Option | How | For | Against |
| :-- | :-- | :-- | :-- |
| A. A tiny Next site | `site/` becomes a Next app (`output: "export"`) like ts and java; rustdoc output copied under it | The same stack as ts/java; search and i18n for free | A pnpm workspace, a lockfile, Dependabot npm and a second CI in a Rust repository, for one page; rustdoc pages still bare |
| **B. A generator (recommended)** | `@krizaka/docs` ships a CLI: `npx @krizaka/docs build --config site/site.json --out target/site`. It renders the same React blocks with `renderToStaticMarkup` (home + Markdown guides via docs-source), copies the kit's CSS and fonts, and adds a few hundred bytes of script (theme switch, copy button). It also writes `target/site/rustdoc/{before,after}.html` (the `SiteShell` bar and the `FamilyFooter`, static) and `kz-rustdoc.css` (the Cahier mapped onto rustdoc's CSS variables) | One `npx` step in `pages.yml`; the HTML is the kit's own output, so the face cannot drift; any non-JS repository can use it (a future Python or Go library) | No client navigation, no search box at first (a static `search.json` + small script is a later addition); the kit version is pinned in the workflow, so it needs a `site/package.json` with one devDependency for Dependabot to bump it |
| C. Hand-kept static HTML | Keep `site/index.html`, copy the kit's CSS into it | No build step | It is a copy: it drifts the day the kit moves, and the guard has to tolerate it. This is today, and it is what #3781 forbids |

Recommendation **B**, with rustdoc themed through its **stable** flags (doc.rust-lang.org/rustdoc/command-line-arguments,
checked 2026-11-17: `--extend-css`, `--html-before-content`, `--html-after-content` and `--default-theme` are stable;
`--theme` needs nightly and is not used):

```bash
npx --yes @krizaka/docs@<pinned> build --config site/site.json --out target/site
RUSTDOCFLAGS="--extend-css target/site/rustdoc/kz-rustdoc.css \
  --html-before-content target/site/rustdoc/before.html \
  --html-after-content target/site/rustdoc/after.html" \
  cargo doc --workspace --no-deps
```

So the API pages carry the bar, the footer and the Cahier colours and fonts, and keep rustdoc's own sidebar and search.
Until the generator ships (slice 8), slice 1 fixes the hand page so the home answers Fable's four points now.

**Where the generator lives.** A new package `packages/docs` (`@krizaka/docs`): `docs-source` (pure, also exported for
the Next sites), the `DocsSiteConfig` type, the static renderer and the `check` command (§4). It depends on `@krizaka/ui`
and `@krizaka/org`; the components stay in `@krizaka/ui`. It has its own `AGENTS.md`, `size-limit` for the browser
script, `publint`, and a consumer-smoke case (render the Rust fixture in a fresh folder with no `package.json`).

## 4. The guard: how CI keeps every site on the kit

#3781 done-when asks for one way that fails a site when it leaves the kit. Source rules alone miss the static and Vite
sites and anything a CSS file overrides, so the guard has three layers; the first is new and does most of the work.

| Layer | What it checks | Where it runs | Ticket |
| :-- | :-- | :-- | :-- |
| **G1 · the rendered face** | `krizaka-docs check <built-folder> --site <id>` on the exported HTML (Next `out/`, Vite `dist/`, Rust `target/site`). Every page: `<html data-kz-site>` is a live org id; exactly one `[data-kz="site-bar"]` and one `[data-kz="family-footer"]`; every `[data-kz-bird]` equals the org's bird for the site; `<meta name="krizaka-ui" content>` is within one minor of the npm `latest` of `@krizaka/ui`; the home has `[data-kz="library-hero"]` with a version and an install line; the footer links every live open-source member; no stylesheet outside the kit's declares a raw colour (`#hex`, `rgb(`, `hsl(` with literals) | The shared docs-site workflow of `krizaka/.github` (called by each site's CI on the pull request and on `main`, and on `merge_group`) | new, slice 9 (with #3783) |
| **G2 · the source** | The matrix rules of #3783 (kit lag > 1 minor, raw colours, a hard-coded bird) plus one ESLint rule in `@krizaka/config`: no local file named `TopBar`, `SiteFooter`, `SiteRoot`, `SiteTheme`, `DocsShell` in a site that depends on `@krizaka/ui` | Each repository's lint | #3783 |
| **G3 · the look** | The crawl of #3784 at 390 and 1440, light and dark, compared to the kit's reference pages `/foundations/site-shell` and `/foundations/docs-site`; the width guard (no text column under 280 px) | `krizaka/.github` visual workflow | #3784 |
| G4 · the motion | Dependabot groups `@krizaka/*` in every site repository (Rust through `site/package.json`); `bump-krizaka.yml` opens the grouped bump after each kit release | Each repository | existing, extended to Rust in slice 10 |
| G5 · the data | The org test of #3785: every member with a live site has a bird and a tone; no docs site borrows a product's bird or the falcon; a site id is unique | krizaka-ts | #3785 |

The kit emits the markers G1 reads (`data-kz-site`, `data-kz="site-bar"`, `data-kz="family-footer"`, `data-kz-bird`,
`data-kz="library-hero"`, the `krizaka-ui` meta); a test in `packages/ui` pins each marker so a refactor cannot drop one
silently. G1 is how « Krizaka UI everywhere » becomes a red check instead of a review comment, on every kind of site.

## 5. The slices, in order

Each is one pull request in one repository. The CTO files them; the existing tickets are named where one already covers
the work, so nothing is duplicated.

| # | Repo | What | Done when | Size | Ticket |
| :-- | :-- | :-- | :-- | :-- | :-- |
| 1 | krizaka-rust | **Rust home, Fable's four**, in the hand page: (1) HTTPS on (`Enforce HTTPS` once the certificate is issued; the page and every link use `https://`); (2) the version (read from `Cargo.toml` by `pages.yml`, written into the page) and the install line (the git-tag dependency of the README); (3) a 5–10 line example: a path outside the granted folder is refused (`examples/refused.rs`, compiled by CI so it cannot rot); (4) links to Krizaka UI, Java, TypeScript, Lab and krizaka.com | `curl -I https://rust.krizaka.com` answers 200; the home shows `0.4.0` and the install line; the example compiles in CI; a test in `pages.yml` fails if the version on the page differs from `Cargo.toml` | S | new (with #3625 later) |
| 2 | krizaka-ts | `@krizaka/org`: the `rust` row gets its site (`https://rust.krizaka.com`, `siteLive` once HTTPS answers), its bird and tone, and `footer.sites.rust`; add `siteFor(id)` (member + footer selection in one call) | org tests green with Rust live; `footerFor("rust")` resolves; released in a minor | S | part of #3785 |
| 3 | krizaka-com | `/docs` reads the open-source list from `@krizaka/org` (Rust in it, no `lib/stack.ts` list); fix the React #418 hydration error on `/docs` | `lib/stack.ts` entries gone; a test fails if a hand list comes back; `/docs` has no console error (crawl) | S | new |
| 4 | krizaka-ui | Site ids from the org (#3916): `SiteId` gains `rust`, `agents`; `motion` goes; descriptions read from the org | as #3916 | S | #3916 |
| 5 | krizaka-ui | `SiteShell` + `SiteMascot`, `defaultTheme="system"`, the G1 markers; `SiteCahier`'s `bird` prop deprecated | as #3786 part 1, plus: a test renders each org site id and checks `data-kz-bird`; light scheme renders light | M | #3786 |
| 6 | krizaka-ui | `docs-source` + the `DocsSite` frame (Fumadocs stays the Next engine); the changelog keeps a ≥ 280 px column at 390 px | as #3886 and #3786 part 2; ui.krizaka.com's `lib/docs-source.ts` gone | M | #3886, #3786 |
| 7 | krizaka-ui | `LibraryHero`, `InstallCommand`, `PackageCards`, `OpenSourceIndex`; the library home as a registry template (`purpose: convince`) | blocks exported with meta, examples, stories, tests; ui.krizaka.com/templates shows the home | M | new |
| 8 | krizaka-ui | `@krizaka/docs`: `DocsSiteConfig`, the static renderer, the rustdoc fragments and `kz-rustdoc.css`, `krizaka-docs check` | renders the Rust fixture to HTML with no `package.json` around it (consumer smoke); `check` passes on the fixture and fails on four broken fixtures (no footer, wrong bird, old kit, raw colour) | M | new |
| 9 | .github | The shared docs-site workflow runs G1 on each site's build; #3783's matrix rules; #3784's visual check against the kit's reference pages | a site that drops the footer or pins a kit two minors old goes red; every site calls it | M | #3783, #3784 |
| 10 | krizaka-rust | Adopt the generator: `site/site.json`, `site/package.json` (one devDependency, Dependabot), `pages.yml` runs `build` then `cargo doc` with the rustdoc flags, then `check`; the hand `index.html` goes | rust.krizaka.com home and API pages wear the bar and the family footer in both themes; G1 green | M | #3625 (widened) |
| 11 | krizaka-ts | `site/` adopts `SiteShell`, `DocsSite`, the library home; the 13 local components and the hand family of `postbuild.mjs` go (read the org) | G1 + G3 green; `app/components/` keeps only content components | M | #3788 |
| 12 | krizaka-java | Same, after the bump to the current kit; `Home.tsx` bird literals go; the version shown is the BOM's | G1 + G3 green; one version on the home | M | #3787 |
| 13 | krizaka-ui | ui.krizaka.com adopts `SiteShell` (its `SiteBar`, `SiteRoot`, `SiteTheme` go) and shows the magpie; light scheme renders light | G1 + G3 green | M | #3789 |
| 14 | krizaka-lab | The Vite site adopts `SiteShell` + `FamilyFooter` (React works in Vite; no docs frame needed beyond the guides), drops `lab-bar` | G1 green on `dist/`; kit current | S | new |
| 15 | krizaka-agents-site | agents.krizaka.com is built on the template from its first commit (plan in krizaka-internal#3122), its bird from the org | G1 green at first deploy | S | inside #3122's slices |

Dependencies: 2 before 4 and 10; 4 before 5; 5, 6, 7 before 8; 8 before 9 (G1 needs the command) and 10; 9 is turned on
as « report » first, then « required » once 10–14 are green, so no site is blocked by the guard before it had its slice.
The moves to GitHub Pages (#3025) are independent: the output is static whichever slice lands first.

## 6. What needs the founder

1. **The bird of Rust (and later of Agents).** The nine birds are all taken; a tenth is drawn in `@krizaka/ui/mascots`
   and added to `MASCOT_BIRDS`. Proposal: the **robin** for Rust (its breast is rust-coloured, and it is not a product's
   bird). Slice 2 can ship Rust's site without a bird; slice 10 needs one.
2. **Publishing krizaka-rust on crates.io.** Today the install line is a git-tag dependency. A `cargo add krizaka-rust`
   line needs a crates.io account and claims the crate names (irreversible). The design works with either.
3. **The DNS switch of each site to GitHub Pages** (#3025), one at a time, as already agreed.

## 7. Out of scope

Product screens (Verikora, Folioviv, Sovkora apps), the blog's content rewrite (#3790), the coming-soon faces (#3792),
the #3583 visual queue (its children keep their own order), any production data.
