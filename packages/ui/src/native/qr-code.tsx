// QrCode on React Native: the same encoder as the web, drawn with react-native-svg as one path. Dark modules on a
// light tile whatever the theme; an image named by `label`. The app owns the clipboard: `onCopy` receives the text.
import * as React from "react";
import { View, type ViewProps } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

import { encodeQr, type QrLevel, qrPath } from "../qr-code/encode";
import { Button } from "./button";
import { useTheme } from "./theme";

const TILE = "#ffffff";
const MODULE = "#0b0f19";

export type QrCodeProps = Omit<ViewProps, "children"> & {
  /** The text to encode. Encoded on the device; never sent anywhere. */
  value: string;
  /** What the code is, for the screen reader, passed translated. */
  label: string;
  /** The side of the tile, in points, quiet zone included. Default 176. */
  size?: number;
  /** The quiet zone, in modules. Default 4, never less than 2. */
  quietZone?: number;
  /** L · M (default) · Q · H. */
  level?: QrLevel;
  /** The copy action's words, translated. Without it there is no button. */
  copyLabel?: string;
  /** Called with the text when the person asks to copy: the app puts it on the clipboard and says so. */
  onCopy?: (value: string) => void;
};

/** A QR code from a text: dark modules on a light tile, a quiet zone, an accessible name, an optional copy button. */
export function QrCode({ value, label, size = 176, quietZone = 4, level = "M", copyLabel, onCopy, style, ...props }: QrCodeProps) {
  const { theme } = useTheme();
  const quiet = Math.max(2, Math.round(quietZone));
  const { modules, path } = React.useMemo(() => {
    const matrix = encodeQr(value, level);
    return { modules: matrix.length + quiet * 2, path: qrPath(matrix, quiet) };
  }, [value, level, quiet]);

  return (
    <View {...props} style={[{ alignItems: "flex-start", rowGap: 12 }, style]}>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={label}
        style={{ width: size, height: size, borderRadius: 8, overflow: "hidden", borderWidth: 1, borderColor: theme.borderDefault }}
      >
        <Svg width={size} height={size} viewBox={`0 0 ${modules} ${modules}`}>
          <Rect width={modules} height={modules} fill={TILE} />
          <Path d={path} fill={MODULE} />
        </Svg>
      </View>
      {copyLabel ? <Button label={copyLabel} size="sm" onPress={() => onCopy?.(value)} /> : null}
    </View>
  );
}
