import { ActionSheet, Button } from "@krizaka/ui/native";
import { useState } from "react";

// A video's actions, the destructive one last, cancel apart.
export default function NativeActionSheetVideoActions({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <Button label="More" onPress={() => setOpen(true)} />
      <ActionSheet
        open={open}
        onOpenChange={setOpen}
        title="Sunset session"
        cancelLabel="Cancel"
        actions={[
          { label: "Share", onPress: () => undefined },
          { label: "Start an auction", onPress: () => undefined },
          { label: "Edit details", onPress: () => undefined },
          { label: "Delete", destructive: true, onPress: () => undefined },
        ]}
      />
    </>
  );
}
