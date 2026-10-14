import { Button } from "@krizaka/ui/native";
import { VerticalVideo } from "@krizaka/ui/native/vertical-video";
import { useState } from "react";
import { View } from "react-native";

const CDN = "https://krizaka-assets.b-cdn.net/site/people/ui";

// One short video: the rail on the right (follow, like, comments, share, your own tip button), the caption bottom-left.
// `uri` is your clip; without it the poster shows. A long press likes.
export default function NativeVerticalVideoRail({ uri }: { uri?: string } = {}) {
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  return (
    <View style={{ width: 260 }}>
      <VerticalVideo
        title="Video: Night shoot, part 2"
        {...(uri ? { uri } : {})}
        posterUri={`${CDN}/camille-512.9573eaa0b8.webp`}
        creator={{ name: "Camille", avatarUri: `${CDN}/camille-256.dc2943029a.webp`, verifiedLabel: "Verified" }}
        disclosure="AI-generated"
        caption="The rooftop, the rain, the last take at dawn."
        tags={["nightshoot"]}
        credit="Original sound — Camille"
        likes={12400 + (liked ? 1 : 0)}
        comments={328}
        shares={95}
        liked={liked}
        following={following}
        onLike={setLiked}
        onFollow={setFollowing}
        onComment={() => undefined}
        onShare={() => undefined}
        tipSlot={<Button label="Tip" size="sm" variant="primary" />}
      />
    </View>
  );
}
