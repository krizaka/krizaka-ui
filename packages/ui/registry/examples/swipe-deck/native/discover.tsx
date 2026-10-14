import { Badge, PersonCard, SwipeDeck, Txt, VerifiedBadge } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

const PEOPLE = [
  { id: "c", name: "Camille", age: 29, km: 3.2, bio: "Sunsets, vinyl and long walks.", tags: ["Music", "Surf"], photos: ["https://krizaka-assets.b-cdn.net/site/people/ui/camille-512.9573eaa0b8.webp"] },
  { id: "t", name: "Tomás", age: 31, km: 12, bio: "Cook, climber, bad puns.", tags: ["Climbing"], photos: ["https://krizaka-assets.b-cdn.net/site/people/ui/tomas-512.dd7c4fd230.webp"] },
];

// Discover: drag right to like, left to pass — or the buttons; the next card waits under.
export default function NativeSwipeDeckDiscover() {
  const [people, setPeople] = useState(PEOPLE);
  return (
    <View style={{ width: 340, height: 560 }}>
      <SwipeDeck
        items={people}
        getId={(p) => p.id}
        onSwipe={(p) => setPeople((all) => all.filter((x) => x.id !== p.id))}
        labels={{ like: "Like", pass: "Pass", likeStamp: "LIKE", passStamp: "NOPE" }}
        renderCard={(p) => (
          <PersonCard
            photos={p.photos.map((uri) => ({ uri }))}
            name={p.name}
            age={p.age}
            badge={<VerifiedBadge label="Verified" on="media" size={20} />}
            meta={<Txt tone="onMedia" variant="caption">{`${p.km} km away`}</Txt>}
            bio={p.bio}
            footer={p.tags.map((t) => <Badge key={t} tone="scrim">{t}</Badge>)}
          />
        )}
      />
    </View>
  );
}
