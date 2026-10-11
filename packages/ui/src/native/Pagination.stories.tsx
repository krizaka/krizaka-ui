import type { Meta, StoryObj } from "@storybook/react-vite";

import CursorExample from "../../registry/examples/pagination/native/cursor";
import PagesExample from "../../registry/examples/pagination/native/pages";
import { nativeFrame } from "./story-frame";

/**
 * Native — Pagination through react-native-web. Each story renders a named example of the registry
 * (`registry/examples/pagination/native/*`): the code krizaka.com/docs/ui shows, with these screenshots.
 */
const meta = {
  title: "Native/Pagination",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Pages: Story = { render: () => <PagesExample /> };
export const Cursor: Story = { render: () => <CursorExample /> };
