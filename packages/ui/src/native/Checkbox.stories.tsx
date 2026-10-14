import type { Meta, StoryObj } from "@storybook/react-vite";

import Example from "../../registry/examples/checkbox/native/terms";
import { nativeFrame } from "./story-frame";

/**
 * Native — Checkbox through react-native-web. Each story renders a named example of the registry
 * (`registry/examples/checkbox/native/*`): the code ui.krizaka.com shows, with these screenshots.
 */
const meta = {
  title: "Native/Checkbox",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Terms: Story = { render: () => <Example /> };
