import { VideoPlayer } from "@krizaka/ui/video-player";

const TOUR = "https://www.krizaka.com/assets/orochia/tour";

// For HLS, add `loadHls={() => import("hls.js")}`: only browsers without native HLS download it.
export default function VideoPlayerDefault() {
  return <VideoPlayer title="Video: an auction on Orochia" src={`${TOUR}/alex-bid.mp4`} poster={`${TOUR}/alex-bid.jpg`} />;
}
