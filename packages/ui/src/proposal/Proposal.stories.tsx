import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import DefaultExample from "../../registry/examples/proposal/default";
import { ProposalReview } from "./proposal-review";

/** `ProposalReview` and `DiffView`: an agent proposes, a person decides. Each story renders the named example. */
const meta = {
  title: "Blocks/ProposalReview",
  component: ProposalReview,
  args: { agent: "", summary: "", confidence: { level: "high" as const, label: "" }, state: "waiting" as const, words: {} as never, onApprove: () => {}, onReject: () => {} },
} satisfies Meta<typeof ProposalReview>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DefaultExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Approve" }));
    await expect(await canvas.findByText("Approved")).toBeVisible();
  },
};
/** On a phone (390 × 844): the buttons and the diff lines wrap. */
export const Phone: Story = { render: () => <DefaultExample />, parameters: { phone: true } };
