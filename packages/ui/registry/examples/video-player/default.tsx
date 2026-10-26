import { VideoPlayer } from "@krizaka/ui/video-player";

// For HLS, add `loadHls={() => import("hls.js")}`: only browsers without native HLS download it.
export default function VideoPlayerDefault() {
  return <VideoPlayer title="Film: the world of Krizaka" src="https://krizaka-assets.b-cdn.net/site/brand-films/film/le-monde-de-krizaka-16x9.b1c7c4ee51.mp4" poster="https://krizaka-assets.b-cdn.net/site/brand-films/film/le-monde-de-krizaka-16x9.f3ec7dbb08.jpg" />;
}
