import { QrCode } from "@krizaka/ui/qr-code";

// A private calendar feed: scan it from the phone to subscribe, or copy the link. The words arrive translated.
export default function QrCodeCalendarFeed() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-fg">Your calendar on your phone</p>
      <p className="max-w-xs text-xs text-fg-secondary">Scan this code with the camera, or copy the link. Anyone with it can read your bookings: keep it private.</p>
      <QrCode
        value="https://example.com/ical/7f3c9a1e-4b2d-4c8e-9a51-0d6f2b8e3c17.ics"
        label="Calendar feed: scan to subscribe"
        copyLabel="Copy the link"
        copiedLabel="Link copied"
        level="Q"
      />
    </div>
  );
}
