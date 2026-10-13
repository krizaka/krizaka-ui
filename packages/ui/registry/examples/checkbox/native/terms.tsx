import { Checkbox, Txt } from "@krizaka/ui/native";
import * as React from "react";
import { View } from "react-native";

// The two boxes of a sign-up: the second is a sentence with links, named by `label`, in error until it is ticked.
export default function NativeCheckboxTerms() {
  const [adult, setAdult] = React.useState(true);
  const [terms, setTerms] = React.useState(false);
  return (
    <View style={{ gap: 4, width: 296 }}>
      <Checkbox checked={adult} onCheckedChange={setAdult}>
        I am 18 or older
      </Checkbox>
      <Checkbox checked={terms} onCheckedChange={setTerms} label="I accept the terms and the privacy policy" error={terms ? undefined : "Accept the terms to create your account."}>
        <Txt>
          I accept the{" "}
          <Txt tone="accent" role="link" style={{ textDecorationLine: "underline" }} onPress={() => undefined}>
            terms
          </Txt>{" "}
          and the{" "}
          <Txt tone="accent" role="link" style={{ textDecorationLine: "underline" }} onPress={() => undefined}>
            privacy policy
          </Txt>
        </Txt>
      </Checkbox>
    </View>
  );
}
