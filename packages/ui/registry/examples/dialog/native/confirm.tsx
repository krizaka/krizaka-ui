import { AlertDialog, Button } from "@krizaka/ui/native";
import { useState } from "react";

// Before what cannot be undone: cancel or confirm, nothing else.
export default function NativeDialogConfirm({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <Button label="Delete the video" variant="danger" onPress={() => setOpen(true)} />
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete “Sunset session”?"
        description="Its views, tips and comments go with it. This cannot be undone."
        cancelLabel="Keep it"
        confirmLabel="Delete"
        destructive
        onConfirm={() => undefined}
      />
    </>
  );
}
