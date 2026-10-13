import type { Meta, StoryObj } from "@storybook/react-vite";

import MultipleExample from "../../registry/examples/combobox/native/multiple";
import SearchExample from "../../registry/examples/combobox/native/search";
import { nativeFrame } from "./story-frame";

/**
 * Native — Combobox through react-native-web. Each story renders a named example of the registry
 * (`registry/examples/combobox/native/*`): the code krizaka.com/docs/ui shows, with these screenshots.
 */
const meta = {
  title: "Native/Combobox",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Search: Story = { render: () => <SearchExample /> };
export const Multiple: Story = { render: () => <MultipleExample /> };
