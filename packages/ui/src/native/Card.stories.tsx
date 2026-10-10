import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { View } from "react-native";

import { Badge } from "./badge";
import { Button } from "./button";
import { Card } from "./card";
import { nativeFrame } from "./story-frame";
import { BellIcon } from "./story-icons";
import { Txt } from "./txt";

/** Native — `Card.Root/Media/Image/Overlay/Body/Title/Description/Footer` on View, Image and Text. */
const meta = {
  title: "Native/Card",
  component: Card.Root,
  decorators: [nativeFrame],
} satisfies Meta<typeof Card.Root>;
export default meta;

type Story = StoryObj<typeof meta>;

const content = (
  <>
    <Card.Media>
      <Card.Image src={null} fallback={<BellIcon size={32} />} />
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
  </>
);

/** A media, a body, a footer. */
export const Default: Story = { render: () => <Card.Root style={{ width: 300 }}>{content}</Card.Root> };

/** `tone="elevated"`: one step higher, with a shadow. */
export const Elevated: Story = { render: () => <Card.Root tone="elevated" style={{ width: 300 }}>{content}</Card.Root> };

/** `onPress`: the whole card is a button, named by its content. */
export const Pressable: Story = {
  render: () => (
    <Card.Root onPress={() => undefined} style={{ width: 300 }}>
      <Card.Body>
        <Card.Title>Night set — vol. 4</Card.Title>
        <Card.Description>Tap anywhere on the card.</Card.Description>
      </Card.Body>
    </Card.Root>
  ),
};

/** Text only, with an action. */
export const Body: Story = {
  render: () => (
    <Card.Root radius="lg" style={{ width: 300 }}>
      <Card.Body padding="lg">
        <Card.Title>Your wallet</Card.Title>
        <Card.Description>Top up to support the creators you follow.</Card.Description>
        <Button variant="primary" label="Top up" />
      </Card.Body>
    </Card.Root>
  ),
};
