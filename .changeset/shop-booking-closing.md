---
"@krizaka/ui": minor
"@krizaka/tokens": minor
"@krizaka/tailwind": minor
---

feat(shop): `booking.closing` — the closing call of a shop page (krizaka/akinaza#478 slice 1). `BookingSection variant="closing"` draws the shop's photo (a fixed 4:3 box, lazy) or its mark, the next free time as a text link (a closed day shows the next opening's), a primary « Book » and a secondary « Call » / « Directions ». Server-rendered, no client code. Without a photo, a free time or a secondary action it degrades to the title and the primary alone, never an empty box. `booking` gains the `closing` variant in the catalogue.

The `./shop/booking` size limit goes from 1.7 kB to 2.3 kB (2.21 kB measured; accepted by the CTO 2026-10-27, #802): the entry now holds a second full variant (the photo box, the slot, two actions). It is server-rendered; the client bundle of a shop page does not grow.

Size-limit entry note: « + closing variant (server-only), CTO 2026-10-27, #802 ». (The config format takes no comment key, so the note lives here and in the PR.)
