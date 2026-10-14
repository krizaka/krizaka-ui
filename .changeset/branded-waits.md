---
"@krizaka/ui": minor
---

Product-branded waits (web and React Native). `Loader` takes the product's animated mark in place of the Krizaka glyph while it waits (`mark={<OrochiaLogo animated />}` on the web, `product="orochia"` natively; the ending is still the drawn check or cross, the delay and the words stay). New native `BrandedRefresh`: a pull-to-refresh where the product's mark grows into place as you pull (iOS) and turns while it refreshes (iOS and Android), announced when the refresh starts. New native `SplashHandoff`: the static native splash dissolves into the animated mark until the first screen is ready, then leaves (still under reduced motion). Replaces each app's own `BusyMark` and static splash.
