---
"@krizaka/ui": minor
---

The rest of the shop catalogue (ADR-007, krizaka-ui#744), in `@krizaka/ui/shop/*`, server components on the same frame and rhythm: `video` (`tv` — the old television with the shop's latest reel — and `shorts`), `reviews` (`summary-cards`, `quote`, `strip`; nothing under the host's `minCount`), `bulletin` (`board` — three pinned notes at most, each taken down after its last day — and `banner`, one line of text, never an image), `team` (`row`, `cards`), `visit` (`card`, `map`, `split`; the map is a still and a button on a phone, behind `@krizaka/ui/shop/map-gate`), `story` (`quote`, `owner`), `social` (`links` — a new tab, no referrer, `nofollow` — and `facade`), `faq` (native `details` and the FAQPage JSON-LD) and `policies`. A platform's reel, the social facade and the map on a phone request nothing before a click. The demo shop gains its reviews, news, questions, rules, story, reel and map.
