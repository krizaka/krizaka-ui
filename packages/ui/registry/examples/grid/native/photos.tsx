import { Grid, Txt, useTheme } from "@krizaka/ui/native";
import { View } from "react-native";

const PLACES = ["Old Port", "Mount Royal", "Plateau", "Lachine canal", "Jean-Talon", "Atwater", "Verdun", "Mile End"];

// Photos: two columns on a compact room, three on a regular one, four on an expanded one — and never a tile narrower than 120 pt.
export default function NativeGridPhotos() {
  const { theme } = useTheme();
  return (
    <Grid columns={{ compact: 2, regular: 3, expanded: 4 }} minItemWidth={120} gap="sm" aria-label="Photos">
      {PLACES.map((place) => (
        <View key={place} style={{ aspectRatio: 1, justifyContent: "flex-end", padding: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.borderSubtle, backgroundColor: theme.surface2 }}>
          <Txt variant="caption" numberOfLines={2}>{place}</Txt>
        </View>
      ))}
    </Grid>
  );
}
