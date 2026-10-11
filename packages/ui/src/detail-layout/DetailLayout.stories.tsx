import type { Meta, StoryObj } from "@storybook/react-vite";

import JobExample from "../../registry/examples/detail-layout/job";
import VideoExample from "../../registry/examples/detail-layout/video";
import { DetailLayout } from "./detail-layout";

/** Detail layout — a layout. Each story renders a named example; a template has its phone story too. */
const meta = {
  title: "Layouts/DetailLayout",
  component: DetailLayout,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DetailLayout>;
export default meta;

type Story = StoryObj;

export const Video: Story = { render: () => <VideoExample /> };
/** The same template on a phone (390 × 844): the screenshot is taken at that width. */
export const VideoPhone: Story = { render: () => <VideoExample />, parameters: { phone: true } };
export const Job: Story = { render: () => <JobExample /> };
