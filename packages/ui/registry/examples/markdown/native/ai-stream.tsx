import { Markdown } from "@krizaka/ui/native/markdown";
import { View } from "react-native";

// An AI answer cut mid-sentence: `streaming` closes what is open, so no `**` or half a link shows on the phone.
const arriving = `Use **a queue**, not a loop: \`createQueue\` runs two files at once, retries a failure and lets you pause one.

1. Add each file with its \`id\`.
2. Pause it with \`queue.pause(id)\`.
3. Read the progress from the **snap`;

export default function NativeMarkdownAiStream() {
  return (
    <View style={{ width: 340 }}>
      <Markdown streaming>{arriving}</Markdown>
    </View>
  );
}
