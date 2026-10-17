import { MediaGrid, VideoCard } from "@krizaka/ui/native";
import { View } from "react-native";

const CDN = "https://krizaka-assets.b-cdn.net/site";
const CLIPS = [
  { id: "tea", title: "Pouring the mint tea, slow", poster: `${CDN}/products/orazaka/gallery/tea-pour.d69c3a5700.webp`, tall: false },
  { id: "watch", title: "The unlock in one tap", poster: `${CDN}/docs/orochia/mobile/clip-watch-poster.9fc5d19c39.webp`, tall: true },
  { id: "snow", title: "First snow on rue Saint-Denis", poster: `${CDN}/products/orazaka/gallery/mtl-snow.e3ecb20e82.webp`, tall: false },
];

// 'uniform' + 'list': one row per video, every picture in a 16:9 frame — the vertical one drawn whole over a blurred copy.
export default function NativeMediaGridList() {
  return (
    <View style={{ width: 360, padding: 16 }}>
      <MediaGrid
        mode="uniform"
        layout="list"
        items={CLIPS}
        getId={(c) => c.id}
        orientationOf={(c) => (c.tall ? "portrait" : "landscape")}
        shelf={{ label: "Shorts" }}
        renderItem={(c, { aspect, layout, mismatch }) => <VideoCard title={c.title} aspect={aspect} layout={layout} fit={mismatch ? "contain" : "cover"} poster={c.poster} duration="3:42" meta="2 days ago" onPress={() => {}} />}
      />
    </View>
  );
}
