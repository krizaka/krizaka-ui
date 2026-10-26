import type { Meta, StoryObj } from "@storybook/react-vite";

import TiktokExample from "../../registry/examples/embed-facade/tiktok";
import YoutubeExample from "../../registry/examples/embed-facade/youtube";

/** EmbedFacade: each story renders a named registry example. */
const meta = { title: "Primitives/EmbedFacade", tags: ["embed-facade"] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Youtube: Story = { render: () => <YoutubeExample /> };
export const Tiktok: Story = { render: () => <TiktokExample /> };
