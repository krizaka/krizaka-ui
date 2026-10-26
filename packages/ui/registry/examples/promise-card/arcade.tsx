import { Mascot } from "@krizaka/ui/mascots";
import { PromiseCard } from "@krizaka/ui/promise-card";

// The special move of a told page: the input lights key by key, then the move lands, carried by the clan's bird.
export default function PromiseCardArcade() {
  return (
    <PromiseCard
      variant="arcade"
      brand="orazaka"
      className="w-[30rem] max-w-full"
      label="Special move"
      promise="90 % to the creator. On every sale."
      keys={["→", "↓", "↘", "P+K"]}
      bearer={<Mascot bird="flamingo" mood="success" size={48} animated={false} />}
      bearerLabel="In the corner"
      bearerName="The flamingo · gets paid"
    />
  );
}
