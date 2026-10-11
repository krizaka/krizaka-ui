import type { Meta, StoryObj } from "@storybook/react-vite";

import CheckoutExample from "../../registry/examples/stepper/checkout";
import FailedExample from "../../registry/examples/stepper/failed";
import JobExample from "../../registry/examples/stepper/job";
import { Stepper } from "./stepper";

/** The steps of a journey or a job. Each story renders a named example. */
const meta = {
  title: "Primitives/Stepper",
  component: Stepper,
  args: { steps: [], labels: { done: "Done", current: "Current", upcoming: "Upcoming", error: "Failed" } },
} satisfies Meta<typeof Stepper>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Job: Story = { render: () => <JobExample /> };
export const Failed: Story = { render: () => <FailedExample /> };
export const Checkout: Story = { render: () => <CheckoutExample /> };
