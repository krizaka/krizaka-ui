import { Button } from "@krizaka/ui/native";
import { List } from "@krizaka/ui/native/list";
import { View } from "react-native";

const NONE: { id: string }[] = [];

// While the first page loads: skeleton rows. Nothing yet: the empty state and what to do next.
export default function NativeListStates() {
  return (
    <View style={{ gap: 24, width: "100%" }}>
      <List label="Messages" data={NONE} keyExtractor={(m) => m.id} renderItem={() => null} loading loadingRows={3} />
      <List
        label="Messages"
        data={NONE}
        keyExtractor={(m) => m.id}
        renderItem={() => null}
        empty={{ title: "No message yet", description: "Say hello to a creator you follow.", action: <Button label="Find creators" size="sm" /> }}
      />
    </View>
  );
}
