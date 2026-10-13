import { Button, NumberTicker, Txt } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

// A wallet's balance: it climbs at first, then rolls on every tip received — and says it.
export default function NativeNumberTickerBalance() {
  const [cents, setCents] = useState(12_840);
  return (
    <View style={{ gap: 8, alignItems: "flex-start" }}>
      <Txt variant="caption" tone="secondary">
        Balance
      </Txt>
      <NumberTicker value={cents / 100} locale="en-US" format={{ style: "currency", currency: "USD" }} trigger="change" announce />
      <Button label="Receive a $5 tip" size="sm" onPress={() => setCents((c) => c + 500)} />
    </View>
  );
}
