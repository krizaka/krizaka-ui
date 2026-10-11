// The mobile showcase: the same material on @krizaka/ui/native — raised cards with their sheen and edge of light, the
// griffe on the call to action (drawn, React Native has no corner-shape), the node on the badges, presence on the
// avatars, a raised segment, glass toasts. krizaka.com/docs/ui shows its screenshots (react-native-web, dark and light).
import { Avatar, Badge, Button, Card, Chip, Progress, Segmented, Txt, useTheme } from "@krizaka/ui/native";
import * as React from "react";
import { View } from "react-native";

const VIEWS = [
  { value: "live", label: "Live" },
  { value: "queue", label: "Queue" },
  { value: "wallet", label: "Wallet" },
] as const;

/** A phone-width screen: a creator live, a tip, a job queue — every part a primitive of @krizaka/ui/native. */
export default function MobileShowcase() {
  const { theme } = useTheme();
  const [view, setView] = React.useState<(typeof VIEWS)[number]["value"]>("live");
  const [amount, setAmount] = React.useState("10");
  return (
    <View style={{ width: 360, gap: 14, padding: 16, backgroundColor: theme.surface0, borderRadius: 32, borderWidth: 1, borderColor: theme.borderDefault }}>
      <Segmented aria-label="View" options={VIEWS} value={view} onValueChange={setView} />
      <Card.Root>
        <Card.Body>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Avatar alt="Elena Ben Ali" size="lg" ring status="online" />
            <View style={{ flex: 1, gap: 2 }}>
              <Txt variant="title">Elena Ben Ali</Txt>
              <Txt variant="caption" tone="secondary">
                Live now · 1.2k watching
              </Txt>
            </View>
            <Badge tone="danger" dot pulse>
              Live
            </Badge>
          </View>
          <Chip.Group type="single" aria-label="Amount" value={amount} onValueChange={(v) => v && setAmount(v)}>
            {["5", "10", "25"].map((v) => (
              <Chip key={v} value={v}>
                {`€${v}`}
              </Chip>
            ))}
          </Chip.Group>
          <Button variant="gradient" size="lg" label={`Send €${amount}`} onPress={() => {}} />
        </Card.Body>
      </Card.Root>
      <Card.Root tone="elevated">
        <Card.Body>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Txt variant="label">Contract summaries</Txt>
            <Badge tone="accent" dot>
              Running
            </Badge>
          </View>
          <Progress label="Contract summaries" value={64} size="sm" />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Button variant="primary" label="Open" onPress={() => {}} />
            <Button variant="secondary" label="Pause" onPress={() => {}} />
          </View>
        </Card.Body>
      </Card.Root>
    </View>
  );
}
