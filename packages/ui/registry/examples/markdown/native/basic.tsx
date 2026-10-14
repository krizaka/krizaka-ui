import { Markdown } from "@krizaka/ui/native/markdown";
import { View } from "react-native";

const text = `## What changed in 3.9

The queue now **retries** a failed upload with a backoff, and \`pause\` keeps its place.

- Pause, resume and retry per file
- A 429 waits for its \`Retry-After\`

| Entry | Size |
| :--- | ---: |
| \`@krizaka/pacer\` | 2 kB |

\`\`\`ts title="uploads.ts"
const queue = createQueue({ retries: 3 });
\`\`\`
`;

// The same text as the web example, in Text and View; a link calls `onLinkPress` with its address.
export default function NativeMarkdownBasic() {
  return (
    <View style={{ width: 340 }}>
      <Markdown onLinkPress={() => {}}>{text}</Markdown>
    </View>
  );
}
