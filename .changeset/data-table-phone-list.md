---
"@krizaka/ui": minor
---

`DataTable` `phone="list"` (#636): on a phone (under 36 rem, or always with `layout="cards"`) each row draws as a list row instead of a card in a box — the selection's checkbox first, the `title` column with its `priority: 2` columns joined as one line of facts (« Facture · 23 oct. »), the `status` / `badge` column at the end, a hairline between rows; the other columns go to the row's detail. A `title` column now takes `href`: its name becomes the row's link (stretched over the whole list row). The table semantics, the selection and the detail work as before; the default stays `phone="cards"`.
