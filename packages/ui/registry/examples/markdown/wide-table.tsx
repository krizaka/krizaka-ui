import { Markdown } from "@krizaka/ui/markdown";

const text = `## Generated reference

Identifiers stay whole; move through the table with the arrow keys after focusing its frame.

| Identifier | Profile | Account | Upload | Review | Delivery | Presence | Discovery | Queue |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \`profile-photo-check\` | \`profile-photo-check\` | \`account-access-review\` | \`upload-retry-policy\` | \`review-pending-items\` | \`delivery-status-check\` | \`presence-channel-join\` | \`discovery-manifest-signature\` | \`queue-priority-update\` |
| \`account-access-review\` | \`profile-photo-check\`, \`profile-photo-refresh\` | \`account-session-refresh\` | \`upload-content-validation\` | \`review-assignment-update\` | \`delivery-receipt-confirm\` | \`presence-heartbeat-renewal\` | \`discovery-address-allowlist\` | \`queue-backoff-duration-for-background-upload-retry-policy\` |

A long word: documentationidentifierswithoutanynaturalbreakopportunitiesstillfitonthephone.

- A long URL: [https://example.com/documentation/reference/identifierswithoutanynaturalbreakopportunities](https://example.com/documentation/reference/identifierswithoutanynaturalbreakopportunities)

\`\`\`text
profile-photo-check account-access-review upload-retry-policy discovery-manifest-signature
\`\`\`
`;

export default function MarkdownWideTable() {
  return <Markdown generated generatedLabel="Generated" className="max-w-full">{text}</Markdown>;
}
