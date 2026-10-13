import { SearchField } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

// A search bar with its Cancel button: shown while there is a query, it clears it and closes the keyboard.
export default function NativeSearchFieldCancel() {
  const [query, setQuery] = useState("acoustic");
  return (
    <View style={{ width: 340 }}>
      <SearchField label="Search creators" placeholder="Search creators" value={query} onValueChange={setQuery} clearLabel="Clear search" cancelLabel="Cancel" onCancel={() => undefined} />
    </View>
  );
}
