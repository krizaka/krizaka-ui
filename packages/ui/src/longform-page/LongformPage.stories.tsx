import type { Meta, StoryObj } from "@storybook/react-vite";

import CaseStudyExample from "../../registry/examples/longform-page/case-study";
import StoryExample from "../../registry/examples/longform-page/story";
import { LongformPage } from "./longform-page";

/** Longform page — a page template. Each story renders a named example, on a desktop and on a phone. */
const meta = {
  title: "Templates/LongformPage",
  component: LongformPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LongformPage>;
export default meta;

type Story = StoryObj;

export const Story: Story = { render: () => <StoryExample /> };
/** On a phone (390 × 844). */
export const StoryPhone: Story = { render: () => <StoryExample />, parameters: { phone: true } };
export const CaseStudy: Story = { render: () => <CaseStudyExample /> };
/** On a phone (390 × 844). */
export const CaseStudyPhone: Story = { render: () => <CaseStudyExample />, parameters: { phone: true } };
