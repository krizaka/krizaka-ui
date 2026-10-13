import { Button, Sheet, Txt } from "@krizaka/ui/native";
import * as React from "react";
import { View } from "react-native";

// A bottom sheet: it rises over the dimmed screen, the scrim or the back button closes it.
export default function NativeDialogSheet({ defaultOpen }: { defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(Boolean(defaultOpen));
  return (
    <View>
      <Button label="Show the pick-up point" onPress={() => setOpen(true)} />
      <Sheet open={open} onOpenChange={setOpen} title="Café Olimpico">
        <Txt tone="secondary">124 Rue Saint-Viateur O, Montréal · 350 m away</Txt>
        <Txt>Open until 10 pm. Ask for the order under your name at the counter.</Txt>
        <Button label="Get directions" variant="primary" onPress={() => setOpen(false)} />
      </Sheet>
    </View>
  );
}
