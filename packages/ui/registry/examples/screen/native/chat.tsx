import { Avatar, Header, MessageBubble, MessageComposer, Screen, TypingIndicator } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

// A chat: the person in the header with their presence, the messages, the composer above the keyboard.
export default function NativeScreenChat() {
  const [draft, setDraft] = useState("");
  return (
    <View style={{ width: 360, height: 640 }}>
      <Screen
        header={<Header size="inline" title="Elena" backLabel="Chats" onBack={() => undefined} actions={<Avatar alt="Elena, online" size="sm" presence="online" presenceLabel="online" />} />}
        footer={<MessageComposer value={draft} onValueChange={setDraft} onSend={() => setDraft("")} placeholder="Message" sendLabel="Send" />}
        contentStyle={{ gap: 4, justifyContent: "flex-end", flexGrow: 1 }}
      >
        <MessageBubble text="Hey! Loved your sunset photo 🌅" time="19:02" />
        <MessageBubble mine text="Thanks! Cabo da Roca, last Sunday" time="19:05" grouped="first" />
        <MessageBubble mine text="We should go together" time="19:05" grouped="last" status="delivered" showStatus />
        <TypingIndicator label="Elena is typing" />
      </Screen>
    </View>
  );
}
