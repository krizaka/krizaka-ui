import { Button } from "@krizaka/ui/button";
import { VideoPlayer } from "@krizaka/ui/video-player";

const TOUR = "https://www.krizaka.com/assets/orochia/tour";

// The app draws its gate over the video; the controls step aside until it opens.
export default function VideoPlayerGated() {
  return (
    <VideoPlayer
      title="Video: unlocked for supporters"
      src={`${TOUR}/alex-unlock.mp4`}
      poster={`${TOUR}/alex-unlock.jpg`}
      preload="none"
      overlay={
        <div className="flex h-full flex-col items-center justify-center gap-3 bg-scrim-strong p-6 text-center backdrop-blur-md">
          <p className="text-base font-semibold text-fg-on-media">Supporters only</p>
          <p className="max-w-xs text-sm text-fg-on-media">Unlock this video with a tip of $5 or more.</p>
          <Button variant="primary">Unlock for $5</Button>
        </div>
      }
    />
  );
}
