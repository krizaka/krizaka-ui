import { AudioPlayer } from "@krizaka/ui/audio-player";

// Peaks computed once on the server: 64 values between 0 and 1.
const PEAKS = Array.from({ length: 64 }, (_, i) => 0.2 + Math.abs(Math.sin(i * 0.45) * Math.cos(i * 0.13)) * 0.8);

export default function AudioPlayerVoiceNote() {
  return (
    <div className="w-full max-w-md">
      <AudioPlayer title="Voice note from Eric" src="https://www.krizaka.com/assets/orochia/tour/elena-live.mp4" peaks={PEAKS} duration={42} />
    </div>
  );
}
