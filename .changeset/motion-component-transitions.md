---
"@krizaka/ui": minor
---

Dialog, Sheet, Popover and Tabs enter and leave with motion. The overlay and the panel enter with `@starting-style` (no JavaScript); they leave with a short keyframe exit, so the element stays mounted until the exit has played. Tabs panels fade in when they open. Durations and easings come from the `--kz-motion-*` tokens; under reduced motion the change is instant.
