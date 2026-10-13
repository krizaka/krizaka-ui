import { OtpInput, Txt } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

// The code sent by text message: the keyboard suggests it, one tap fills every box.
export default function NativeOtpInputVerify() {
  const [code, setCode] = useState("4821");
  return (
    <View style={{ gap: 12 }}>
      <Txt tone="secondary">Enter the code sent to +33 6 •• •• 42 18</Txt>
      <OtpInput label="Verification code" value={code} onValueChange={setCode} onComplete={() => undefined} />
    </View>
  );
}
