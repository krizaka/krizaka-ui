---
"@krizaka/tokens": minor
"@krizaka/ui": minor
---

Kachizaka (predictions among friends, points only) and Akinaza (the shop OS for Québec): their brands, marks and mascots.

- `@krizaka/tokens`: `brands/kachizaka.css` / `.brand-kachizaka` — **victorious gold** accent (hue 48, the family's only gold, ≥ 10° from warning and ≥ 20° from every brand accent) with **electric cobalt** (226) as `accent-2`, section ground, light accent text and ring; the cobalt alone sits 9° from the Krizaka blue, so it never leads (a test says so). `brands/akinaza.css` / `.brand-akinaza` — **Laurentian forest green** accent (hue 130, ≥ 20° from sage, emerald, success and every accent) with a matte **copper** `accent-2` (≤ 65 % saturation, never Orazaka's orange). `marks.kachizaka` (cobalt → gold) and `marks.akinaza` (forest → copper), every stop ≥ 3:1 in both themes. Budgets `.` 4.2 kB, `./native` 2.5 kB, `scoped.css` 1.5 kB.
- `@krizaka/ui`: `KachizakaLogo` / `KachizakaMark` ("the sealed cup": a trophy cut at its rim, the seal — a star — breathes, the ball on the orbit) and `AkinazaLogo` / `AkinazaMark` ("the open shop": an awning cut at its corner, the shop front, the open door's warm light, a coin on the orbit); `ProductLogo` / `ProductMark` accept both ids; default avatars for both. The flock welcomes **the magpie** (keeps the score) and **the beaver** (builds the shop) in `Mascot` (web and native) with their own palettes. `@krizaka/ui/sites`: a new status `development` ("In development" / "En développement") and both products in it, their address the repository until a dev site exists.
