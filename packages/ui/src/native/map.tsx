/// <reference types="geojson" />
// React Native: the maps of `@krizaka/ui/map` on MapLibre Native (`@maplibre/maplibre-react-native`, an optional peer
// installed only by the apps that show a map) — the same style generated from the tokens, the same Protomaps tiles on the
// Krizaka CDN (MapLibre Native reads `pmtiles://` as it is), no API key. `Map`, `Marker`, `Cluster`, `UserPosition`,
// `RadiusCircle`, `LocationPicker`; details of a place in a `Sheet` (`@krizaka/ui/native`).
import { type BrandId, Txt, useTheme } from "@krizaka/ui/native";
import {
  Camera,
  type CameraRef,
  GeoJSONSource,
  Layer,
  LocationManager,
  Map as MapView,
  Marker as MapMarker,
} from "@maplibre/maplibre-react-native";
import * as React from "react";
import { Animated, Pressable, type StyleProp, StyleSheet, Text, View, type ViewStyle } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { MAP_ATTRIBUTION } from "../map/assets";
import { circlePolygon, distanceMeters, formatDistance, type LngLat } from "../map/geo";
import { mapPalette, type MapRegion,mapStyle } from "../map/style";

type Ctx = { palette: ReturnType<typeof mapPalette>; reduce: boolean; places: { add: (id: string, text: string) => void; remove: (id: string) => void } };
const MapContext = React.createContext<Ctx | null>(null);
const useMapContext = () => {
  const ctx = React.useContext(MapContext);
  if (!ctx) throw new Error("inside a <Map> only");
  return ctx;
};

export type MapProps = {
  /** The map's accessible name ("Pick-up points near you"), passed translated; the places follow it. */
  label: string;
  /** Where the map looks: longitude, latitude. */
  center: LngLat;
  /** The zoom (0 the world, 12 a city, 16 a street). Default 12. */
  zoom?: number;
  /** The product whose accent the map carries. Default `krizaka`. */
  brand?: BrandId;
  /** The language of the labels (`fr`, `en`). Default `en`. */
  lang?: string;
  /** The detailed region and the world's low zooms (PMTiles); defaults: our extracts. */
  region?: MapRegion | null;
  world?: MapRegion | null;
  /** Moves with the hand (default). */
  interactive?: boolean;
  /** Called when the camera rests: its centre and zoom. */
  onMoveEnd?: (view: { center: LngLat; zoom: number }) => void;
  /** Called with the position pressed on the map (not on a marker). */
  onPress?: (position: LngLat) => void;
  /** Markers, circles, clusters, the person's position. */
  children?: React.ReactNode;
  /** Styles merged last (its height). */
  style?: StyleProp<ViewStyle>;
};

/** A map: MapLibre Native over our Protomaps tiles, styled from the tokens in the app's scheme; its places in its name. */
export function Map({ label, center, zoom = 12, brand, lang, region, world, interactive = true, onMoveEnd, onPress, children, style }: MapProps) {
  const { scheme, theme, radius, motion } = useTheme();
  const reduce = motion.duration.base === 0;
  const camera = React.useRef<CameraRef>(null);
  const [places, setPlaces] = React.useState<Record<string, string>>({});
  const registry = React.useMemo(
    () => ({
      add: (id: string, text: string) => setPlaces((p) => (p[id] === text ? p : { ...p, [id]: text })),
      remove: (id: string) =>
        setPlaces((p) => {
          const { [id]: _gone, ...rest } = p;
          return rest;
        }),
    }),
    [],
  );
  const styleJson = React.useMemo(() => mapStyle({ scheme, brand, lang, ...(region !== undefined ? { region } : {}), ...(world !== undefined ? { world } : {}) }), [scheme, brand, lang, region, world]);
  const palette = React.useMemo(() => mapPalette(scheme, brand), [scheme, brand]);
  const listed = Object.values(places);
  const ctx = React.useMemo(() => ({ palette, reduce, places: registry }), [palette, reduce, registry]);
  return (
    <MapContext.Provider value={ctx}>
      <View style={[styles.root, { borderRadius: radius.xl, borderColor: theme.borderDefault, backgroundColor: theme.surface2 }, style]}>
        <MapView
          style={StyleSheet.absoluteFill}
          mapStyle={styleJson as never}
          aria-label={listed.length ? `${label}: ${listed.join(", ")}` : label}
          dragPan={interactive}
          touchZoom={interactive}
          doubleTapZoom={interactive}
          touchRotate={false}
          touchPitch={false}
          attribution={false}
          logo={false}
          compass={false}
          onRegionDidChange={(e) => onMoveEnd?.({ center: e.nativeEvent.center as unknown as LngLat, zoom: e.nativeEvent.zoom })}
          onPress={(e) => {
            const coords = (e.nativeEvent as unknown as { lngLat?: LngLat }).lngLat;
            if (coords) onPress?.(coords);
          }}
        >
          <Camera ref={camera} center={[...center] as [number, number]} zoom={zoom} duration={reduce ? 0 : 600} easing={reduce ? undefined : "ease"} />
          {children}
        </MapView>
        <View style={[styles.attribution, { backgroundColor: theme.surface1, borderRadius: radius.sm }]}>
          <Text style={[styles.attributionText, { color: theme.textSecondary }]}>
            {MAP_ATTRIBUTION.protomaps} · {MAP_ATTRIBUTION.osm}
          </Text>
        </View>
      </View>
    </MapContext.Provider>
  );
}

function usePlace(label: string) {
  const { places } = useMapContext();
  const id = React.useId();
  React.useEffect(() => {
    places.add(id, label);
    return () => places.remove(id);
  }, [id, label, places]);
  return id;
}

export type MarkerProps = {
  /** Where it stands. */
  position: LngLat;
  /** Its words: the place's name (read in the map's name and as the button's name). */
  label: string;
  /** Pressing it: details in a `Sheet`. */
  onPress?: () => void;
  /** The chosen one: larger, its label above it. */
  selected?: boolean;
  /** What it draws instead of the accent dot. */
  children?: React.ReactNode;
};

/** A place: an accent dot (or your view) that is a button when it does something. */
export function Marker({ position, label, onPress, selected, children }: MarkerProps) {
  const { palette } = useMapContext();
  const { theme, radius, haptic } = useTheme();
  const id = usePlace(label);
  return (
    <MapMarker id={id} lngLat={[...position] as [number, number]} anchor="center" selected={selected}>
      <Pressable
        role={onPress ? "button" : undefined}
        aria-label={label}
        aria-selected={selected}
        disabled={!onPress}
        hitSlop={12}
        onPress={() => {
          haptic("selection");
          onPress?.();
        }}
        style={styles.markerSlot}
      >
        {selected ? (
          <View style={[styles.markerLabel, { backgroundColor: theme.surface1, borderColor: theme.borderDefault, borderRadius: radius.md }]}>
            <Txt variant="label">{label}</Txt>
          </View>
        ) : null}
        {children ?? <View style={[styles.dot, { backgroundColor: palette.accent, borderColor: palette.onAccent, transform: [{ scale: selected ? 1.3 : 1 }] }]} />}
      </Pressable>
    </MapMarker>
  );
}

export type UserPositionProps = {
  /** Where the person is. */
  position: LngLat;
  /** Its words ("You are here"). */
  label: string;
  /** The accuracy in metres: a soft disc. */
  accuracy?: number;
};

/** The person's position: a dot that pulses (still when the system reduces motion). */
export function UserPosition({ position, label, accuracy }: UserPositionProps) {
  const { palette, reduce } = useMapContext();
  const id = usePlace(label);
  const [pulse] = React.useState(() => new Animated.Value(0));
  React.useEffect(() => {
    if (reduce) return;
    const loop = Animated.loop(Animated.timing(pulse, { toValue: 1, duration: 2000, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [pulse, reduce]);
  return (
    <>
      {accuracy ? <RadiusCircle center={position} radius={accuracy} tone="soft" /> : null}
      <MapMarker id={id} lngLat={[...position] as [number, number]} anchor="center">
        <View aria-label={label} accessible style={styles.userSlot}>
          <Animated.View style={[styles.userHalo, { backgroundColor: palette.accent, opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0] }), transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 3] }) }] }]} />
          <View style={[styles.user, { backgroundColor: palette.accent, borderColor: palette.halo }]} />
        </View>
      </MapMarker>
    </>
  );
}

export type RadiusCircleProps = {
  /** Its centre. */
  center: LngLat;
  /** Its radius in metres. */
  radius: number;
  /** `accent` (a zone) or `soft` (an accuracy). */
  tone?: "accent" | "soft";
};

/** A circle on the ground: a delivery zone, a search radius. */
export function RadiusCircle({ center, radius, tone = "accent" }: RadiusCircleProps) {
  const { palette } = useMapContext();
  const id = `kz-circle-${React.useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const data = React.useMemo(() => circlePolygon(center, radius), [center, radius]);
  return (
    <GeoJSONSource id={id} data={data}>
      <Layer type="fill" id={`${id}-fill`} paint={{ "fill-color": palette.accent, "fill-opacity": tone === "soft" ? 0.1 : 0.14 }} />
      <Layer type="line" id={`${id}-line`} paint={{ "line-color": palette.accent, "line-width": tone === "soft" ? 1 : 2, "line-opacity": tone === "soft" ? 0.4 : 0.9 }} />
    </GeoJSONSource>
  );
}

export type ClusterPoint = { id: string; position: LngLat; label: string };

export type ClusterProps = {
  /** The points: many of them. */
  points: readonly ClusterPoint[];
  /** Pressing a single point (details in a `Sheet`). */
  onPointPress?: (point: ClusterPoint) => void;
  /** The radius, in points, within which points group. Default 48. */
  radius?: number;
};

/** Many points grouped while they are close: a disc with the count; each point is part of the map's name. */
export function Cluster({ points, onPointPress, radius = 48 }: ClusterProps) {
  const { palette, places } = useMapContext();
  const id = `kz-cluster-${React.useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  React.useEffect(() => {
    for (const p of points) places.add(`${id}-${p.id}`, p.label);
    return () => points.forEach((p) => places.remove(`${id}-${p.id}`));
  }, [points, places, id]);
  const data = React.useMemo<GeoJSON.FeatureCollection>(
    () => ({ type: "FeatureCollection", features: points.map((p) => ({ type: "Feature", properties: { id: p.id, label: p.label }, geometry: { type: "Point", coordinates: [...p.position] } })) }),
    [points],
  );
  return (
    <GeoJSONSource
      id={id}
      data={data}
      cluster
      clusterRadius={radius}
      clusterMaxZoom={15}
      onPress={(e: unknown) => {
        const feature = (e as { nativeEvent?: { features?: GeoJSON.Feature[] } }).nativeEvent?.features?.[0];
        const pid = feature?.properties?.id;
        const point = points.find((p) => p.id === pid);
        if (point) onPointPress?.(point);
      }}
    >
      <Layer type="circle" id={`${id}-groups`} filter={["has", "point_count"]} paint={{ "circle-color": palette.accent, "circle-radius": ["step", ["get", "point_count"], 16, 10, 20, 50, 26], "circle-stroke-width": 3, "circle-stroke-color": palette.halo }} />
      <Layer type="symbol" id={`${id}-count`} filter={["has", "point_count"]} layout={{ "text-field": ["get", "point_count_abbreviated"], "text-font": ["Noto Sans Medium"], "text-size": 13 }} paint={{ "text-color": palette.onAccent }} />
      <Layer type="circle" id={`${id}-points`} filter={["!", ["has", "point_count"]]} paint={{ "circle-color": palette.accent, "circle-radius": 7, "circle-stroke-width": 2.5, "circle-stroke-color": palette.halo }} />
    </GeoJSONSource>
  );
}

export type LocationPickerLabels = {
  /** "Near me". */
  nearMe: string;
  /** "Finding you…". */
  locating: string;
  /** "Location is off for this app. Move the map instead." */
  denied: string;
  /** "We could not find you. Move the map instead." */
  unavailable: string;
  /** "You are here". */
  you: string;
  /** The distance chip ("1.2 km from you"). */
  distance: (distance: string) => string;
};

const pickerLabels: LocationPickerLabels = {
  nearMe: "Near me",
  locating: "Finding you…",
  denied: "Location is off for this app. Move the map instead.",
  unavailable: "We could not find you. Move the map instead.",
  you: "You are here",
  distance: (d) => `${d} from you`,
};

export type LocationPickerProps = Pick<MapProps, "brand" | "lang" | "region" | "world" | "style"> & {
  /** The picker's accessible name ("Meeting point"). */
  label: string;
  /** The chosen position (the centre of the map). */
  value: LngLat;
  /** Called when the map rests on a new position. */
  onValueChange: (value: LngLat) => void;
  /** The BCP 47 locale of the distance. */
  locale: string;
  /** The zoom. Default 14. */
  zoom?: number;
  /** A radius in metres around the chosen position. */
  radius?: number;
  /** Where the person is, when already known. */
  origin?: LngLat | null;
  /** The words, passed translated. */
  labels?: Partial<LocationPickerLabels>;
};

/** A position picked by moving the map under a pin; its distance from the person; "near me" asks for the location only when pressed. */
export function LocationPicker({ label, value, onValueChange, locale, zoom = 14, radius: zone, origin: originProp = null, labels: given, style, ...map }: LocationPickerProps) {
  const labels = { ...pickerLabels, ...given };
  const { theme, radius, haptic } = useTheme();
  const [origin, setOrigin] = React.useState<LngLat | null>(originProp);
  const [camera, setCamera] = React.useState<LngLat>(value);
  const [status, setStatus] = React.useState<"idle" | "locating" | "denied" | "unavailable">("idle");
  const nearMe = async () => {
    setStatus("locating");
    try {
      if (!(await LocationManager.requestPermissions())) return setStatus("denied");
      const p = await LocationManager.getCurrentPosition();
      if (!p) return setStatus("unavailable");
      const here: LngLat = [p.coords.longitude, p.coords.latitude];
      haptic("success");
      setOrigin(here);
      setCamera(here);
      onValueChange(here);
      setStatus("idle");
    } catch {
      setStatus("unavailable");
    }
  };
  const message = status === "locating" ? labels.locating : status === "denied" ? labels.denied : status === "unavailable" ? labels.unavailable : null;
  return (
    <View role="group" aria-label={label} style={[styles.picker, style]}>
      <View style={styles.pickerFrame}>
        <Map {...map} label={label} center={camera} zoom={zoom} onMoveEnd={(v) => onValueChange(v.center)} style={StyleSheet.absoluteFill}>
          {zone ? <RadiusCircle center={value} radius={zone} /> : null}
          {origin ? <UserPosition position={origin} label={labels.you} /> : null}
        </Map>
        <View pointerEvents="none" style={styles.pin}>
          <Svg width={30} height={40} viewBox="0 0 24 32" aria-hidden>
            <Path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.4 12 32 12 32s12-11.6 12-20.3C24 5.2 18.6 0 12 0Z" fill={theme.accent} />
            <Circle cx={12} cy={11.5} r={4.5} fill={theme.onAccent} />
          </Svg>
        </View>
        <View style={styles.bar} pointerEvents="box-none">
          {origin ? (
            <View style={[styles.chip, { backgroundColor: theme.surface1, borderColor: theme.borderDefault, borderRadius: radius.full }]}>
              <Txt variant="label" aria-live="polite">
                {labels.distance(formatDistance(distanceMeters(origin, value), locale))}
              </Txt>
            </View>
          ) : (
            <View />
          )}
          <Pressable role="button" aria-label={labels.nearMe} disabled={status === "locating"} onPress={() => void nearMe()} style={[styles.near, { backgroundColor: theme.surface1, borderColor: theme.borderDefault, borderRadius: radius.full }]}>
            <Txt variant="label">{status === "locating" ? labels.locating : labels.nearMe}</Txt>
          </Pressable>
        </View>
      </View>
      {message && status !== "locating" ? (
        <Txt variant="caption" tone="danger" role="alert">
          {message}
        </Txt>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { height: 280, overflow: "hidden", borderWidth: StyleSheet.hairlineWidth, alignSelf: "stretch" },
  attribution: { position: "absolute", right: 6, bottom: 6, paddingHorizontal: 6, paddingVertical: 2, opacity: 0.9 },
  attributionText: { fontSize: 10 },
  markerSlot: { alignItems: "center", justifyContent: "center", minWidth: 44, minHeight: 44 },
  markerLabel: { position: "absolute", bottom: 40, paddingHorizontal: 8, paddingVertical: 4, borderWidth: StyleSheet.hairlineWidth },
  dot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2.5 },
  userSlot: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  userHalo: { position: "absolute", width: 16, height: 16, borderRadius: 8 },
  user: { width: 16, height: 16, borderRadius: 8, borderWidth: 3 },
  picker: { gap: 6, alignSelf: "stretch" },
  pickerFrame: { height: 320 },
  pin: { position: "absolute", left: "50%", top: "50%", marginLeft: -15, marginTop: -40 },
  bar: { position: "absolute", left: 12, right: 12, bottom: 28, flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: StyleSheet.hairlineWidth },
  near: { minHeight: 44, paddingHorizontal: 16, justifyContent: "center", borderWidth: StyleSheet.hairlineWidth },
});

export { MAP_ATTRIBUTION, MAP_GLYPHS, MAP_TILES } from "../map/assets";
export { circlePolygon, distanceMeters, formatDistance, type LngLat } from "../map/geo";
export { mapPalette, type MapRegion, mapStyle } from "../map/style";
