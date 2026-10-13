import type { Meta, StoryObj } from "@storybook/react-vite";

import Example from "../../registry/examples/field/native/default";
import { nativeFrame } from "./story-frame";

/**
 * Native — TextField through react-native-web. Each story renders a named example of the registry
 * (`registry/examples/field/native/*`): the code krizaka.com/docs/ui shows, with these screenshots.
 */
const meta = {
  title: "Native/Field",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Example /> };
