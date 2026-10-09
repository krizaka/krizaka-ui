import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button/button";
import { Alert } from "./alert";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const INFO = icon("M12 16v-4M12 8h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z");
const CHECK = icon("M20 6 9 17l-5-5");
const WARN = icon("M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z");

/**
 * A message in the flow of the page: `tone` info · success · warning · danger, an `icon` slot, a `title`, the text, an
 * `action`. danger and warning are `role="alert"` (announced at once), info and success `role="status"`. Soft tones:
 * the text stays a text role, the tint, the border and the icon carry the tone.
 */
const meta = {
  title: "Primitives/Alert",
  component: Alert,
  args: { title: "New payout schedule", children: "Payouts now arrive every Monday.", icon: INFO },
  decorators: [
    (Story) => (
      <div className="w-[32rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Success: Story = { args: { tone: "success", icon: CHECK, title: "Account verified", children: "You can now receive payouts." } };

export const Warning: Story = {
  args: { tone: "warning", icon: WARN, title: "Low balance", children: "Two tips left before a top-up.", action: <Button size="sm">Top up</Button> },
};

export const Danger: Story = {
  args: { tone: "danger", icon: WARN, title: "Payment failed", children: "The card was declined. Try another one.", action: <Button size="sm" variant="danger">Retry</Button> },
};

/** A title only, no icon. */
export const TitleOnly: Story = { args: { icon: undefined, children: undefined } };
