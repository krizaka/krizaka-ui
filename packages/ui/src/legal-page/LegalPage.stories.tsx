import type { Meta, StoryObj } from "@storybook/react-vite";

import PrivacyExample from "../../registry/examples/legal-page/privacy";
import { LegalPage } from "./legal-page";

/** Legal page — a page template. Each story renders a named example, on a desktop and on a phone. */
const meta = {
  title: "Templates/LegalPage",
  component: LegalPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LegalPage>;
export default meta;

type Story = StoryObj;

export const Privacy: Story = { render: () => <PrivacyExample /> };
/** On a phone (390 × 844). */
export const PrivacyPhone: Story = { render: () => <PrivacyExample />, parameters: { phone: true } };
