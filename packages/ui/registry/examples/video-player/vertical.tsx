import { VideoPlayer } from "@krizaka/ui/video-player";

// A 9:16 clip: muted, looping; autoplay waits for a gesture under reduced motion.
export default function VideoPlayerVertical() {
  return (
    <div className="w-64">
      <VideoPlayer title="Film: the world of Krizaka" src="https://krizaka-assets.b-cdn.net/site/brand-films/film/le-monde-de-krizaka-9x16.aa28980db3.mp4" poster="https://krizaka-assets.b-cdn.net/site/brand-films/film/le-monde-de-krizaka-9x16.8133fbbaa5.jpg" aspectRatio="9 / 16" autoPlay loop muted playbackRates={[]} />
    </div>
  );
}
