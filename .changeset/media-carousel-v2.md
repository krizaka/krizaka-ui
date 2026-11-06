---
"@krizaka/ui": minor
---

Carousel v2 (ADR-010): `MediaCarousel` takes slides as data (`kind` clip · screen-demo · still, `duration`, `audio`, `chapters`, `text`), advances by itself with `autoplay` at the media's pace (5–45 s, a visible pause, held under the pointer, on keyboard focus, on a hidden tab and off screen; nothing moves under reduced motion or Save-Data), draws its clips itself (one `<video>` after `load`, poster kept when no source plays), offers « Sound on » with `sound`, the Cahier frame (`frame="cahier"`), the caption in the bar (`caption="bar"`) and a text version (`textVersion`). Slides cross-fade in place; the default ratio is 16 / 9; `renderLoop` is deprecated. New `@krizaka/ui/media-guard` and its bin `krizaka-media-guard`: 16:9 by pixels, H.264 yuv420p fast start + VP9, no pillarbox or letterbox, no black end card, truthful `audio` and `duration`.
