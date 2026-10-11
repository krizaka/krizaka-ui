import type { Meta, StoryObj } from "@storybook/react-vite";

import VisibilityExample from "../../registry/examples/radio-group/native/visibility";
import { nativeFrame } from "./story-frame";

/**
 * Native — RadioGroup. Each story renders a named example of the registry (`registry/examples/radio-group/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/RadioGroup", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Visibility: Story = { render: () => <VisibilityExample /> };
