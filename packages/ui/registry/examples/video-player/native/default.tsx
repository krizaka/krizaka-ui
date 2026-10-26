import { VideoPlayer } from "@krizaka/ui/native/video-player";

// expo-video plays HLS natively on iOS and Android; the poster stays until the first frame.
export default function NativeVideoPlayerDefault() {
  return (
    <VideoPlayer
      title="Film: the world of Krizaka"
      source={{ uri: "https://krizaka-assets.b-cdn.net/site/brand-films/film/le-monde-de-krizaka-16x9.b1c7c4ee51.mp4" }}
      poster={{ uri: "https://krizaka-assets.b-cdn.net/site/brand-films/film/le-monde-de-krizaka-16x9.f3ec7dbb08.jpg" }}
    />
  );
}
