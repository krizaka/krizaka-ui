import { type LngLat, LocationPicker } from "@krizaka/ui/native/map";
import * as React from "react";
import { View } from "react-native";

// A meeting point under the pin; "Near me" asks for the location only when pressed, the distance follows.
export default function NativeMapLocationPicker() {
  const [point, setPoint] = React.useState<LngLat>([-73.5673, 45.5017]);
  return (
    <View style={{ width: 340 }}>
      <LocationPicker label="Meeting point" locale="en-CA" value={point} onValueChange={setPoint} origin={[-73.5794, 45.5048]} radius={1000} />
    </View>
  );
}
