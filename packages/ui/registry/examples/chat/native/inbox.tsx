import { ConversationItem } from "@krizaka/ui/native";
import { View } from "react-native";

// The inbox: presence, the last message or “typing…”, the time, the unread count.
export default function NativeChatInbox() {
  return (
    <View style={{ width: 360 }}>
      <ConversationItem name="Elena" presence="online" presenceLabel="online" preview="typing…" typing time="19:06" unread={2} unreadLabel="2 unread" />
      <ConversationItem name="Noah" presence="away" presenceLabel="away" preview="See you Saturday then!" time="Mon" />
      <ConversationItem name="Mina" preview="You: haha same" time="Sun" />
    </View>
  );
}
