"use client";

import { Button } from "@krizaka/ui/button";
import { Toaster, undoToast } from "@krizaka/ui/toast";
import { useEffect } from "react";

const toasterId = "undo";
// Archive now, make it final later: the hairline counts the time left to undo, and pauses while hovered.
const archive = () =>
  undoToast("Conversation archived", {
    toasterId,
    description: "“Pricing questions” moved to the archive.",
    undoLabel: "Undo",
    onUndo: () => {},
    onCommit: () => {},
  });

export default function ToastUndo({ defaultOpen = false }: { defaultOpen?: boolean }) {
  useEffect(() => {
    if (defaultOpen) archive();
  }, [defaultOpen]);
  return (
    <>
      <Toaster id={toasterId} label="Notifications" closeLabel="Dismiss" />
      <Button variant="outline" onClick={archive}>
        Archive
      </Button>
    </>
  );
}
