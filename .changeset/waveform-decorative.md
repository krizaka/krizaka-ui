---
"@krizaka/ui": minor
---

New `Waveform` (`@krizaka/ui/waveform`, and `Waveform` on `@krizaka/ui/native`): the bars of a sound drawn on their own, for a card or a banner. `peaks` (resampled to `bars`), `size` (sm · md · lg), `tone` (accent · neutral), `playing` for a gentle idle motion. Decorative by default (`aria-hidden`); a `label` makes it an image. Still under `prefers-reduced-motion`, and paused off screen on the web. `AudioPlayer` now shares its bar resampling (`resamplePeaks`, unchanged).
