import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { Card } from "@krizaka/ui/card";

// `variant="spotlight"`: a halo of the brand from the top and a hairline of light — the one card a section is about.
export default function CardSpotlight() {
  return (
    <Card.Root variant="spotlight">
      <Card.Body padding="lg">
        <Badge tone="accent" dot>
          Recommended
        </Badge>
        <Card.Title as="h3">Studio plan</Card.Title>
        <Card.Description>Unlimited exports, priority rendering and a shared library for your team.</Card.Description>
        <Card.Stat label="Per month">€24</Card.Stat>
        <Button variant="primary">Choose Studio</Button>
      </Card.Body>
    </Card.Root>
  );
}
