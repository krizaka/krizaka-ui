import { TagSetEditor, type TagSetValue } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

const ROLES = [{ key: "owner", label: "Owner" }, { key: "manager", label: "Manager" }];

// The client tags of a fictitious hair studio: presets, who writes, whether people add their own, the most.
export default function NativeTagSetEditor() {
  const [tags, setTags] = useState<TagSetValue>({
    writers: ["owner"], userTags: true, max: 30,
    presets: { default: [{ name: "Regular", marker: "blue" }, { name: "To follow up", marker: "amber" }] },
  });
  return (
    <View style={{ width: 340 }}>
      <TagSetEditor value={tags} onChange={setTags} variant="default" roles={ROLES} />
    </View>
  );
}
