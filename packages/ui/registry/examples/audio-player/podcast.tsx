import { AudioPlayer } from "@krizaka/ui/audio-player";

const PEAKS = Array.from({ length: 200 }, (_, i) => (i % 37 < 3 ? 0.05 : 0.3 + Math.abs(Math.sin(i * 0.31)) * 0.7));

// A longer extract: more bars, four speeds, the time before the metadata arrives.
export default function AudioPlayerPodcast() {
  return (
    <div className="w-full max-w-lg">
      <AudioPlayer
        title="Creators' hour — episode 12, extract"
        src="https://www.krizaka.com/assets/orochia/tour/alex-discover.mp4"
        peaks={PEAKS}
        bars={72}
        duration={190}
        playbackRates={[1, 1.25, 1.5, 2]}
      />
    </div>
  );
}
