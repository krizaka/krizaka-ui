// Storybook and Jest only — never built: expo-video needs a native module (Jest) and its own web build (Storybook
// renders the native stories through react-native-web). A player that records play / pause, and a view that draws
// the frame; the stories then show the poster over the media colour, as an app does before the first frame.
import * as React from "react";
import { View, type ViewStyle } from "react-native";

type Player = { loop: boolean; muted: boolean; playing: boolean; play(): void; pause(): void; addListener(): { remove(): void } };

function createPlayer(): Player {
  const player: Player = {
    loop: false,
    muted: false,
    playing: false,
    play: () => {
      player.playing = true;
    },
    pause: () => {
      player.playing = false;
    },
    addListener: () => ({ remove: () => undefined }),
  };
  return player;
}

export function useVideoPlayer(_source: unknown, setup?: (player: Player) => void): Player {
  const [player] = React.useState(() => {
    const created = createPlayer();
    setup?.(created);
    return created;
  });
  return player;
}

export function VideoView({ style }: { style?: ViewStyle; player?: Player }) {
  return <View testID="expo-video-view" aria-hidden style={style} />;
}

export type ContentType = "auto" | "progressive" | "hls" | "dash" | "smoothStreaming";
export type VideoContentFit = "contain" | "cover" | "fill";
