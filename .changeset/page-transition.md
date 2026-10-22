---
"@krizaka/ui": minor
---

`PageTransition` in `@krizaka/ui/motion`: wrap the root layout's `children` once and a navigation cross-fades and rises (React's `ViewTransition` where the runtime has it, plain children otherwise), from the `--kz-motion-*` tokens; `motion.css` (« PAGE TRANSITIONS ») turns every view transition of the document off under `prefers-reduced-motion`.
