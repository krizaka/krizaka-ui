import { ThemeProvider, Txt, useTheme } from "@krizaka/ui/native";
import { View } from "react-native";

function Screen() {
  const { theme, scheme } = useTheme();
  return (
    <View style={{ backgroundColor: theme.surface1, padding: 16, borderRadius: 12 }}>
      <Txt variant="title">Every night, a new set.</Txt>
      <Txt tone="secondary">The {scheme} theme, from the system.</Txt>
    </View>
  );
}

// Once, at the root of the app: the roles of @krizaka/tokens, the system's scheme, a product's overrides.
export default function NativeThemeProvider() {
  return (
    <ThemeProvider defaultMode="system">
      <Screen />
    </ThemeProvider>
  );
}
