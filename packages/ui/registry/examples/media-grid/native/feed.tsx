import { Badge, MediaGrid, VideoCard } from "@krizaka/ui/native";
import { ScrollView } from "react-native";

const CDN = "https://krizaka-assets.b-cdn.net/site";
const WIDE = `${CDN}/products/orazaka/gallery`;
const TALL = `${CDN}/docs/orochia/mobile`;
const CLIPS = [
  { id: "tea", title: "Pouring the mint tea, slow", poster: `${WIDE}/tea-pour.d69c3a5700.webp`, tall: false },
  { id: "story", title: "Backstage, a minute before", poster: `${TALL}/clip-feed-stories-poster.fd7835fa74.webp`, tall: true },
  { id: "snow", title: "First snow on rue Saint-Denis", poster: `${WIDE}/mtl-snow.e3ecb20e82.webp`, tall: false },
  { id: "watch", title: "The unlock in one tap", poster: `${TALL}/clip-watch-poster.9fc5d19c39.webp`, tall: true },
  { id: "thanks", title: "Three ways to say thanks", poster: `${TALL}/clip-unlock-poster.57e13fee5f.webp`, tall: true },
];

// 'split': the 9:16 clips on a Shorts shelf that snaps card by card, the 16:9 ones in a grid of one height per row.
export default function NativeMediaGridFeed() {
  return (
    <ScrollView style={{ width: 360, height: 720 }} contentContainerStyle={{ padding: 16 }}>
      <MediaGrid
        items={CLIPS}
        getId={(c) => c.id}
        orientationOf={(c) => (c.tall ? "portrait" : "landscape")}
        shelf={{ label: "Shorts", seeAll: { label: "See all", onPress: () => {} } }}
        renderItem={(c, { aspect, layout, width, mismatch }) => (
          <VideoCard title={c.title} aspect={aspect} layout={layout} width={width} fit={mismatch ? "contain" : "cover"} poster={c.poster} duration="0:12" meta="12.4K views" creator={{ name: "Camille" }} badges={<Badge tone="scrim">Free</Badge>} onPress={() => {}} />
        )}
      />
    </ScrollView>
  );
}
