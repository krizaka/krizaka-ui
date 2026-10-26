import type { Meta, StoryObj } from "@storybook/react-vite";

import DevelopmentExample from "../../registry/examples/environment-notice/development";
import StagingExample from "../../registry/examples/environment-notice/staging";

/** Environment notice. Each story renders a named example of the registry. */
const meta = { title: "Blocks/EnvironmentNotice", parameters: { layout: "padded" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Development: Story = { render: () => <DevelopmentExample /> };
export const Staging: Story = { render: () => <StagingExample /> };
