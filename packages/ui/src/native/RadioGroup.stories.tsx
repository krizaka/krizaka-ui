import type { Meta, StoryObj } from "@storybook/react-vite";

import ButtonsExample from "../../registry/examples/radio-group/native/buttons";
import CardsExample from "../../registry/examples/radio-group/native/cards";
import ListExample from "../../registry/examples/radio-group/native/list";
import SegmentedExample from "../../registry/examples/radio-group/native/segmented";
import { nativeFrame } from "./story-frame";

/**
 * Native — RadioGroup through react-native-web. Each story renders a named example of the registry
 * (`registry/examples/radio-group/native/*`): the code ui.krizaka.com shows, with these screenshots.
 */
const meta = {
  title: "Native/RadioGroup",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const List: Story = { render: () => <ListExample /> };
export const Buttons: Story = { render: () => <ButtonsExample /> };
export const Cards: Story = { render: () => <CardsExample /> };
export const Segmented: Story = { render: () => <SegmentedExample /> };
