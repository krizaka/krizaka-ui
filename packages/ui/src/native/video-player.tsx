// @krizaka/ui/native/video-player — its own entry, because it imports expo-video: an optional peer, installed only by
// the apps that play video. The theme comes from @krizaka/ui/native (the same context as the rest of the platform).
import { useTheme } from "@krizaka/ui/native";
import { type ContentType, useVideoPlayer, type VideoContentFit, VideoView } from "expo-video";
import * as React from "react";
import { AccessibilityInfo, Image, type ImageSourcePropType, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

export type VideoPlayerSource = {
  /** The address (MP4 or an HLS `.m3u8`, signed by your server). */
  uri: string;
  /** `hls` when the address does not end in `.m3u8`; `auto` (default) otherwise. */
  contentType?: ContentType;
  /** Headers sent with the request (an authorization). */
  headers?: Record<string, string>;
};

export type VideoPlayerProps = {
  /** The video. A new source replaces the current one. */
  source: VideoPlayerSource;
  /** The accessible name of the player ("Video: Sunset over Montréal"), passed translated. */
  title: string;
  /** The picture shown until the first frame. */
  poster?: ImageSourcePropType;
  /** Starts playing (muted unless `muted={false}`) — not when the system asks to reduce motion. */
  autoPlay?: boolean;
  /** Starts muted. Default: `autoPlay`. */
  muted?: boolean;
  /** Plays again from the start at the end. */
  loop?: boolean;
  /** Pauses while `true`: the app passes it when the video leaves the screen (a FlatList's viewability). */
  paused?: boolean;
  /** The platform's controls (default `true`: accessible, with full screen). `false` for a story or a background. */
  nativeControls?: boolean;
  /** Allows full screen from the controls. Default `true`. */
  fullscreen?: boolean;
  /** Allows picture in picture. Default `false`. */
  pictureInPicture?: boolean;
  /** How the picture fills the frame: `contain` (default), `cover`, `fill`. */
  contentFit?: VideoContentFit;
  /** The width / height ratio of the frame. Default 16 / 9. */
  aspectRatio?: number;
  /** Called when it starts or stops playing. */
  onPlayingChange?: (playing: boolean) => void;
  /** Styles merged last, on the frame. */
  style?: StyleProp<ViewStyle>;
};

/** The event surface of expo-video's player (a SharedObject of `expo`), typed here so `expo` stays the app's. */
type Emitter = { addListener(event: "playingChange", listener: (payload: { isPlaying: boolean }) => void): { remove(): void } };

/** Applies the options a player can change while it lives (outside the component: the player is the hook's). */
function configure(player: { loop: boolean; muted: boolean }, loop: boolean, muted: boolean) {
  player.loop = loop;
  player.muted = muted;
}

/**
 * A video on expo-video: the platform's own player and controls (accessible, full screen, picture in picture), the
 * poster until the first frame, autoplay that waits under reduced motion, and `paused` to stop it off screen. The
 * web `VideoPlayer` draws its own controls; here the system's are the right ones.
 */
export function VideoPlayer({
  source,
  title,
  poster,
  autoPlay = false,
  muted = autoPlay,
  loop = false,
  paused = false,
  nativeControls = true,
  fullscreen = true,
  pictureInPicture = false,
  contentFit = "contain",
  aspectRatio = 16 / 9,
  onPlayingChange,
  style,
}: VideoPlayerProps) {
  const { theme, radius } = useTheme();
  const [firstFrame, setFirstFrame] = React.useState(false);
  const player = useVideoPlayer({ uri: source.uri, contentType: source.contentType, headers: source.headers }, (p) => configure(p, loop, muted));

  React.useEffect(() => configure(player, loop, muted), [player, loop, muted]);

  React.useEffect(() => {
    let alive = true;
    if (paused) player.pause();
    else if (autoPlay)
      void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
        if (alive && !reduce) player.play();
      });
    return () => {
      alive = false;
    };
  }, [player, paused, autoPlay]);

  React.useEffect(() => {
    if (!onPlayingChange) return;
    const subscription = (player as unknown as Emitter).addListener("playingChange", ({ isPlaying }) => onPlayingChange(isPlaying));
    return () => subscription.remove();
  }, [player, onPlayingChange]);

  return (
    <View role="group" aria-label={title} style={[styles.frame, { aspectRatio, borderRadius: radius.sm, backgroundColor: theme.media }, style]}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit={contentFit}
        nativeControls={nativeControls}
        fullscreenOptions={{ enable: fullscreen }}
        allowsPictureInPicture={pictureInPicture}
        onFirstFrameRender={() => setFirstFrame(true)}
      />
      {poster && !firstFrame ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Image source={poster} aria-hidden resizeMode="cover" style={StyleSheet.absoluteFill} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { width: "100%", overflow: "hidden" },
});
