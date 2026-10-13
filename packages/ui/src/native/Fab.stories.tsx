import type { Meta, StoryObj } from "@storybook/react-vite";

import ExtendedExample from "../../registry/examples/fab/native/extended";
import { nativeFrame } from "./story-frame";

/**
 * Native — Fab. Each story renders a named example of the registry (`registry/examples/fab/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/Fab", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Extended: Story = { render: () => <ExtendedExample /> };
