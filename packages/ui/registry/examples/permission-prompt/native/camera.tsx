import { PermissionPrompt } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

// Before the system asks: why the camera, the button that asks, a way out.
export default function NativePermissionPromptCamera() {
  const [status, setStatus] = useState<"undetermined" | "granted">("undetermined");
  return (
    <View style={{ width: 340 }}>
      <PermissionPrompt
        status={status}
        title="Film your answer"
        description="The app uses the camera only while you record a challenge. Nothing is filmed before you press record."
        allowLabel="Allow the camera"
        onAllow={() => setStatus("granted")}
        dismissLabel="Not now"
        onDismiss={() => undefined}
      />
    </View>
  );
}
