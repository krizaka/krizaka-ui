import type { Meta, StoryObj } from "@storybook/react-vite";

import FeedExample from "../../registry/examples/media-grid/native/feed";
import ListExample from "../../registry/examples/media-grid/native/list";
import { nativeFrame } from "./story-frame";

/** Native — a media section that never staggers: a Shorts shelf for the 9:16, a uniform grid for the rest (`registry/examples/media-grid/native/*`). */
const meta = { title: "Native/MediaGrid", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Feed: Story = { render: () => <FeedExample /> };
export const List: Story = { render: () => <ListExample /> };
