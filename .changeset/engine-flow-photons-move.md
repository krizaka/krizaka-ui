---
"@krizaka/ui": patch
---

`EngineFlow`: the photons travel again and the engine breathes. The `kz-flow-in/out` keyframes animated `stroke-dashoffset` to `calc(var(--kz-flow-gap) * -1)`, a unitless number the browser cannot interpolate with a length, so each dot only flipped between two equivalent offsets and looked frozen on every site; the gap now carries its unit (`* -1px`). The hub's mark swells slowly in the loop system (`kz-loop`: held off screen and while the page settles, still under reduced motion). The Storybook stories sample the dash offsets in a real browser and fail if nothing moves (or if something moves under reduced motion).
