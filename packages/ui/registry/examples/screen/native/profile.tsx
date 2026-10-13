import { Avatar, Button, Chip, Screen, Txt, VerifiedBadge } from "@krizaka/ui/native";
import { View } from "react-native";

// A profile: the photo with its story ring, the name and seal, the facts, the interests, the actions.
export default function NativeScreenProfile() {
  return (
    <View style={{ width: 360, height: 640 }}>
      <Screen footer={<View style={{ flexDirection: "row", gap: 8, padding: 16 }}><Button label="Edit profile" style={{ flex: 1 }} /><Button label="Preview" variant="outline" style={{ flex: 1 }} /></View>}>
        <View style={{ alignItems: "center", gap: 6 }}>
          <Avatar src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAIAAACtAwlQAAABaklEQVR42mWMy24UQQxF7arqlwLhIbJhwZZf5I/4IISEBIsIRSKTMOmZnp7uqrJ9zYIeIeCsrqzjw+vHDwYCCM6wbfy5gABKatsysJqLuoHciZ2dGE4ApSrbnyidVn06lVyQUrweur5pmAJAqVQGSEGnRb79mD5/H6dzuRq6929fv7t5MTSd+6VUK3Zj/XQ7frkblyJ926jwkIab6yZw3Eq58rzaz6nMq1RVA+3nMmd73nMMfCkJiRBA7u5O7g6QCFfhyLyVRJg89U3bxKiGJsQ+te6pCge+lETYPT3rujalotqkNLSdexRhJk6lshjOWXeH+WE6Z1HAi+p+Pr+czuxtG0PKlZesd+P09f5xd5iKqrlX1cfpGCiqhDdXr9Ja8DSX24f9/eG4VDGAiAzIIrvpwJ6C96FUXrId15Ivxm8MKCpzKUvRUCpXJTOHO/2Nu6uhqocqLMr4V9iAkxoHMzZjgP7XnMjBZvQLMEROG5iV3IMAAAAASUVORK5CYII=" alt="Elena" size={112} ring="story" />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Txt variant="title">Elena, 29</Txt>
            <VerifiedBadge label="Verified" size={18} />
          </View>
          <Txt tone="secondary">Lisbon · Sound engineer</Txt>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 32 }}>
          <Txt variant="label">128 likes</Txt>
          <Txt variant="label">14 matches</Txt>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {["Music", "Surf", "Travel", "Vinyl"].map((t) => <Chip key={t}>{t}</Chip>)}
        </View>
      </Screen>
    </View>
  );
}
