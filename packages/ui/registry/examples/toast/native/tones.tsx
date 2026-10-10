import { Button, toast, Toaster } from "@krizaka/ui/native";
import { useEffect } from "react";
import { View } from "react-native";

const show = () => {
  toast("Draft saved", { description: "Autosaved a moment ago." });
  toast.success("Payment received", { description: "€12.00 from @maya." });
  toast.error("Upload failed", { description: "The connection dropped at 64 %.", action: { label: "Retry", onPress: () => {} } });
};

// One `Toaster` at the root of the app (`offset` = the safe-area inset); `toast()` from anywhere.
export default function NativeToastTones({ defaultOpen = false }: { defaultOpen?: boolean }) {
  useEffect(() => {
    if (!defaultOpen) return;
    toast.dismiss();
    show();
    return () => toast.dismiss();
  }, [defaultOpen]);
  return (
    <View style={{ width: 360, height: 260, justifyContent: "flex-end" }}>
      <Button variant="outline" label="Show the toasts" onPress={show} />
      <Toaster closeLabel="Dismiss" duration={defaultOpen ? Number.POSITIVE_INFINITY : undefined} />
    </View>
  );
}
