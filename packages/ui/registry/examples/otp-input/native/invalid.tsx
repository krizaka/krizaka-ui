import { OtpInput, Txt } from "@krizaka/ui/native";
import { View } from "react-native";

// A refused code: the boxes in danger, the words under them, an error tick.
export default function NativeOtpInputInvalid() {
  return (
    <View style={{ gap: 8 }}>
      <OtpInput label="Verification code" value="AB12C9" mode="text" invalid />
      <Txt variant="caption" tone="danger">
        This code has expired. We sent you a new one.
      </Txt>
    </View>
  );
}
