import { Card } from "@krizaka/ui/native";

// `onPress`: the whole card is a button, named by its content.
export default function NativeCardPressable() {
  return (
    <Card.Root onPress={() => {}} style={{ width: 300 }}>
      <Card.Body>
        <Card.Title>Night set — vol. 4</Card.Title>
        <Card.Description>Tap anywhere on the card.</Card.Description>
      </Card.Body>
    </Card.Root>
  );
}
