import type { Meta, StoryObj } from "@storybook/react-vite";

import TeamExample from "../../registry/examples/contact-page/team";
import { ContactPage } from "./contact-page";

/** Contact page — a page template. Each story renders a named example, on a desktop and on a phone. */
const meta = {
  title: "Templates/ContactPage",
  component: ContactPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ContactPage>;
export default meta;

type Story = StoryObj;

export const Team: Story = { render: () => <TeamExample /> };
/** On a phone (390 × 844). */
export const TeamPhone: Story = { render: () => <TeamExample />, parameters: { phone: true } };
