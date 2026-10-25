import { Markdown } from "@krizaka/ui/native/markdown";
import { View } from "react-native";

const text = `## Generated reference

Swipe sideways to read the reference. Identifiers keep their full width.

| Identifier | Profile | Account | Upload | Review | Delivery | Presence | Discovery | Queue |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \`profile-photo-check\` | \`profile-photo-check\` | \`account-access-review\` | \`upload-retry-policy\` | \`review-pending-items\` | \`delivery-status-check\` | \`presence-channel-join\` | \`discovery-manifest-signature\` | \`queue-priority-update\` |
| \`account-access-review\` | \`profile-photo-refresh\` | \`account-session-refresh\` | \`upload-content-validation\` | \`review-assignment-update\` | \`delivery-receipt-confirm\` | \`presence-heartbeat-renewal\` | \`discovery-address-allowlist\` | \`queue-backoff-duration\` |

A long word: documentationidentifierswithoutanynaturalbreakopportunitiesstillfitonthephone.
`;

export default function NativeMarkdownWideTable() {
  return (
    <View style={{ width: "100%", maxWidth: 640 }}>
      <Markdown generated generatedLabel="Generated">{text}</Markdown>
    </View>
  );
}
