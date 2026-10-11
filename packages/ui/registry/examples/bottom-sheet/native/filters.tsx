import { BottomSheet, Button, Switch } from "@krizaka/ui/native";
import { useState } from "react";

// Filters with a pinned footer: the main action stays above the keyboard and the home indicator.
export default function NativeBottomSheetFilters({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <Button label="Filters" onPress={() => setOpen(true)} />
      <BottomSheet open={open} onOpenChange={setOpen} title="Filter auctions" snapPoints={[0.55]} footer={<Button label="Show 24 auctions" variant="primary" onPress={() => setOpen(false)} />}>
        <Switch label="Ending soon" description="Less than an hour left" defaultChecked />
        <Switch label="Reserve met" />
        <Switch label="From creators I follow" defaultChecked />
      </BottomSheet>
    </>
  );
}
