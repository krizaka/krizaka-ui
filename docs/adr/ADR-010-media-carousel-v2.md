# ADR-010 — Carousel v2: one media carousel for every sequence of clips, demos and stills, and a guard on its files

> **Résumé (FR).** Le carrousel de krizaka.com a été fait à la main parce que `MediaCarousel` n'avançait jamais seul ;
> huit autres lecteurs « maison » répètent la même logique (affiche d'abord, lecture à l'écran seulement, mouvement
> réduit). On garde **un seul composant**, `MediaCarousel` de `@krizaka/ui/media-carousel`, enrichi sans casse :
> les diapositives sont des **données** (affiche, rendus webm/mp4, légende, version texte, `kind` clip · démo d'écran ·
> image, `duration`, `audio`, `chapters`) ; `autoplay` le fait avancer seul au rythme du média (bornes de lecture),
> avec pause visible (WCAG 2.2.2), arrêt au survol, au focus, onglet caché et hors écran, et **rien ne bouge** en
> mouvement réduit ou Save-Data ; le son est une **option** (« Activer le son », puis survol ou focus = le son de la
> diapositive ; jamais de son sans geste) ; `frame="cahier"` donne le registre des sites de la compagnie et `data-hue`
> l'identité de chaque produit. Un **garde média** (`@krizaka/ui/media-guard`, commande `krizaka-media-guard`) refuse
> à la construction un fichier qui n'est pas un vrai 16:9, qui a des bandes noires, une carte de fin noire, un codec que
> Safari ou Chrome ne lit pas, ou une piste audio qui ment. Migration : krizaka.com d'abord (le carrousel maison
> disparaît, Sovkora en tête), puis la page « bientôt », le blogue, Sovkora, Folioviv et Verikora.

- **Status:** accepted — 2026-11-06 (founder's mandate « voir tous nos besoins et proposer une version améliorée du
  carrousel, à livrer », krizaka-internal#2657)
- **Scope:** `@krizaka/ui/media-carousel` (v2, a minor: every v1 prop keeps its meaning), a new Node entry
  `@krizaka/ui/media-guard` and its bin `krizaka-media-guard`; the hosts listed in « Migration »
- **Builds on:** ADR-003 (quiet surfaces: nothing moves under the pointer), ADR-004 (the Cahier register of the company's
  sites), ADR-006 (the product register), the media family of #937 / #957 (`MediaPlayer`, `PausableLoop`)
- **Replaces:** the « never advances by itself » rule of the 2026-11-02 design comment on krizaka-internal#2227, reversed by
  the founder on 2026-11-05 (krizaka-internal#2450)

## Context

### The needs (inventory, 2026-11-06)

| Where | What it shows | Today |
| :-- | :-- | :-- |
| krizaka.com home — the hero (`Fig. 1`) and one carousel per product (Sovkora, Verikora, Folioviv) | generated clips, the brand film's loop, stills | hand-made `ShowcaseCarousel` (#2450), fixed by krizaka-com#637 (#2651) |
| krizaka.com `/story` (takes), the brand film's lightbox and watch page | real screen recordings, the film | `TakeCard` + a hand-made dialog; `MediaPlayer` on the watch page |
| krizaka-coming-soon (`www.verikora.com`, `www.folioviv.com`, `www.sovkora.com`, `www.kridoc.com`) | one reel loop per product; Kridoc's planned 2-slide emotion film (#2655) | hand-made `<video>` + pause, hashes copied by hand |
| the blog (`<Clip>`, card loops, chapter figures) | generated clips and films, provenance under them | hand-made `ClipPlayer`, `CardLoop` |
| Sovkora (sovkora-web) — landing, studio, cinema pack results | demo recordings (16:10 and phone), the film, job results | hand-made `Clip` — its own comment calls it a stand-in |
| Folioviv — hero take, previews to rotate (#2107), the shop's gallery and TV | a real phone journey, 3–4 realisations, the owner's photos and videos | hand-made `HeroTake`, `PreviewFrame`; `ShopGallery`, `RetroTv` |
| Verikora — five showcase clips (#2248) | recorded analyses | planned |
| the products' new demo videos (#2655) | 20–45 s 16:9 screen journeys with zooms, a highlight on what is clicked, chapters | being produced by another session |
| ui.krizaka.com | the examples of the media family | `MediaCarousel`, `MediaPlayer`, `PausableLoop` |

About eight hand-made players repeat the same three things — poster first, play only on screen, nothing under reduced
motion — and each got one of them wrong once. The library's `MediaCarousel` could not be used because it never advanced.

### The bugs of 2026-11-05 (krizaka-internal#2651)

1. A vertical reel pillarboxed in black bars inside a 1280×720 « wide » file — the key said wide, the picture was not.
2. A clip that runs into the reel's black end card, then holds that black frame for the rest of the dwell.
3. A clip whose last 0.4 s bleeds into the next shot of the source reel (a white box over the phone), held the same way.
4. No audio track anywhere, but a sound mechanism was wanted.
5. A slide that could not play: nothing told the page, the frame stayed black.

Bugs 1–3 and 5 are **file** bugs: no component can fix a bad file, but a guard can refuse it before it ships. Bug 2 and 3
were made worse by the component holding the last frame.

### The founder's decisions to honour

16:9 only, no vertical (2026-11-05, #2651) · auto-advance with a visible pause/play (WCAG 2.2.2), held on hover, focus and
off screen (#2450) · nothing moves under reduced motion · a caption and a text version per slide · posters first (the h1
stays the LCP), no double download · sound is an option: a « Sound on » toggle, then hover or focus plays the slide's
audio; never sound without a gesture (#640, #621, #2651) · each product keeps its identity (hue per carousel) · the
Cahier register on the company's sites, the product register in the apps · show what the tool does, provenance only as a
caption (#2154) · captions in HTML, never burned into the video (#2561).

## Decision

### 1. One component, evolved in place

`MediaCarousel` stays the one carousel (`@krizaka/ui/media-carousel`). v2 is **additive**: v1's props (`slides`, `label`,
`ratio`, `labels`, `playerLabels`, `renderLoop`, a slide's `src` / `alt` / `caption` / `video` / `film`) keep their
meaning; a v1 call renders the same carousel, with three visible changes: the slides **cross-fade in place** instead of
scrolling (nothing travels — ADR-003), the default ratio is **16 / 9** (the house ratio), and a slide's `video` plays
**without** `renderLoop` (the carousel draws the clip itself, with its pause in the toolbar). `renderLoop` is deprecated
(kept, honoured, removed in 4.0). The `Showcase` slideshow (deprecated in 3.55) is not revived: its clock idea is kept.

### 2. The API — slides are data

```ts
type CarouselSlide = {
  id: string;
  kind?: "clip" | "screen-demo" | "still";       // default: "clip" with a video, "still" without
  src: string;                                    // the poster (or the still): 16:9, drawn first
  alt: string;                                    // what it shows, in words
  caption?: string;                               // « Fig. 3b — the lease read in a minute »
  text?: string;                                  // the text version's line (default: alt)
  video?: { webm?: string; mp4?: string };        // one rendition, two encodes (VP9 first, H.264 for Safari)
  duration?: number;                              // seconds, from the file (written by the guard): the dwell
  audio?: boolean;                                // the file has an audio track (the guard checks it says the truth)
  chapters?: { at: number; label: string }[];     // a screen demo's steps: ticks + the caption follows them
  film?: …;                                       // v1: a film opened with sound in the lightbox
};
<MediaCarousel label slides autoplay={{ minDwell?, maxDwell? } | true} sound frame="cahier" | "product"
               caption="overlay" | "bar" textVersion labels data-hue onSlideChange />
```

### 3. Behaviours

- **Clock.** With `autoplay`, a slide stays for its dwell: the media's `duration` (a clip, a screen demo), bounded by
  `minDwell` (a reading time, 5 s) and `maxDwell` (45 s, the longest screen journey); a still or a clip without
  `duration` gets `minDwell + 1.5 s`. The clock **is** the CSS animation of the current progress tick (`animationend`
  turns the slide): what fills is exactly what decides, and holding the animation holds the clock where it stood — no
  restart from zero after a hover. The clip **loops** while its slide stays, so a clip shorter than its dwell never holds
  a last frame (bug 2 and 3, from the component's side).
- **Holds** (WCAG 2.2.2): the visible pause/play (its name says what it does), the pointer over
  it, the keyboard focus in it, a hidden tab, the carousel off screen. On hold the clock stops; the clip keeps playing
  (it is what the visitor came to look at) unless the pause was pressed or the carousel left the screen.
- **Reduced motion and Save-Data**: no clock, no clip mounted, no pause button (nothing moves): the posters, previous /
  next and the count. The current tick is drawn full.
- **Turns**: previous / next buttons in a `toolbar` that also takes ← → Home End; a horizontal swipe of 40 px turns one
  slide (`touch-action: pan-y` keeps the page's scroll). With `autoplay` the carousel wraps; without it, it stops at the
  ends and the focus moves to the other button (v1).
- **Focus**: only the buttons take the focus; the ring is drawn by `:focus-visible` (keyboard), never by a click — no frame
  around the stage. The slides out of view are `inert` and `aria-hidden`.
- **Announcements**: the count is `aria-live="polite"` only while nothing advances (a moving carousel is never read aloud).
- **Sound** (`sound`): a « Sound on » toggle (`aria-pressed`) appears only when a slide declares `audio` and something can
  play. After the press — the gesture — hovering or focusing the carousel unmutes the current slide's clip, leaving mutes
  it again. The choice lasts the session (`sessionStorage`), never under reduced motion.
- **Media loading**: the first poster is eager (no `fetchpriority="high"`: the host's h1 stays the LCP), the others are
  drawn only once seen or next; one `<video>` exists — the current slide's — mounted after the page's `load`, with the
  poster as its `poster` (same URL, cached: no double download). The lighter encode (`webm`, VP9) comes first, `mp4`
  (H.264) after. If the last source fails, the clip unmounts and the poster stays (bug 5).
- **Screen demos**: `chapters` draw marks on the current tick; the caption follows the chapter under the playhead; the text
  version lists the chapters.
- **Text version**: `textVersion` renders a native `<details>` after the carousel with every slide's caption and text
  (and chapters); `children` go inside it (the host's sources, a link to the film). It is in the HTML before any script.
- **Identity**: `frame="cahier"` — square corners, a strong hairline, a solid paper shadow, the caption in the bar in the
  typewriter face; `frame="product"` (default) — the product register's rounded frame. `data-hue` (or a brand class on an
  ancestor) colours the current tick through `--kz-hue`, falling back to the accent.

### 4. The media guard

`@krizaka/ui/media-guard` (Node only) holds the rules as pure functions over what `ffprobe` / `ffmpeg` measured, and
`krizaka-media-guard <slides.json> [--base <url>]` runs them on real files (ffmpeg on the `PATH`). For every slide:

| Rule | Why |
| :-- | :-- |
| every file answers 200 with its content type | a slide that cannot play |
| the video is 16:9 by its **pixels** (±16 px of encoder rounding), not by its name | bug 1 |
| the mp4 is H.264, `yuv420p`, `moov` before `mdat` (fast start); the webm is VP9 | plays in Safari and Chrome, starts before it is downloaded |
| no frame is a picture between two black side bars (pillarbox) or two black top/bottom bands (letterbox) | bug 1 |
| the last frame is not black (average luma ≥ 6) | bug 2 |
| `audio` is true exactly when the file has an audio track | bug 4: the sound toggle never lies |
| `duration` matches the file (±0.25 s) | the clock is the media's |

The guard checks pixels it can measure; it cannot see a smeared frame (bug 3). That one stays a human review of the
storyboard, and the loop keeps a bad tail from being held on screen.

### 5. Budget and tests

- `./media-carousel` ≤ 34 kB gzip (`MediaPlayer`'s lightbox is the bulk; the clock, the clip, the sound and the chapters
  measure +2.4 kB over v1). `./media-guard` (≤ 3 kB) is Node only, never shipped to browsers.
- Unit (Vitest + happy-dom): the clock (dwell bounds, `animationend`, holds), reduced motion, Save-Data, page load, the
  sound gesture, a failing source, chapters, the text version, keyboard, swipe, axe; the guard's rules on fixtures.
- Stories (Storybook, axe + screenshots dark and light, phone): autoplay with ticks, the Cahier frame with a hue, a screen
  demo with chapters. The test runner reduces motion, so the screenshots are the still state.
- Journeys (Playwright, in the host): krizaka.com's built home — every carousel turns, holds on hover, pauses, plays
  each slide's clip without error, nothing moves under reduced motion.
- Documentation: generated from `meta.ts` and the examples on ui.krizaka.com (`/components/media-gallery`).

## Migration

1. **krizaka.com** (krizaka-internal#2658, after krizaka-com#637): `ShowcaseCarousel` is deleted; the four carousels are
   `MediaCarousel` with `autoplay`, `sound`, `frame="cahier"`, `caption="bar"`, `textVersion` and the product's hue;
   `scripts/check-showcase-media.mjs` reads its rules from `@krizaka/ui/media-guard`. The products' sections go Sovkora,
   Verikora, Folioviv (the products row keeps Sovkora in the centre).
2. **krizaka-coming-soon**: the reel becomes a one-slide `MediaCarousel` (`frame="cahier"`), its files the 16:9 ones,
   checked by the guard; Kridoc's two-slide film uses `autoplay`.
3. **The blog**: `ClipPlayer` → a one-slide `MediaCarousel` (provenance as caption); `CardLoop` stays (a card cover, not a
   sequence).
4. **Sovkora** (sovkora-web): `Clip` → `MediaCarousel` with `kind: "screen-demo"` and chapters for the new
   journeys (#2655); results of the cinema pack as slides.
5. **Folioviv / Verikora**: the rotating previews (#2107) and the showcase clips (#2248) — `autoplay` with the owner's
   bounded dwell for the shop (#2107: 3–10 s, `minDwell` = `maxDwell` = the owner's value).
6. `PausableLoop` stays for a single decorative loop that is not a sequence; `renderLoop` is removed in 4.0.

## Consequences

- One place fixes a carousel bug for every site and app; a bad file is refused at build, not found by the founder.
- Hosts write slides as data (often generated): the guard reports the measured `duration` and `audio` (`--json`) to write back.
- The component holds a little more state (the clock, the sound choice); the test suite grows with it.
- The CSS clock depends on the component's own `<style>` (hoisted, deduplicated): without CSS animations the carousel does
  not advance — the safe failure.
