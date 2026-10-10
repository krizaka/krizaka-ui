import { IconButton, useTheme } from "@krizaka/ui/native";
import Svg, { Path } from "react-native-svg";

function Icon({ d, color }: { d: string; color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d={d} />
    </Svg>
  );
}

// `label` is required: it is the accessible name of a button that shows no text.
export default function NativeButtonIconOnly() {
  const { theme } = useTheme();
  return (
    <>
      <IconButton label="Close" variant="ghost" icon={<Icon d="M18 6 6 18M6 6l12 12" color={theme.textPrimary} />} />
      <IconButton label="Add" variant="primary" shape="pill" icon={<Icon d="M12 5v14M5 12h14" color={theme.onAccent} />} />
    </>
  );
}
