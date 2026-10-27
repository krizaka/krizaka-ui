import { Columns, Txt, useTheme } from "@krizaka/ui/native";
import { View } from "react-native";

// Two columns that stack when the room cannot hold them: a form and its summary, a third and two thirds.
export default function NativeGridColumns() {
  const { theme } = useTheme();
  const box = { gap: 6, padding: 14, borderRadius: 12, backgroundColor: theme.surface1, borderWidth: 1, borderColor: theme.borderSubtle } as const;
  return (
    <Columns weights={[1, 2]} minColumnWidth={220}>
      <View style={box}>
        <Txt variant="label">Summary</Txt>
        <Txt variant="caption" tone="secondary">3 files · 42 checks</Txt>
      </View>
      <View style={box}>
        <Txt variant="label">The file</Txt>
        <Txt tone="secondary">Side by side from 2 × 220 pt plus the gap; one above the other below.</Txt>
      </View>
    </Columns>
  );
}
