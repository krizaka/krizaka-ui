import { MessageBubble } from "@krizaka/ui/native";
import { Markdown } from "@krizaka/ui/native/markdown";
import { View } from "react-native";

// A model's answer in Markdown, in the same bubble as the plain messages: `text` stays its words (read, copied).
const answer = "The lease is **12 months**, renewable. Two clauses to read again:\n\n1. Rent rises by `2.5 %` each year.\n2. A sublet needs the owner's written consent.";

export default function NativeChatRichAnswer() {
  return (
    <View style={{ width: 360, padding: 12, gap: 6 }}>
      <MessageBubble mine text="What should I check in this lease?" time="10:41" />
      <MessageBubble text={answer.replace(/[*`]/g, "")} time="10:41">
        <Markdown>{answer}</Markdown>
      </MessageBubble>
    </View>
  );
}
