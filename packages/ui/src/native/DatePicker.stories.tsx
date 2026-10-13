import type { Meta, StoryObj } from "@storybook/react-vite";

import Example from "../../registry/examples/date-picker/native/birth-date";
import { nativeFrame } from "./story-frame";

/**
 * Native — DateField through react-native-web. Each story renders a named example of the registry
 * (`registry/examples/date-picker/native/*`): the code krizaka.com/docs/ui shows, with these screenshots.
 */
const meta = {
  title: "Native/DatePicker",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const BirthDate: Story = { render: () => <Example /> };
