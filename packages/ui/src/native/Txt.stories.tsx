import type { Meta, StoryObj } from "@storybook/react-vite";

import TonesExample from "../../registry/examples/txt/native/tones";
import VariantsExample from "../../registry/examples/txt/native/variants";
import { nativeFrame } from "./story-frame";
import { Txt } from "./txt";

/**
 * Native — text in the platform's scale, coloured by a role of the theme (`variant` × `tone`).
 * Each story renders a named example of the registry (`registry/examples/txt/native/*`): the code krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Native/Txt",
  component: Txt,
  decorators: [nativeFrame],
  args: { children: "Every night, a new set." },
} satisfies Meta<typeof Txt>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = { render: () => <VariantsExample /> };
export const Tones: Story = { render: () => <TonesExample /> };
