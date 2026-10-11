import { Avatar, BottomSheet, Button, ListItem } from "@krizaka/ui/native";
import { useState } from "react";

const COMMENTS = [
  { id: "1", name: "Elena", text: "That last chorus 🔥", when: "2 min" },
  { id: "2", name: "Alex", text: "Do the acoustic version next!", when: "5 min" },
  { id: "3", name: "Mina", text: "Tipped — see you at the auction.", when: "12 min" },
];

// Comments over the video: half the screen first, drag up to read more, down to close.
export default function NativeBottomSheetComments({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <Button label="Comments" onPress={() => setOpen(true)} />
      <BottomSheet open={open} onOpenChange={setOpen} title="Comments · 128" snapPoints={[0.5, 0.9]} closeLabel="Close">
        {COMMENTS.map((c) => (
          <ListItem key={c.id} leading={<Avatar alt={c.name} size="sm" />} title={c.name} description={c.text} trailing={c.when} density="compact" />
        ))}
      </BottomSheet>
    </>
  );
}
