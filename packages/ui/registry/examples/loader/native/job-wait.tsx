import { Button, Loader } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

// An Orazaka job: shown after 250 ms, never blinking, ending on a check and its words.
export default function NativeLoaderJobWait() {
  const [status, setStatus] = useState<"loading" | "success">("loading");
  return (
    <View style={{ gap: 16, width: 320 }}>
      <Loader label="Dubbing your video" value={0.42} eta="About 2 min left" status={status} successLabel="Dubbing ready" delay={0} />
      <Button label="Finish" size="sm" onPress={() => setStatus("success")} />
    </View>
  );
}
