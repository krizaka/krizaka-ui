---
"@krizaka/ui": patch
---

`Map` follows the page's theme even when it flips before the engine has loaded: the map was created with the scheme of its first render and never corrected (a light page showed the dark basemap). The scheme is read when the engine is ready, and the effect applies any difference.
