# ADR-009 — In-app help: words explained in place, one « ? » per screen, short tours, empty states that teach, an assistant that cites

- **Status:** proposed — 2026-10-31 (Platform design session of krizaka-internal#1954, founder direction)
- **Scope:** `@krizaka/ui` (new `help` domain: `HelpProvider`, `GlossaryTerm` v2, `HelpButton` + `HelpPanel`, `Tour`,
  `EmptyState` v2, `AskAssistant`), a `krizaka-help check` command, and the apps that use them: Yomizaka, Akinaza,
  Orazaka (web, Mac; phone where noted), the founder's cockpit
- **Builds on:** ADR-001 (third-party engines behind `@krizaka/*` facades), ADR-002 (the Mac app is the web in a window),
  ADR-008 (functional domains), Akinaza ADR-010 §5 (the editor assistant through Orazaka, confirm to apply — slice A3)
- **Fed by:** the UX reviews krizaka-internal#1890 (Yomizaka) and #1907 (Akinaza); the critical journeys of #1918

## Context

The founder, 2026-10-31: « c'est difficile pour tout le monde de comprendre comment utiliser l'app ». The two reviews
show what that means in practice:

- **Words.** « Dossiers » is two different things in Yomizaka (applicant files in the nav, the binder's collections in
  the user's mouth); « Books » (bookkeeping) reads as « bookings » in Akinaza; a failed check says « Orazaka finished
  without a report Yomizaka can read ».
- **Next step hidden.** The required « Which document? » sits under the fold after a drop; « Open the hours » lands on
  Team; a failed check has no way out.
- **Empty pages that do not teach.** The empty « Applicant files » shows four tabs at 0, filters and « 0 files » above
  « No applicant file yet ».
- **First run not verified** in either product.

What `@krizaka/ui` has today: `GlossaryTerm` (a Radix `Tooltip`: hover and focus only — **it never opens on a phone**,
and a tooltip may not hold a link), `Glossary`, `EmptyState` (rounded, dashed: against the square rule of
`krizaka-product-design`), `Popover`, `Sheet`, `Chat`, `Markdown`, `GenUi`, `MascotQuote`, `Kbd`. No tour, no help panel,
no help catalogue, no assistant surface.

## Research (dated)

- **NN/g, « Onboarding Tutorials vs. Contextual Help »** (P. Laubheimer, 2023-02-12): prefer contextual, just-in-time
  help to push tutorials; make help easy to dismiss **and easy to find again**; show that help exists without showing
  all of it; keep help for complex features, not conventional controls; a tutorial, if any, interactive and revisitable.
- **Toggletips over tooltips** (H. Pickering, *Inclusive Components*, « Tooltips & Toggletips », 2017; WAI-ARIA APG
  tooltip pattern): a tooltip is a non-interactive description on hover/focus; content that must work on touch or hold
  a link is a button that toggles a non-modal popover.
- **Tour libraries**, read from the npm registry on 2026-10-31, with a spike that inspected each bundle:

  | Library | Version · date | Licence | Weekly | What the spike found | Verdict |
  | :-- | :-- | :-- | --: | :-- | :-- |
  | driver.js | 1.10.2 · 2026-10-18 | MIT | 3.4 M | 0 deps, 27 kB; popover `role="dialog"` with labelledby/describedby, Tab kept in the popover, Escape and arrows; builds its DOM itself and sets title/description through `innerHTML` (8 sites); no reduced-motion handling | accessible enough, but it cannot render our `Button`, words go in as HTML strings |
  | react-joyride | 3.2.0 · 2026-07-09 | MIT | 2.0 M | React; `alertdialog`, `aria-modal`, `aria-live`, Tab handling; 10 deps including a second Floating UI binding; custom tooltip component possible | the fallback behind our facade |
  | Shepherd | 15.3.0 · 2026-08-24 | **AGPL-3.0** | 0.5 M | — | refused (licence) |
  | intro.js | 8.6.0 · 2026-09-21 | **AGPL-3.0** | 0.26 M | — | refused (licence) |
  | @reactour/tour | 3.8.0 · 2025-05-07 | MIT | 0.27 M | no release for 18 months | refused (maintenance) |
  | onborda | 1.2.5 · 2024-12-22 | MIT | 0.03 M | small, stale | refused |

- **Help SaaS** (Pendo, Appcues, Intercom-style widgets): content and behaviour data leave our stack, a second design
  system on top of ours, a per-seat cost. Refused.
- **Docs-backed assistants** in the products people trust answer from the product's own documentation, **cite** the
  pages they used, say « I don't know » without a source, and propose actions the user confirms. That is already our
  editor decision (Akinaza ADR-010 §5).

## Decision

### 1. Five components and one provider, in a new `help` domain of `@krizaka/ui`

All square and matt, tokens only, EN/FR from the host's catalogue (no word in the library), both themes, 360 px,
keyboard, ≥ 44 px targets, nothing moves under `prefers-reduced-motion`.

| Component | What it is | Accessibility |
| :-- | :-- | :-- |
| `HelpProvider` + `useHelp()` | holds the product's help catalogue (structure + resolved messages), the current `screen` id, the seen-tours store, and an `onEvent` callback (metrics, §4). No network, no vendor. | — |
| `GlossaryTerm` (v2) | a **toggletip**: the domain word, dotted underline, a `button` that opens a non-modal `Popover` on click, tap, Enter or Space — short definition (≤ 160 chars), « More in help » that opens the `HelpPanel` on the term. Reads `id` from the catalogue (`<GlossaryTerm id="dossier">dossiers</GlossaryTerm>`); the v1 `term` + `definition` props stay. Mark the first occurrence per screen only. | `aria-expanded`, the popover labelled by the term, Escape and outside click close, focus returns to the word |
| `HelpButton` « ? » + `HelpPanel` | one per screen, in the app header (`AppShell` slot). The panel is a `Sheet` (right on desktop, bottom on phone): **what this screen is for** (one sentence) · **what you can do here** (2–3 lines, each may start the tour at its step) · **words on this screen** (its glossary entries) · « Replay the tour » · « Read the guide » (absolute URL on the product's docs) · « Ask » when the assistant is on. Shortcut `?` outside text fields. | `Dialog` focus trap, `aria-keyshortcuts="?"`, focus back to « ? » |
| `Tour` | 3–5 steps on the **first visit of a screen**, after the page settles; each step anchored to an element marked `data-help="<step id>"`; « Step 2 of 4 », Back, Next, **Skip** always visible; remembered per tour **version**; replayable from the panel. **Non-modal coach mark**: no dark overlay, the target keeps working (the user does the step, NN/g's interactive tutorial); the target gets an outline ring. A missing target skips its step and emits `tour.missing-target`. | popover `role="dialog"` `aria-modal="false"` labelled by the step title, step count in a polite live region, focus to the step on open and back to the trigger on close, Escape ends and marks seen |
| `EmptyState` (v2) | **teaches**: `title` = what goes here, `description` = what it is for, **one** primary `action` to start, optional `learn` (opens the panel or the tour). `kind`: `first-run` · `no-results` (says how to widen the filters, one « Clear filters ») · `failed` (what happened in plain words, « Try again », « Contact us » — Yomizaka finding 3). Square, solid, no dashed rounded box. Rule in its meta: an empty collection hides the chrome that has nothing to act on (tabs at 0, filters, « 0 files »). | `role="status"` kept; the action is a `Button` |
| `AskAssistant` | the « Ask » tab of the panel (and a standalone surface for the editor, ADR-010 §5): a question field, the answer in `Markdown` with **its sources** (links to the doc pages it used), **suggested actions** as typed commands shown as `Button`s the user confirms — never a silent action. A first-use notice says what is sent. Off unless the host passes an `ask` function. States: thinking, answered, « no source — read the guide », unavailable, quota reached. | `aria-busy` while answering, the answer in a live region, actions are buttons with their consequence in the label |

**The tour is built small on Radix `Popover`, not on a tour library.** Radix is already in `@krizaka/ui`
(positioning through Floating UI, collision, Escape, focus); a tour is a sequence of anchored popovers plus a ring —
under 250 lines. driver.js renders its own DOM from HTML strings, so our `Button`, tokens and `Rich` messages cannot be
used and our words would pass through `innerHTML`; react-joyride brings ten dependencies and a second positioning
stack. **The `Tour` API is a facade**: if the a11y audit of the slice fails or the code grows past the budget, the
same API is reimplemented over react-joyride v3 (MIT, maintained) with its custom tooltip component, and the apps do
not change.

**Native and desktop parity** (meta `parity`): desktop = web (ADR-002). Native: `HelpPanel` → the native `Sheet`,
`GlossaryTerm` → a tap that opens a bottom sheet, `EmptyState` → the native one; `Tour` native is a `gap` with its own
issue (orazaka-mobile-client is the only native app that needs it).

### 2. The content model: one help catalogue per product, versioned with the app, checked at build

Help is **content of the app**, not of a docs site and not of a SaaS: it ships in the same commit as the screen it
explains, in both languages.

- **Words** in the app's catalogues (`messages/en.json`, `messages/fr.json`), under `help.*`, checked by
  `krizaka-i18n check` like every other string:

  ```
  help.glossary.<term>.{term, definition}
  help.screens.<screen>.{title, purpose, can.<n>}
  help.tours.<tour>.<step>.{title, body}
  help.empty.<screen>.<list>.{title, description, action}
  ```

- **Structure** in `help/catalogue.ts` (data only, typed by `HelpCatalogue` from `@krizaka/ui/help`):

  ```ts
  export const help = {
    product: "yomizaka",
    screens: {
      home:   { route: "/app",        glossary: ["dossier", "check"], doc: "https://www.yomizaka.com/docs/home",
                tour: { id: "home", version: 1, steps: ["check-a-document", "my-dossiers", "report"] } },
      check:  { route: "/app/check",  glossary: ["kind", "report"],   doc: "https://www.yomizaka.com/docs/check" },
    },
  } satisfies HelpCatalogue;
  ```

- **Usage docs** (the « guide ») in the product repository, `docs/usage/{en,fr}/*.md`, one page per screen at least,
  published on the product's site at every release. They are the long version; the catalogue is the short one.
- **`krizaka-help check`** (a bin of `@krizaka/ui`, run in `npm run lint` and in CI) **fails the build** when:
  - a route of the app (its route manifest) has no screen entry — **a screen without help fails**;
  - a screen lacks `purpose`, has fewer than 2 or more than 3 `can` lines, or its `doc` is not an absolute URL of the
    product's site with a usage page in `docs/usage/` for both languages;
  - a glossary id used in a screen or in `<GlossaryTerm id>` is missing in either language, or a definition exceeds
    160 characters;
  - a tour has fewer than 3 or more than 5 steps, a step body exceeds 140 characters, or a step id has no
    `data-help="…"` in the sources;
  - a product's lexicon is broken (`help.lexicon.never` in the catalogue — e.g. Yomizaka's help never names Orazaka,
    the « product first » rule).
- **Versioning**: the catalogue is the app's version. A tour shows again only when its `version` rises (a changed
  screen), never on every release.
- **Help never papers over design.** A word the review found confusing (« Dossiers », « Books ») is renamed in the UI;
  the glossary explains domain words (constat, TVQ, run, pack), not bad labels. A screen whose « ? » opens more than one
  visit in five gets a design issue, not more help (§4).

### 3. The assistant: Orazaka RAG over the product's usage docs, consented, limited, confirm-before-action

- **One port per product, shared with the editor assistant.** Each product's `lib/assistant.ts` (`AssistantPort`, the
  shape of Akinaza ADR-010 §5) gains a `scope: "help" | "editor"`; `AskAssistant` receives
  `ask(question, { locale, screen }) → { answer, sources[], actions[] }`. The port calls **Orazaka's public API only**.
- **One Orazaka pack, « product help »** (orazaka-packs), instantiated per product: it indexes the product's
  `docs/usage/` and its help catalogue **at each release of the product** (the index carries the app version), answers
  only from retrieved passages, returns the sources, and **answers « I don't know » under the retrieval threshold**.
  Actions are a closed, typed list the product declares (`openScreen`, `startTour`, `prefill` — and the editor's
  `addSection`, `setVariant`…); anything else is dropped.
- **What is sent**: the question, the locale, the screen id and the app version. **Never** a customer, a document, a
  booking, an amount or a name. A first-use notice says so (Loi 25), and the user can turn « Ask » off.
- **Limits**: off by default per product (`assistant.help.enabled`, an admin setting in the database), a daily quota
  per account set by the admin, Orazaka credits from its pricebook; quota reached → « read the guide » with the link.
- **Confirm before action**: a suggested action is a button with its consequence (« Open Check with "lease" chosen »);
  nothing happens without the click; no action ever publishes, pays, sends or deletes.
- **Unanswered questions** (no source) are counted per screen without their text by default; the text is kept 30 days
  only when the user ticked « help us improve the guide ». They feed the usage docs, through the admin console.

### 4. Measure: help that works makes itself less needed

`HelpProvider.onEvent` emits vendor-free events the product sends to its own analytics (no personal data, no question
text): `help.open{screen}`, `glossary.open{term}`, `tour.start|step|skip|complete{tour, step}`,
`tour.missing-target{tour, step}`, `empty.action{screen, list}`, `ask.sent|answered|no-source|action-confirmed{screen}`.

- **Time to first success** per critical journey of #1918, from account creation (or first visit) to the journey's
  success event: Yomizaka — first report read; Akinaza owner — first booking confirmed or first invoice sent; Akinaza
  visitor — booking confirmed; Orazaka — first run completed.
- **Task success** of the critical journeys: the e2e suites of #1918 (pass/fail after every deploy), and the same
  funnel on real sessions.
- **Help load per screen**: help opens per 100 visits, tour skip rate per step, no-source rate of « Ask ». Thresholds
  open a design issue (more than 20 opens per 100 visits, a step skipped by more than half).
- The **cockpit** shows these per product, next to the journeys' state.
- **The e2e journeys run the help**: each critical journey opens « ? » once on its first screen and walks the tour;
  `tour.missing-target` fails the run.

## Refused

- A forced or long tour (more than 5 steps), a tour on every screen, a video as the first run.
- A floating chat bubble on every page; a help SaaS; a second design system for help.
- A tooltip as the only way to read a definition (it never opens on touch).
- An assistant answer without a source; an action applied without a click; sending user data to answer a « how do I ».
- Help text in components, in a ternary on the locale, or anywhere but the messages.
- Explaining a confusing label instead of renaming it.

## Slices (sub-issues of krizaka-internal#1954)

| # | Repo · lane | What | Gated by |
| :-- | :-- | :-- | :-- |
| H1 | krizaka-ui · platform | `HelpProvider`, `HelpCatalogue` types, `krizaka-help check`, `GlossaryTerm` v2 (toggletip, catalogue ids) | this ADR |
| H2 | krizaka-ui · platform | `HelpButton` « ? » + `HelpPanel` (Sheet, `?` shortcut, native Sheet twin) | H1 |
| H3 | krizaka-ui · platform | `Tour` on Radix Popover (facade; joyride fallback documented) | H1 |
| H4 | krizaka-ui · platform | `EmptyState` v2 that teaches (`first-run` · `no-results` · `failed`), square | — |
| H5 | krizaka-ui · platform | `AskAssistant` + the `AssistantPort` types (`scope`), consent notice, states | H2 |
| H6 | orazaka-packs · orazaka | the « product help » pack: RAG over `docs/usage/` + catalogue, citations, typed actions, threshold, per-release index | — |
| Y1 | yomizaka · yomizaka | help catalogue + usage docs for home, check, report; tours on home and check; teaching empty and failed states; events | H1–H4 |
| Y2 | yomizaka · yomizaka | « Ask » through `AssistantPort` | H5, H6 |
| A1 | akinaza · akinaza | help catalogue + usage docs for the owner's day, booking (owner and visitor), invoices; tours; empty states; events | H1–H4 |
| A2 | akinaza · akinaza | « Ask » in the panel, sharing the A3 port (#1895) | H5, H6, A3 |
| O1 | orazaka-web-client · orazaka | help catalogue + usage docs for the web and Mac app (runs, packs, keys); tour; empty states; « Ask » | H1–H6 |
| C1 | krizaka-internal · platform | the cockpit: « C'est quoi ? » on each view, the architecture in plain words (glossary over #1922's map), the help metrics of §4 | H1, H2 |

## Consequences

- Every new screen of a product carries its help in the same pull request, or the build fails.
- `GlossaryTerm`'s v1 props keep working; its behaviour changes from hover to toggle (minor version, changeset).
- `EmptyState` v2 changes its look (square) for every consumer: a minor with a visual baseline update.
- The assistant costs Orazaka credits per question, capped by the admin; with it off, the panel is complete without it.
- A tour library may still come in later behind `Tour` without touching the apps.
