import { Button, Card } from "@krizaka/ui/native";

export default function NativeCardBody() {
  return (
    <Card.Root radius="lg" style={{ width: 300 }}>
      <Card.Body padding="lg">
        <Card.Title>Your wallet</Card.Title>
        <Card.Description>Top up to support the creators you follow.</Card.Description>
        <Button variant="primary" label="Top up" />
      </Card.Body>
    </Card.Root>
  );
}
