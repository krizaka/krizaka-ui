import { VideoPlayer } from "@krizaka/ui/native/video-player";

// expo-video plays HLS natively on iOS and Android; the poster stays until the first frame.
export default function NativeVideoPlayerDefault() {
  return (
    <VideoPlayer
      title="Video: a live auction"
      source={{ uri: "https://www.krizaka.com/assets/orochia/tour/alex-bid.mp4" }}
      poster={{ uri: "https://www.krizaka.com/assets/orochia/tour/alex-bid.jpg" }}
    />
  );
}
