// @krizaka/ui/native/media-picker — its own entry, because it imports expo-image-picker: an optional peer, installed
// only by the apps that pick photos or videos. The theme, the sheet and the buttons come from @krizaka/ui/native.
import { ActionSheet, Txt, useTheme } from "@krizaka/ui/native";
import { launchCameraAsync, launchImageLibraryAsync, requestCameraPermissionsAsync } from "expo-image-picker";
import * as React from "react";
import { Image, Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

/** A picked photo or video, on the device. */
export type PickedMedia = {
  /** Its file on the device (upload it from here). */
  uri: string;
  /** `image` or `video`. */
  kind: "image" | "video";
  /** Its size in pixels. */
  width: number;
  height: number;
  /** A video's length in milliseconds. */
  duration?: number | null;
  /** Its file name, when the system gives it. */
  fileName?: string | null;
};

export type MediaPickerLabels = {
  /** The add tile (“Add a photo”). */
  add: string;
  /** The sheet's title (“Add from”). */
  source: string;
  /** From the library (“Photo library”). */
  library: string;
  /** From the camera (“Take a photo”). */
  camera: string;
  /** Cancel. */
  cancel: string;
  /** A tile's remove button: `(n) => "Remove photo " + n`. */
  remove: (position: number) => string;
  /** The count under the grid: `(n, max) => n + " of " + max`. */
  count?: (n: number, max: number) => string;
};

export type MediaPickerProps = {
  /** The media picked (controlled). */
  value: readonly PickedMedia[];
  /** Called with the new list. */
  onValueChange: (media: PickedMedia[]) => void;
  /** What can be picked. Default `images`. */
  accept?: "images" | "videos" | "all";
  /** The most that can be picked. Default 1. */
  max?: number;
  /** Offer the camera beside the library. Default true. */
  camera?: boolean;
  /** The words, passed translated. */
  labels: MediaPickerLabels;
  /** Called when the camera is refused (show a `PermissionPrompt`). */
  onPermissionDenied?: () => void;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

const typesOf = (accept: MediaPickerProps["accept"]) => (accept === "videos" ? ["videos"] : accept === "all" ? ["images", "videos"] : ["images"]);

/**
 * Photos and videos picked from the library or the camera, as a grid of square tiles: an add tile (the system's
 * picker, or a sheet to choose library or camera), a remove button on each tile, a count against `max`.
 */
export function MediaPicker({ value, onValueChange, accept = "images", max = 1, camera = true, labels, onPermissionDenied, style }: MediaPickerProps) {
  const { theme, radius, haptic } = useTheme();
  const [choosing, setChoosing] = React.useState(false);
  const left = max - value.length;
  const add = (picked: { canceled: boolean; assets: readonly { uri: string; type?: string | null; width: number; height: number; duration?: number | null; fileName?: string | null }[] | null }) => {
    if (picked.canceled || !picked.assets) return;
    haptic("selection");
    const media = picked.assets.map((a) => ({ uri: a.uri, kind: a.type === "video" ? ("video" as const) : ("image" as const), width: a.width, height: a.height, duration: a.duration, fileName: a.fileName }));
    onValueChange([...value, ...media].slice(0, max));
  };
  const fromLibrary = async () => add(await launchImageLibraryAsync({ mediaTypes: typesOf(accept) as never, allowsMultipleSelection: left > 1, selectionLimit: left, quality: 0.9 }));
  const fromCamera = async () => {
    const permission = await requestCameraPermissionsAsync();
    if (!permission.granted) return onPermissionDenied?.();
    add(await launchCameraAsync({ mediaTypes: typesOf(accept) as never, quality: 0.9 }));
  };
  const tile = [styles.tile, { borderRadius: radius.md, backgroundColor: theme.surface2, borderColor: theme.borderDefault }];
  return (
    <View style={style}>
      <View style={styles.grid}>
        {value.map((media, i) => (
          <View key={`${media.uri}-${i}`} style={tile}>
            <Image source={{ uri: media.uri }} style={StyleSheet.absoluteFill} resizeMode="cover" accessibilityIgnoresInvertColors />
            <Pressable role="button" aria-label={labels.remove(i + 1)} hitSlop={8} onPress={() => onValueChange(value.filter((_, j) => j !== i))} style={[styles.remove, { backgroundColor: theme.scrimStrong }]}>
              <Svg width={14} height={14} viewBox="0 0 24 24" aria-hidden>
                <Path d="M18 6 6 18M6 6l12 12" stroke={theme.textOnMedia} strokeWidth={3} strokeLinecap="round" />
              </Svg>
            </Pressable>
          </View>
        ))}
        {left > 0 ? (
          <Pressable role="button" aria-label={labels.add} onPress={() => (camera ? setChoosing(true) : void fromLibrary())} style={({ pressed }) => [...tile, styles.add, { borderStyle: "dashed", opacity: pressed ? 0.7 : 1 }]}>
            <Svg width={26} height={26} viewBox="0 0 24 24" aria-hidden>
              <Path d="M12 5v14M5 12h14" stroke={theme.accentText} strokeWidth={2.4} strokeLinecap="round" />
            </Svg>
            <Txt variant="caption" tone="secondary" aria-hidden>
              {labels.add}
            </Txt>
          </Pressable>
        ) : null}
      </View>
      {labels.count && max > 1 ? (
        <Txt variant="caption" tone="secondary" style={styles.count}>
          {labels.count(value.length, max)}
        </Txt>
      ) : null}
      {camera ? (
        <ActionSheet
          open={choosing}
          onOpenChange={setChoosing}
          title={labels.source}
          cancelLabel={labels.cancel}
          actions={[
            { label: labels.library, onPress: () => void fromLibrary() },
            { label: labels.camera, onPress: () => void fromCamera() },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tile: { width: 96, height: 96, overflow: "hidden", borderWidth: StyleSheet.hairlineWidth },
  add: { alignItems: "center", justifyContent: "center", gap: 4, borderWidth: 1.5 },
  remove: { position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  count: { marginTop: 8 },
});
