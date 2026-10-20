import { ComposerMeta, MessageBubble, MessageComposer } from "@krizaka/ui/native";
import { Markdown } from "@krizaka/ui/native/markdown";
import { useState } from "react";
import { View } from "react-native";

// An assistant's answer: Markdown in the same bubble as any message, and above the composer the model in use and, only
// because the app computed it true, a privacy line.
export default function NativeChatAssistant() {
  const [draft, setDraft] = useState("");
  return (
    <View style={{ width: 360, gap: 4 }}>
      <View style={{ padding: 12, gap: 4 }}>
        <MessageBubble mine text="Summarise my lease" time="19:05" />
        <MessageBubble time="19:05" text="Summary of the lease">
          <Markdown>{"**Rent** is $1,150 a month.\n\n- Term: 12 months\n- Deposit: not allowed in Québec"}</Markdown>
        </MessageBubble>
      </View>
      <MessageComposer
        value={draft}
        onValueChange={setDraft}
        onSend={() => setDraft("")}
        placeholder="Message"
        sendLabel="Send"
        meta={<ComposerMeta model={{ label: "Local model", onPress: () => {}, accessibilityLabel: "Model: Local model" }} status="0 bytes left your network" />}
      />
    </View>
  );
}
