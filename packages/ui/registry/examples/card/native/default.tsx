import { Badge, Card, Txt } from "@krizaka/ui/native";
import { View } from "react-native";

export default function NativeCardDefault() {
  return (
    <Card.Root style={{ width: 300 }}>
      <Card.Media>
        <Card.Image src={null} />
        <Card.Overlay corner="top-left">
          <Badge tone="scrim" dot>
            Tonight
          </Badge>
        </Card.Overlay>
      </Card.Media>
      <Card.Body>
        <View>
          <Card.Title>Night set — vol. 4</Card.Title>
          <Card.Description>Forty minutes of deep house, recorded live.</Card.Description>
        </View>
        <Card.Footer>
          <Txt variant="caption" tone="secondary">
            @maya · 2 h ago
          </Txt>
        </Card.Footer>
      </Card.Body>
    </Card.Root>
  );
}
