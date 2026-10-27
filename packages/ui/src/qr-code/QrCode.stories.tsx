import type { Meta, StoryObj } from "@storybook/react-vite";

import BasicExample from "../../registry/examples/qr-code/basic";
import CalendarFeedExample from "../../registry/examples/qr-code/calendar-feed";

/** QrCode. Each story renders a named example of the registry (`registry/examples/qr-code/*`): the code ui.krizaka.com shows. */
const meta = { title: "Primitives/QrCode" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: () => <BasicExample /> };
export const CalendarFeed: Story = { render: () => <CalendarFeedExample /> };
