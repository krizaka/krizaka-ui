import { MessageBubble, MessageComposer, TypingIndicator } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

// A conversation: runs grouped, the time inside, the receipt under the last of yours, the typing dots, the composer.
export default function NativeChatConversation() {
  const [draft, setDraft] = useState("");
  return (
    <View style={{ width: 360, gap: 4 }}>
      <View style={{ padding: 12, gap: 4 }}>
        <MessageBubble text="Hey! Loved your sunset photo 🌅" time="19:02" grouped="first" />
        <MessageBubble text="Was it Cabo da Roca?" time="19:02" grouped="last" />
        <MessageBubble mine text="It was! Have you been?" time="19:05" grouped="first" />
        <MessageBubble mine text="We should go this weekend" time="19:05" grouped="last" status="read" showStatus labels={{ status: { read: "Read" } }} />
        <TypingIndicator label="Elena is typing" />
      </View>
      <MessageComposer value={draft} onValueChange={setDraft} onSend={() => setDraft("")} placeholder="Message" sendLabel="Send" />
    </View>
  );
}
