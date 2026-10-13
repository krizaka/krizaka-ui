import type { Meta, StoryObj } from "@storybook/react-vite";

import JobDetailsExample from "../../registry/examples/description-list/job-details";
import KeyValueGridExample from "../../registry/examples/description-list/key-value-grid";
import ReceiptExample from "../../registry/examples/description-list/receipt";

/** DescriptionList. Each story renders a named example of the registry (`registry/examples/description-list/*`): the code krizaka.com/docs/ui shows. */
const meta = { title: "Primitives/DescriptionList" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const JobDetails: Story = { render: () => <JobDetailsExample /> };
export const Receipt: Story = { render: () => <ReceiptExample /> };
export const KeyValueGrid: Story = { render: () => <KeyValueGridExample /> };
