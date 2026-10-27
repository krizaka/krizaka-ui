import type { Meta, StoryObj } from "@storybook/react-vite";

import CalendarFeedExample from "../../registry/examples/qr-code/native/calendar-feed";
import { nativeFrame } from "./story-frame";

/** Native — a QR code drawn from a text, dark on a light tile. Each story renders a named example of the registry. */
const meta = { title: "Native/QrCode", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const CalendarFeed: Story = { render: () => <CalendarFeedExample /> };
