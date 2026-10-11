import { Card } from "@krizaka/ui/card";

// `variant="glass"`: frosted glass, for a card over a media or a backdrop — the text keeps AA on whatever passes under.
export default function CardGlass() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-accent to-accent-2 p-6">
      <Card.Root variant="glass">
        <Card.Body>
          <Card.Title>Now rendering</Card.Title>
          <Card.Description>“Night market, Tunis” — 4K, 12 min 04 s. About two minutes left.</Card.Description>
        </Card.Body>
      </Card.Root>
    </div>
  );
}
