import { Avatar, Card, Header, Screen, Txt } from "@krizaka/ui/native";
import { View } from "react-native";

const POSTS = [
  { id: "1", who: "Elena", what: "Sunset session at Cabo da Roca", when: "2 h" },
  { id: "2", who: "Noah", what: "Best ramen in Porto? I have a list.", when: "5 h" },
  { id: "3", who: "Mina", what: "Free tickets for the jazz night!", when: "Yesterday" },
];

// A feed: a large title, cards under it (a long feed uses the list of `@krizaka/ui/native/list` in `scroll={false}`).
export default function NativeScreenFeed() {
  return (
    <View style={{ width: 360, height: 640 }}>
      <Screen header={<Header title="Moments" subtitle="From people you matched with" />}>
        {POSTS.map((p) => (
          <Card.Root key={p.id}>
            <Card.Body>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Avatar alt={p.who} size="sm" />
                <Txt variant="label" style={{ flex: 1 }}>
                  {p.who}
                </Txt>
                <Txt variant="caption" tone="secondary">
                  {p.when}
                </Txt>
              </View>
              <Txt>{p.what}</Txt>
            </Card.Body>
          </Card.Root>
        ))}
      </Screen>
    </View>
  );
}
