import type { Meta, StoryObj } from "@storybook/react-vite";

import LargeTitleExample from "../../registry/examples/header/native/large-title";
import { nativeFrame } from "./story-frame";

/**
 * Native — Header. Each story renders a named example of the registry (`registry/examples/header/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/Header", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const LargeTitle: Story = { render: () => <LargeTitleExample /> };
