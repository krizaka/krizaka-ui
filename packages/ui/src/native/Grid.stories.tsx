import type { Meta, StoryObj } from "@storybook/react-vite";
import { View } from "react-native";

import ColumnsExample from "../../registry/examples/grid/native/columns";
import PhotosExample from "../../registry/examples/grid/native/photos";
import StatsExample from "../../registry/examples/grid/native/stats";
import { Grid } from "./grid";
import { nativeFrame } from "./story-frame";
import { Txt } from "./txt";

/**
 * Native — Grid and Columns. A story per example, then each at the three size classes of the room it is given
 * (compact 360, regular 700, expanded 900 pt), in right-to-left, and with 200 % text. The containment check
 * (`parameters.contain`) fails the story if anything sticks out of the room.
 */
const meta = { title: "Native/Grid", decorators: [nativeFrame], parameters: { contain: true } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

const room = (width: number, node: React.ReactNode, dir?: "rtl") => (
  <View style={{ width, alignSelf: "stretch", direction: dir ?? "ltr" }}>
    {node}
  </View>
);

export const Photos: Story = { render: () => room(360, <PhotosExample />) };
export const PhotosRegular: Story = { render: () => room(700, <PhotosExample />) };
export const PhotosExpanded: Story = { render: () => room(900, <PhotosExample />) };
export const PhotosRtl: Story = { render: () => room(360, <PhotosExample />, "rtl") };

export const Stats: Story = { render: () => room(360, <StatsExample />) };
export const StatsRegular: Story = { render: () => room(700, <StatsExample />) };
export const StatsExpanded: Story = { render: () => room(900, <StatsExample />) };

export const Columns: Story = { render: () => room(360, <ColumnsExample />) };
export const ColumnsRegular: Story = { render: () => room(700, <ColumnsExample />) };

/** 200 % text: the grid lays out for twice the width an item needs, so the stats stack into one column. */
export const StatsLargeText: Story = {
  render: () =>
    room(
      360,
      <Grid columns={{ compact: 2, expanded: 4 }} minItemWidth={140} fontScale={2}>
        {["Files to decide", "Checks this month", "Credits left", "Average time"].map((label) => (
          <View key={label} style={{ padding: 14, gap: 4 }}>
            <Txt variant="caption" tone="secondary" style={{ fontSize: 24 }}>{label}</Txt>
            <Txt variant="title" style={{ fontSize: 40, lineHeight: 48 }}>58</Txt>
          </View>
        ))}
      </Grid>,
    ),
};
