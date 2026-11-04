---
"@krizaka/ui": minor
---

`MediaCarousel` and `MediaPlayer`, six gaps found while adopting them on krizaka.com: a carousel of one slide draws no arrows and no count; the new entry `@krizaka/ui/pausable-loop` (`PausableLoop`) is a silent loop fetched after the page's `load`, playing only on screen, with a visible pause / play button (a still under reduced motion or Save-Data); the carousel draws a slide's `video` through `renderLoop` (also on a `film` slide, where it previews the film) and the player through `preview`, so neither entry carries it; `playerLabels` (and `film.labels`) translate the lightbox player; the lightbox opens on its poster, waiting for a press on play, under reduced motion; `MediaPlayer` takes `trigger` (your own opener, or `null`), `open` / `defaultOpen` / `onOpenChange` and `preview`; and `ratio` takes any frame (`19 / 16`). All additive.
