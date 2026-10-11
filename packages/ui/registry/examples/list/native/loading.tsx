import { EmptyState, List, ListItem } from "@krizaka/ui/native";
import { View } from "react-native";

// The first page on its way: skeleton rows the shape of the content; then the list, or its empty state.
export default function NativeListLoading() {
  return (
    <View style={{ width: 360, height: 300, flexDirection: "row", gap: 0 }}>
      <View style={{ flex: 1 }}>
        <List aria-label="Jobs" data={[]} loading loadingRows={4} keyExtractor={(j: string) => j} renderItem={(j) => <ListItem title={j} />} />
      </View>
      <View style={{ flex: 1 }}>
        <List aria-label="Jobs" data={[]} keyExtractor={(j: string) => j} renderItem={(j) => <ListItem title={j} />} empty={<EmptyState mascot="duck" title="No job yet" />} />
      </View>
    </View>
  );
}
