// Jest and Storybook stand-in for @maplibre/maplibre-react-native (its native views exist on iOS and Android only): the
// map's paper in the theme's colours with the markers placed by the same projection (Web Mercator), so a native story
// shows where things stand; the circles and clusters are drawn by MapLibre Native in an app, not here. A LocationManager
// a test drives.
import * as React from "react";
import { Pressable, View } from "react-native";

import { project } from "../../map/geo";
import { useTheme } from "../theme";

type Props = { children?: React.ReactNode; [key: string]: unknown };
const View2D = React.createContext({ center: [0, 0] as readonly [number, number], zoom: 12, width: 0, height: 0 });

export function Map({ children, style: _style, ...props }: Props) {
  const { theme } = useTheme();
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const camera = React.Children.toArray(children).find((c) => React.isValidElement(c) && c.type === Camera) as React.ReactElement<{ center?: [number, number]; zoom?: number }> | undefined;
  const view = { center: camera?.props.center ?? ([0, 0] as [number, number]), zoom: camera?.props.zoom ?? 12, ...size };
  return (
    <View
      testID="maplibre-map"
      {...(props as object)}
      onLayout={(e) => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
      style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: theme.surface2 }}
    >
      <View2D.Provider value={view}>{children}</View2D.Provider>
    </View>
  );
}
export const Camera = React.forwardRef<unknown, Props>(function Camera(_props, _ref) {
  return null;
});
export function Marker({ children, lngLat }: Props) {
  const { center, zoom, width, height } = React.useContext(View2D);
  const [cx, cy] = project(center, zoom);
  const [x, y] = project(lngLat as [number, number], zoom);
  return (
    <View testID={`maplibre-marker-${String(lngLat)}`} style={{ position: "absolute", left: width / 2 + x - cx, top: height / 2 + y - cy, transform: [{ translateX: -22 }, { translateY: -22 }] }}>
      {children}
    </View>
  );
}
export function GeoJSONSource({ children, onPress, data, ...props }: Props) {
  return (
    <Pressable testID={`maplibre-source-${String(props.id)}`} accessible={false} onPress={() => (onPress as (e: unknown) => void)?.({ nativeEvent: { features: (data as { features?: unknown[] })?.features?.slice(0, 1) ?? [] } })}>
      {children}
    </Pressable>
  );
}
export function Layer(props: Props) {
  return <View testID={`maplibre-layer-${String(props.id)}`} />;
}
export const LocationManager = {
  permission: true,
  position: { coords: { longitude: -73.58, latitude: 45.52 } } as { coords: { longitude: number; latitude: number } } | undefined,
  requestPermissions: async () => LocationManager.permission,
  getCurrentPosition: async () => LocationManager.position,
};
export type CameraRef = unknown;
