import { VideoPlayer } from "@krizaka/ui/video-player";

const TOUR = "https://www.krizaka.com/assets/orochia/tour";

// A 9:16 clip: muted, looping; autoplay waits for a gesture under reduced motion.
export default function VideoPlayerVertical() {
  return (
    <div className="w-64">
      <VideoPlayer title="Story: behind the scenes" src={`${TOUR}/alex-story.mp4`} poster={`${TOUR}/alex-story.jpg`} aspectRatio="9 / 16" autoPlay loop muted playbackRates={[]} />
    </div>
  );
}
