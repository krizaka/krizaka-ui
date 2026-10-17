---
"@krizaka/ui": patch
---

NavBar test: the Escape assertion waits for Radix's close instead of racing it (flaky on loaded CI runners, red on main).
