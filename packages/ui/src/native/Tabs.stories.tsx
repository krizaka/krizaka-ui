import type { Meta, StoryObj } from "@storybook/react-vite";

import SectionsExample from "../../registry/examples/tabs/native/sections";
import SegmentedExample from "../../registry/examples/tabs/native/segmented";
import { nativeFrame } from "./story-frame";

/**
 * Native — Tabs. Each story renders a named example of the registry (`registry/examples/tabs/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/Tabs", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Sections: Story = { render: () => <SectionsExample /> };
export const Segmented: Story = { render: () => <SegmentedExample /> };
