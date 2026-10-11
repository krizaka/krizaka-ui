// @krizaka/ui/native/media-capture — its own entry, because it imports expo-camera: an optional peer, installed only
// by the apps that use the camera. The theme and the buttons come from @krizaka/ui/native.
import { Button, Txt, useReducedMotion, useTheme } from "@krizaka/ui/native";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import * as React from "react";
import { Linking, Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

export type MediaCaptureLabels = {
  /** Why the camera is asked for, before the request ("Use your camera to take a photo"). */
  prompt: string;
  /** The button that asks ("Turn on the camera"). */
  start: string;
  /** Permission refused for good ("Camera access is off. Turn it on in Settings."). */
  denied: string;
  /** Opens the app's settings ("Open Settings"). */
  settings: string;
  takePhoto: string;
  startRecording: string;
  stopRecording: string;
  switchCamera: string;
};

export type NativeCaptureResult = {
  /** The file of the photo or the clip, on the device. */
  uri: string;
  /** `photo` or `video`. */
  kind: "photo" | "video";
};

export type MediaCaptureProps = {
  /** What it captures: `photo` (default) or `video`. */
  mode?: "photo" | "video";
  /** The camera at first: `front` (default) or `back`. */
  facing?: "front" | "back";
  /** The longest clip, in seconds. */
  maxDuration?: number;
  /** Called with the photo taken or the clip recorded. */
  onCapture: (result: NativeCaptureResult) => void;
  /** Called when a capture fails. */
  onError?: (error: unknown) => void;
  /** The width / height ratio of the preview. Default 3 / 4. */
  aspectRatio?: number;
  /** The words, passed translated. */
  labels: MediaCaptureLabels;
  /** Styles merged last, on the frame. */
  style?: StyleProp<ViewStyle>;
};

/**
 * The camera in a screen, on expo-camera: asks for the permission only when the person presses the button, sends them
 * to Settings when it was refused for good, takes a photo or records a clip (and the microphone for a clip), switches
 * cameras. The web `MediaCapture` with the same words.
 */
export function MediaCapture({ mode = "photo", facing: initialFacing = "front", maxDuration, onCapture, onError, aspectRatio = 3 / 4, labels, style }: MediaCaptureProps) {
  const { theme, radius } = useTheme();
  const reduce = useReducedMotion();
  const camera = React.useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [microphone, requestMicrophone] = useMicrophonePermissions();
  const [facing, setFacing] = React.useState(initialFacing);
  const [ready, setReady] = React.useState(false);
  const [recording, setRecording] = React.useState(false);

  const ask = async () => {
    const result = await requestPermission();
    if (result.granted && mode === "video" && !microphone?.granted) await requestMicrophone();
  };

  const shoot = async () => {
    if (!camera.current || !ready) return;
    try {
      if (mode === "photo") {
        const photo = await camera.current.takePictureAsync({ quality: 0.9 });
        if (photo) onCapture({ uri: photo.uri, kind: "photo" });
      } else if (recording) {
        camera.current.stopRecording();
      } else {
        setRecording(true);
        const clip = await camera.current.recordAsync(maxDuration ? { maxDuration } : undefined);
        setRecording(false);
        if (clip) onCapture({ uri: clip.uri, kind: "video" });
      }
    } catch (error) {
      setRecording(false);
      onError?.(error);
    }
  };

  const frame = [styles.frame, { aspectRatio, borderRadius: radius.md, backgroundColor: theme.media }, style];

  if (!permission?.granted) {
    const blocked = permission ? !permission.canAskAgain : false;
    return (
      <View style={[frame, styles.panel]}>
        <Txt style={styles.center}>
          {blocked ? labels.denied : labels.prompt}
        </Txt>
        {blocked ? (
          <Button label={labels.settings} variant="secondary" onPress={() => void Linking.openSettings()} />
        ) : (
          <Button label={labels.start} variant="primary" onPress={() => void ask()} />
        )}
      </View>
    );
  }

  return (
    <View style={frame}>
      <CameraView
        ref={camera}
        style={StyleSheet.absoluteFill}
        facing={facing}
        mode={mode === "video" ? "video" : "picture"}
        mirror={facing === "front"}
        onCameraReady={() => setReady(true)}
        aria-hidden
      />
      <View style={styles.bar}>
        <View style={styles.side} />
        <Pressable
          role="button"
          aria-label={mode === "photo" ? labels.takePhoto : recording ? labels.stopRecording : labels.startRecording}
          aria-disabled={!ready}
          disabled={!ready}
          onPress={() => void shoot()}
          style={({ pressed }) => [styles.shutter, { borderColor: theme.textOnMedia, opacity: pressed && !reduce ? 0.8 : 1 }]}
        >
          <View
            style={[
              mode === "video" && recording ? styles.stop : styles.dot,
              { backgroundColor: mode === "video" ? theme.danger : theme.textOnMedia },
            ]}
          />
        </Pressable>
        <Pressable
          role="button"
          aria-label={labels.switchCamera}
          aria-disabled={recording}
          disabled={recording}
          hitSlop={8}
          onPress={() => setFacing((f) => (f === "front" ? "back" : "front"))}
          style={[styles.side, styles.flip, { backgroundColor: theme.scrimStrong, opacity: recording ? 0 : 1 }]}
        >
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={theme.textOnMedia} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <Path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" />
          </Svg>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { width: "100%", overflow: "hidden" },
  panel: { alignItems: "center", justifyContent: "center", gap: 16, padding: 24 },
  center: { textAlign: "center" },
  bar: { position: "absolute", left: 0, right: 0, bottom: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" },
  side: { width: 48, height: 48 },
  flip: { borderRadius: 24, alignItems: "center", justifyContent: "center" },
  shutter: { width: 72, height: 72, borderRadius: 36, borderWidth: 4, alignItems: "center", justifyContent: "center" },
  dot: { width: 54, height: 54, borderRadius: 27 },
  stop: { width: 26, height: 26, borderRadius: 6 },
});
