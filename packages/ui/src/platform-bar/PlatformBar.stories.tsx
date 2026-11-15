import type { Meta, StoryObj } from "@storybook/react-vite";

import DemoExample from "../../registry/examples/platform-bar/demo";
import LiveExample from "../../registry/examples/platform-bar/live";

/** The platform's bar above a hosted page. Each story renders a named example of the registry, at the widths of a phone and a desktop. */
const meta = { title: "Primitives/PlatformBar", parameters: { layout: "fullscreen", noOverflow: true }, tags: ["pb3746"] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Demo360: Story = { render: () => <DemoExample />, parameters: { viewportWidth: 360 } };
export const Demo390: Story = { render: () => <DemoExample />, parameters: { viewportWidth: 390 } };
export const Demo1440: Story = { render: () => <DemoExample />, parameters: { viewportWidth: 1440 } };
export const Live390: Story = { render: () => <LiveExample />, parameters: { viewportWidth: 390 } };
export const Live1440: Story = { render: () => <LiveExample />, parameters: { viewportWidth: 1440 } };
