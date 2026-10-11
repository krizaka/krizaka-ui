import type { Meta, StoryObj } from "@storybook/react-vite";

import JobsExample from "../../registry/examples/data-table/native/jobs";
import { nativeFrame } from "./story-frame";

/**
 * Native — DataTable. Each story renders a named example of the registry (`registry/examples/data-table/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/DataTable", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Jobs: Story = { render: () => <JobsExample /> };
