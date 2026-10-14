import { ShortFeed, VerticalVideo } from "@krizaka/ui/native/vertical-video";
import { View } from "react-native";

const CDN = "https://krizaka-assets.b-cdn.net/site/people/ui";
const CLIPS = [
  { id: "1", who: "Camille", face: `${CDN}/camille-256.dc2943029a.webp`, poster: `${CDN}/camille-512.9573eaa0b8.webp`, caption: "Sunset session at Cabo da Roca." },
  { id: "2", who: "Tomás", face: `${CDN}/tomas-256.7eaab80903.webp`, poster: `${CDN}/tomas-512.dd7c4fd230.webp`, caption: "Best ramen in Porto? I have a list." },
];

// A feed in the vertical format: one clip per screen with the action rail on the right and the caption bottom-left; the one
// in view plays and the others pause (`uri` is your clip — here the poster stands for it).
export default function NativeScreenFeed() {
  return (
    <View style={{ width: 360, height: 640 }}>
      <ShortFeed
        label="Moments"
        height={640}
        items={CLIPS}
        getId={(clip) => clip.id}
        renderItem={(clip, { active }) => (
          <VerticalVideo
            title={`Video by ${clip.who}`}
            active={active}
            posterUri={clip.poster}
            creator={{ name: clip.who, avatarUri: clip.face }}
            caption={clip.caption}
            likes={1200}
            comments={48}
            onLike={() => undefined}
            onComment={() => undefined}
            onShare={() => undefined}
            style={{ height: 640, aspectRatio: undefined }}
          />
        )}
      />
    </View>
  );
}
