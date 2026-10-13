import { Button, MatchDialog } from "@krizaka/ui/native";
import { useState } from "react";

// Two people liked each other: the next step is a message.
export default function NativeMatchDialogItsAMatch({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <Button label="Like Elena" onPress={() => setOpen(true)} />
      <MatchDialog
        open={open}
        onOpenChange={setOpen}
        title="It's a match!"
        description="You and Elena liked each other."
        people={[{ name: "You" }, { name: "Elena" }]}
        primaryLabel="Send a message"
        onPrimary={() => undefined}
        secondaryLabel="Keep swiping"
      />
    </>
  );
}
