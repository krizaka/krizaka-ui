import { Card } from "@krizaka/ui/card";

// `Card.Stat`: the label in capitals, the value in tabular digits.
export default function CardStatCard() {
  return (
    <Card.Root tone="elevated">
      <Card.Body>
        <Card.Title>This month</Card.Title>
        <div className="grid grid-cols-2 gap-4">
          <Card.Stat label="Revenue">€4,812</Card.Stat>
          <Card.Stat label="Supporters">318</Card.Stat>
        </div>
        <Card.Footer>Updated 5 minutes ago</Card.Footer>
      </Card.Body>
    </Card.Root>
  );
}
