---
"@krizaka/ui": patch
---

`ImageCropper` (web): a picture that was already loaded before React attached (cache, server render) is measured on mount, so a portrait source covers the frame at any zoom; the box's percentages are rounded so float noise never drops a `top` / `left`.
