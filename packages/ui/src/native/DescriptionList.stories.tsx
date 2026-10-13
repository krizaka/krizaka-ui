import type { Meta, StoryObj } from "@storybook/react-vite";

import JobDetailsExample from "../../registry/examples/description-list/native/job-details";
import { nativeFrame } from "./story-frame";

/** Native — DescriptionList. Each story renders a named example of the registry (`registry/examples/description-list/native/*`). */
const meta = { title: "Native/DescriptionList", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const JobDetails: Story = { render: () => <JobDetailsExample /> };
