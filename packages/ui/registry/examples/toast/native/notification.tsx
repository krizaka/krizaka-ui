import { Button, toast, Toaster, useTheme } from "@krizaka/ui/native";
import { useEffect } from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

function BellIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </Svg>
  );
}

// `id` replaces a toast already shown (a notification shown once); `onPress` opens what it is about.
export default function NativeToastNotification({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const { theme } = useTheme();
  const show = () => toast("@maya started a live auction", { id: "n-42", icon: <BellIcon color={theme.textPrimary} />, onPress: () => {} });
  useEffect(() => {
    if (!defaultOpen) return;
    toast.dismiss();
    show();
    return () => toast.dismiss();
  }, [defaultOpen]); // eslint-disable-line react-hooks/exhaustive-deps -- shown once, at load
  return (
    <View style={{ width: 360, height: 260, justifyContent: "flex-end" }}>
      <Button variant="outline" label="Show a notification" onPress={show} />
      <Toaster closeLabel="Dismiss" duration={defaultOpen ? Number.POSITIVE_INFINITY : undefined} />
    </View>
  );
}
