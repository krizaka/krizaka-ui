import type { Meta, StoryObj } from "@storybook/react-vite";

import ReleasesExample from "../../registry/examples/changelog-page/releases";
import { ChangelogPage } from "./changelog-page";

/** Changelog page — a page template. Each story renders a named example, on a desktop and on a phone. */
const meta = {
  title: "Templates/ChangelogPage",
  component: ChangelogPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ChangelogPage>;
export default meta;

type Story = StoryObj;

export const Releases: Story = { render: () => <ReleasesExample /> };
/** On a phone (390 × 844). */
export const ReleasesPhone: Story = { render: () => <ReleasesExample />, parameters: { phone: true } };
