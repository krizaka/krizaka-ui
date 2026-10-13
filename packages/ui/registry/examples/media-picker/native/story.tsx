import { MediaPicker,type PickedMedia } from "@krizaka/ui/native/media-picker";
import { useState } from "react";
import { View } from "react-native";

// Up to four photos for a story: from the library or the camera, removed with the cross.
export default function NativeMediaPickerStory() {
  const [media, setMedia] = useState<PickedMedia[]>([]);
  return (
    <View style={{ width: 340 }}>
      <MediaPicker
        value={media}
        onValueChange={setMedia}
        max={4}
        labels={{
          add: "Add",
          source: "Add from",
          library: "Photo library",
          camera: "Take a photo",
          cancel: "Cancel",
          remove: (n) => `Remove photo ${n}`,
          count: (n, max) => `${n} of ${max}`,
        }}
      />
    </View>
  );
}
