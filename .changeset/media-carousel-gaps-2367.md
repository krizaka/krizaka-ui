---
"@krizaka/ui": minor
---

`MediaCarousel` and `MediaPlayer`, six gaps found while adopting them on krizaka.com: a carousel of one slide draws no arrows and no count; a `video` loop (also on a `film` slide, where it previews the film) is fetched after the page's `load`, plays only on screen, and has a visible pause / play button (`labels.pauseLoop`, `labels.playLoop`; a still under reduced motion or Save-Data); `playerLabels` (and `film.labels`) translate the lightbox player; the lightbox opens on its poster, waiting for a press on play, under reduced motion or Save-Data; `MediaPlayer` takes `trigger` (your own opener, or `null`), `open` / `defaultOpen` / `onOpenChange` and `preview` / `previewLabels`; and `ratio` takes any frame (`19 / 16`). All additive.
