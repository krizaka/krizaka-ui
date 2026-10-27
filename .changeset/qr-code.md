---
"@krizaka/ui": minor
---

New `QrCode` (`@krizaka/ui/qr-code`, and `QrCode` on `@krizaka/ui/native`): a QR code drawn offline from a `value`, with no dependency and no call to any service. Dark modules on a light tile in dark and light themes alike (a phone reads dark on light), a quiet zone (`quietZone`, 4 modules by default), `size`, the error-correction `level` (L · M · Q · H), an image named by `label`, and an optional copy action (`copyLabel`, `copiedLabel`, `onCopy`; on native `onCopy` receives the text for the app to put on the clipboard). The pure encoder is exported too: `encodeQr` and `qrPath`. Closes krizaka-ui#760 (for krizaka/akinaza#282).
