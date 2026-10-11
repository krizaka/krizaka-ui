import { Card } from "@krizaka/ui/card";

// `cut`: the Krizaka chamfer on the top-right corner — the angle of the marks and the icons.
export default function CardCut() {
  return (
    <Card.Root cut variant="elevated">
      <Card.Body>
        <Card.Title>Sovereign by design</Card.Title>
        <Card.Description>Your models, your data, your servers — nothing leaves your infrastructure.</Card.Description>
      </Card.Body>
    </Card.Root>
  );
}
