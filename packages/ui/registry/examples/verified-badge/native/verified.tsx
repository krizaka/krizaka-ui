import { Txt, VerifiedBadge } from "@krizaka/ui/native";
import { View } from "react-native";

// A seal beside a name, or with its words.
export default function NativeVerifiedBadgeVerified() {
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Txt variant="title">Elena Ruiz</Txt>
        <VerifiedBadge label="Verified profile" size={18} />
      </View>
      <VerifiedBadge label="Verified with a selfie" showLabel />
    </View>
  );
}
