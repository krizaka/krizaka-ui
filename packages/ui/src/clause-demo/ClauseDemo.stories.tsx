import type { Meta, StoryObj } from "@storybook/react-vite";

import LeaseExample from "../../registry/examples/clause-demo/lease";
import { ClauseDemo } from "./clause-demo";

/** ClauseDemo — the lines the visitor touches and what the check said of each. */
const meta = {
  title: "Blocks/ClauseDemo",
  component: ClauseDemo,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ClauseDemo>;
export default meta;

type Story = StoryObj;

export const Lease: Story = { render: () => <LeaseExample /> };
/** On a phone (390 × 844): the answer under the document. */
export const LeasePhone: Story = { render: () => <LeaseExample />, parameters: { phone: true } };
