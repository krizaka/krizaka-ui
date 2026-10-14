"use client";

import { ShortFeed, VerticalVideo } from "@krizaka/ui/vertical-video";

const CDN = "https://krizaka-assets.b-cdn.net/site/people/ui";
const CLIPS = [
  { id: "a", who: "Camille", face: `${CDN}/camille-256.dc2943029a.webp`, caption: "Night shoot, part 2." },
  { id: "b", who: "Tomás", face: `${CDN}/tomas-256.7eaab80903.webp`, caption: "Sunday market, slow." },
  { id: "c", who: "Noor", face: `${CDN}/noor-256.c340c41421.webp`, caption: "Backstage cut." },
];

// A feed: one video per screen, the one in view plays, the next preloads, the others pause; ↑ ↓ move between them.
export default function VerticalVideoFeed({ src }: { src?: string } = {}) {
  return (
    <ShortFeed
      label="Videos"
      className="h-[34rem] w-64"
      items={CLIPS}
      getId={(clip) => clip.id}
      renderItem={(clip, { active, preload }) => (
        <VerticalVideo
          title={`Video by ${clip.who}`}
          src={src}
          poster={clip.face}
          active={active}
          preload={preload}
          creator={{ name: clip.who, avatarSrc: clip.face }}
          caption={clip.caption}
          likes={1200}
          comments={48}
          onLike={() => undefined}
        />
      )}
    />
  );
}
