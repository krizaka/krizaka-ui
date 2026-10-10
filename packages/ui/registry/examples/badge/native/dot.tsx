import { Badge } from "@krizaka/ui/native";
import { View } from "react-native";

// `pulse` stops under reduced motion.
export default function NativeBadgeDot() {
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Badge tone="danger" dot pulse>
        Live
      </Badge>
      <Badge tone="danger" size="md" dot pulse>
        Live
      </Badge>
    </View>
  );
}
