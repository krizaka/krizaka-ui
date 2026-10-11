import { Card } from "@krizaka/ui/card";

// `variant="outline"`: a frame without material — an option among raised cards, a placeholder, a quiet group.
export default function CardOutline() {
  return (
    <Card.Root variant="outline">
      <Card.Body>
        <Card.Title>Add a payment method</Card.Title>
        <Card.Description>Cards and SEPA debits are accepted.</Card.Description>
      </Card.Body>
    </Card.Root>
  );
}
