import { ListDetail, Txt, useTheme } from "@krizaka/ui/native";
import { useState } from "react";
import { Pressable, View } from "react-native";

const MESSAGES = [
  { id: "1", from: "Camille", subject: "Lease for 12 rue Fleury", body: "I attached the signed lease. Can you check the page 4 stamp?" },
  { id: "2", from: "Noor", subject: "Payslips, March to May", body: "Here are the three payslips you asked for." },
  { id: "3", from: "Ada", subject: "Thanks", body: "Verified in a minute, thank you." },
];

// TEMPLATE — List to detail: one pane at a time on a phone (the list, then the message with the way back), both side by
// side when the room holds them — the room decides, so a rotation or a split view just works.
export default function NativeListDetailInbox() {
  const { theme } = useTheme();
  const [open, setOpen] = useState<string | null>(null);
  const message = MESSAGES.find((m) => m.id === open);
  return (
    <View style={{ width: 360, height: 640 }}>
      <ListDetail
        listTitle="Messages"
        list={MESSAGES.map((m) => (
          <Pressable key={m.id} role="button" onPress={() => setOpen(m.id)} accessibilityLabel={`${m.from}, ${m.subject}`} style={{ padding: 16, gap: 2, borderBottomWidth: 1, borderBottomColor: theme.borderSubtle }}>
            <Txt variant="label">{m.from}</Txt>
            <Txt tone="secondary" numberOfLines={1}>{m.subject}</Txt>
          </Pressable>
        ))}
        detailTitle={message?.from}
        detail={message ? <Txt variant="body">{message.body}</Txt> : undefined}
        empty="Select a message"
        backLabel="Messages"
        onBack={() => setOpen(null)}
      />
    </View>
  );
}
