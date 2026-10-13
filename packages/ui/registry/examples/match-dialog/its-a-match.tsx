"use client";

import { Button } from "@krizaka/ui/button";
import { MatchDialog } from "@krizaka/ui/match-dialog";
import { useState } from "react";

// Two people liked each other: the next step is a message.
export default function MatchDialogItsAMatch({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Like Elena</Button>
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
