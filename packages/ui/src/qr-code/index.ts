/** @krizaka/ui/qr-code — `QrCode` (`value`, `label`, `size`, `quietZone`, `level`, `copyLabel`): a QR code drawn offline from a text, dark on a light tile in both themes. `encodeQr` is the pure encoder. Client ("use client"). */
export { encodeQr, type QrLevel, type QrMatrix, qrPath,QrTooLongError } from "./encode";
export { QrCode, type QrCodeProps } from "./qr-code";
