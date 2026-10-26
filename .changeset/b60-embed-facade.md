---
"@krizaka/ui": minor
---

`@krizaka/ui/embed-facade`: `EmbedFacade`, a click-to-load facade for a TikTok, YouTube Shorts or Instagram video (Law 25: nothing is requested from a platform before the visitor asks). The poster is the host's own copy (a platform's picture is refused), the button names the platform, the frame is added only after the click with a minimal `sandbox` and `allow`; `embedUrl(platform, url)` is the pure validator (https only, exact hosts and paths, `null` otherwise). `RetroTv` takes `children` for its screen (an `EmbedFacade`) and is no longer deprecated: Akinaza's shop pages use it (krizaka-ui#605, #674).
