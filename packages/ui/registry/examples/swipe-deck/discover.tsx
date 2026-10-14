"use client";

import { Badge } from "@krizaka/ui/badge";
import { PersonCard, SwipeDeck } from "@krizaka/ui/swipe-deck";
import { VerifiedBadge } from "@krizaka/ui/verified-badge";
import { useState } from "react";

const PEOPLE = [
  { id: "c", name: "Camille", age: 29, km: 3.2, bio: "Sunsets, vinyl and long walks.", tags: ["Music", "Surf"], photos: ["https://krizaka-assets.b-cdn.net/site/people/ui/camille-512.9573eaa0b8.webp"] },
  { id: "t", name: "Tomás", age: 31, km: 12, bio: "Cook, climber, bad puns.", tags: ["Climbing"], photos: ["https://krizaka-assets.b-cdn.net/site/people/ui/tomas-512.dd7c4fd230.webp"] },
];

// Discover: drag right to like, left to pass, the buttons, or ← → on the focused deck.
export default function SwipeDeckDiscover() {
  const [people, setPeople] = useState(PEOPLE);
  return (
    <SwipeDeck
      items={people}
      getId={(p) => p.id}
      getName={(p) => p.name}
      onSwipe={(p) => setPeople((all) => all.filter((x) => x.id !== p.id))}
      labels={{ like: "Like", pass: "Pass", deck: "Profiles. Right arrow to like, left arrow to pass.", likeStamp: "Like", passStamp: "Nope" }}
      renderCard={(p) => (
        <PersonCard
          photos={p.photos.map((src) => ({ src }))}
          name={p.name}
          age={p.age}
          badge={<VerifiedBadge label="Verified" onMedia size="lg" />}
          meta={<span className="text-xs font-semibold">{`${p.km} km away`}</span>}
          bio={p.bio}
          footer={p.tags.map((t) => <Badge key={t} tone="scrim">{t}</Badge>)}
        />
      )}
    />
  );
}
