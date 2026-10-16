"use client";

import { Button } from "@krizaka/ui/button";
import { VerticalVideo } from "@krizaka/ui/vertical-video";
import { useState } from "react";

const CDN = "https://krizaka-assets.b-cdn.net/site/people/ui";

// One short video (`src` and `poster` are yours: a clip of your own): the rail on the right (follow, like, comments, share, your own tip button), the caption bottom-left.
// Tap pauses, double tap likes, Space pauses and L likes on the focused video. `fit="fill"` fills a box of its own size.
export default function VerticalVideoRail({ src, poster = `${CDN}/camille-512.9573eaa0b8.webp`, fit = "frame" }: { src?: string; poster?: string; fit?: "frame" | "fill" } = {}) {
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  return (
    <div className={fit === "fill" ? "h-full w-full" : "w-64"}>
      <VerticalVideo
        fit={fit}
        title="Video: Night shoot, part 2"
        src={src}
        poster={poster}
        active={false}
        creator={{ name: "Camille", avatarSrc: `${CDN}/camille-256.dc2943029a.webp`, verifiedLabel: "Verified" }}
        caption="The rooftop, the rain, the last take at dawn."
        tags={["nightshoot", "montreal"]}
        disclosure="AI-generated"
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
        tipSlot={<Button size="sm" variant="primary" shape="pill">Tip</Button>}
      />
    </div>
  );
}
