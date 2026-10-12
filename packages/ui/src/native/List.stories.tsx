import type { Meta, StoryObj } from "@storybook/react-vite";
import { View } from "react-native";

import DefaultExample from "../../registry/examples/list/native/default";
import InfiniteExample from "../../registry/examples/list/native/infinite";
import StatesExample from "../../registry/examples/list/native/states";
import { nativeFrame } from "./story-frame";

/**
 * Native — List (FlashList v2) through react-native-web. Each story renders a named example of the registry
 * (`registry/examples/list/native/*`): the code krizaka.com/docs/ui shows, with these screenshots.
 */
const meta = {
  title: "Native/List",
  // A screen's size inside the frame: FlashList measures its parent.
  decorators: [
    (Story) => (
      <View style={{ width: 328, height: 400 }}>
        <Story />
      </View>
    ),
    nativeFrame,
  ],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
/** `useInfiniteList` on a fake paginated API (`configureKrizakaFetch`): the Expo story of the list. */
export const Infinite: Story = { render: () => <InfiniteExample /> };
export const States: Story = { render: () => <StatesExample /> };
