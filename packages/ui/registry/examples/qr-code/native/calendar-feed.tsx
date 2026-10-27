import { QrCode, Txt } from "@krizaka/ui/native";
import { View } from "react-native";

// A private calendar feed: scan it from another phone, or copy the link (the app puts it on the clipboard).
export default function NativeQrCodeCalendarFeed() {
  return (
    <View style={{ rowGap: 8, padding: 16 }}>
      <Txt variant="label">Your calendar on your phone</Txt>
      <Txt variant="caption" tone="secondary">Scan this code, or copy the link. Keep it private.</Txt>
      <QrCode
        value="https://example.com/ical/7f3c9a1e-4b2d-4c8e-9a51-0d6f2b8e3c17.ics"
        label="Calendar feed: scan to subscribe"
        copyLabel="Copy the link"
        onCopy={() => undefined}
        level="Q"
      />
    </View>
  );
}
