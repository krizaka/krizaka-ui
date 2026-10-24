import type { Meta, StoryObj } from "@storybook/react-vite";

import DetailExample from "../../registry/examples/chapter/detail";
import FootExample from "../../registry/examples/chapter/foot";
import HeadExample from "../../registry/examples/chapter/head";
import IndexExample from "../../registry/examples/chapter/index";
import ReadingPageExample from "../../registry/examples/chapter/reading-page";
import { ChapterIndex } from "./chapter";

/** Chapter — the chapters of a story on the Cahier's lines (ADR-004, #617). Each story renders a named example. */
const meta = {
  title: "Blocks/Chapter",
  component: ChapterIndex,
} satisfies Meta<typeof ChapterIndex>;
export default meta;

type Story = StoryObj;

export const Index: Story = { render: () => <IndexExample /> };
export const IndexPhone: Story = { render: () => <IndexExample />, parameters: { viewportWidth: 360, noOverflow: true } };
export const Detail: Story = { render: () => <DetailExample /> };
export const Head: Story = { render: () => <HeadExample /> };
export const Foot: Story = { render: () => <FootExample /> };
export const ReadingPage: Story = { render: () => <ReadingPageExample /> };
export const ReadingPagePhone: Story = { render: () => <ReadingPageExample />, parameters: { viewportWidth: 360, noOverflow: true } };
