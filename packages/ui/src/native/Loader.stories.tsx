import type { Meta, StoryObj } from "@storybook/react-vite";

import BlockExample from "../../registry/examples/loader/native/block";
import JobWaitExample from "../../registry/examples/loader/native/job-wait";
import { nativeFrame } from "./story-frame";

/**
 * Native — Loader. Each story renders a named example of the registry (`registry/examples/loader/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/Loader", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const JobWait: Story = { render: () => <JobWaitExample /> };
export const Block: Story = { render: () => <BlockExample /> };
