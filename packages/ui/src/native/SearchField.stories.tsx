import type { Meta, StoryObj } from "@storybook/react-vite";

import CancelExample from "../../registry/examples/search-field/native/cancel";
import DefaultExample from "../../registry/examples/search-field/native/default";
import { nativeFrame } from "./story-frame";

/**
 * Native — SearchField through react-native-web. Each story renders a named example of the registry
 * (`registry/examples/search-field/native/*`): the code krizaka.com/docs/ui shows, with these screenshots.
 */
const meta = {
  title: "Native/SearchField",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
export const Cancel: Story = { render: () => <CancelExample /> };
