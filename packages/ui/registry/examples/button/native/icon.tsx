import { Button, useTheme } from "@krizaka/ui/native";
import Svg, { Path } from "react-native-svg";

function PlusIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export default function NativeButtonIcon() {
  const { theme } = useTheme();
  return <Button variant="primary" label="New set" icon={<PlusIcon color={theme.onAccent} />} />;
}
