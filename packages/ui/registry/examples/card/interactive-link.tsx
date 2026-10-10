import { Card } from "@krizaka/ui/card";

// `asChild` + `<a>`: the whole card is one link; `interactive` adds the spotlight and the lift.
export default function CardInteractiveLink() {
  return (
    <Card.Root asChild interactive>
      <a href="#guide">
        <Card.Body>
          <Card.Title as="h2">Getting started</Card.Title>
          <Card.Description>Install the preset, import the primitives, ship both themes.</Card.Description>
          <Card.Footer>Read the guide →</Card.Footer>
        </Card.Body>
      </a>
    </Card.Root>
  );
}
