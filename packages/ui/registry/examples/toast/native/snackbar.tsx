import { Button, toast, Toaster } from "@krizaka/ui/native";
import { useEffect } from "react";
import { View } from "react-native";

const archive = () => toast("Conversation archived", { id: "archived", action: { label: "Undo", onPress: () => undefined } });

// A snackbar: at the bottom, above the tab bar (`offset`), one action; swipe it away, a tick for its tone.
export default function NativeToastSnackbar({ defaultOpen = false }: { defaultOpen?: boolean }) {
  useEffect(() => {
    if (!defaultOpen) return;
    toast.dismiss();
    archive();
    return () => toast.dismiss();
  }, [defaultOpen]);
  return (
    <View style={{ width: 360, height: 200 }}>
      <Button variant="outline" label="Archive" onPress={archive} />
      <Toaster closeLabel="Dismiss" position="bottom" offset={16} duration={defaultOpen ? Number.POSITIVE_INFINITY : 5000} />
    </View>
  );
}
