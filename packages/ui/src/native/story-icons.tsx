// Storybook only — neither exported nor built: the icons of the native stories (the apps bring their own set).
import * as React from "react";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "./theme";

function Icon({ d, color, size = 16 }: { d: string; color?: string; size?: number }) {
  const { theme } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color ?? theme.textPrimary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d={d} />
    </Svg>
  );
}

export const PlusIcon = (props: { color?: string; size?: number }) => <Icon d="M12 5v14M5 12h14" {...props} />;
export const CloseIcon = (props: { color?: string; size?: number }) => <Icon d="M18 6 6 18M6 6l12 12" {...props} />;
export const BellIcon = (props: { color?: string; size?: number }) => (
  <Icon d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" {...props} />
);
