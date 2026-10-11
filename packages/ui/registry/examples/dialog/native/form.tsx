import { Button, Dialog, Field, Input } from "@krizaka/ui/native";
import { useState } from "react";

// A short form in a dialog: rename a playlist.
export default function NativeDialogForm({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [name, setName] = useState("Summer covers");
  return (
    <>
      <Button label="Rename" onPress={() => setOpen(true)} />
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Rename the playlist"
        closeLabel="Close"
        actions={<Button label="Save" variant="primary" onPress={() => setOpen(false)} />}
      >
        <Field label="Name" hint="Up to 60 characters">
          <Input value={name} onChangeText={setName} maxLength={60} />
        </Field>
      </Dialog>
    </>
  );
}
