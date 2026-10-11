import { Button, EmptyState } from "@krizaka/ui/native";
import { View } from "react-native";

// A bird says what is empty: the pigeon has nothing to deliver yet.
export default function NativeEmptyStateMascot() {
  return (
    <View style={{ width: 320 }}>
      <EmptyState mascot="pigeon" title="No messages yet" description="Tip a creator or answer a challenge to start a conversation." action={<Button variant="primary" label="Find creators" />} />
    </View>
  );
}
