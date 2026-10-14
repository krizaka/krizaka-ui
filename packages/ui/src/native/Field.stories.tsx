import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/field/native/default";
import SelectExample from "../../registry/examples/field/native/select";
import { nativeFrame } from "./story-frame";

/**
 * Native — Field through react-native-web. Each story renders a named example of the registry
 * (`registry/examples/field/native/*`): the code ui.krizaka.com shows, with these screenshots.
 */
const meta = {
  title: "Native/Field",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
export const Select: Story = { render: () => <SelectExample /> };
