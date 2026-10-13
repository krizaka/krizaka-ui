import { Combobox } from "@krizaka/ui/native";
import * as React from "react";
import { View } from "react-native";

const CITIES = ["Montréal", "Québec", "Laval", "Gatineau", "Sherbrooke", "Trois-Rivières"].map((c) => ({ value: c.toLowerCase(), label: c }));

// A choice among many, searched in a sheet: what is typed filters the options.
export default function NativeComboboxSearch() {
  const [city, setCity] = React.useState<string>("montréal");
  return (
    <View style={{ width: 300 }}>
      <Combobox label="City" placeholder="Choose a city" options={CITIES} value={city} onValueChange={(v) => setCity(String(v))} />
    </View>
  );
}
