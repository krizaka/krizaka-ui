---
"@krizaka/ui": patch
---

motion.css reads the accent: the `kz-spotlight` glow and the `kz-lift` shadow mix `--kz-accent` (`color-mix` in oklab)
instead of a hard-coded violet, with the former violet as fallback for hosts without tokens.
