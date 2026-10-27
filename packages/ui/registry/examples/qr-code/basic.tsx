import { QrCode } from "@krizaka/ui/qr-code";

// The text becomes a code in the browser: dark modules on a light tile, in dark and light themes alike.
export default function QrCodeBasic() {
  return <QrCode value="https://www.krizaka.com" label="Krizaka — scan to open the site" size={160} />;
}
