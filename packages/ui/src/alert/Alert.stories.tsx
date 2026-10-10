import type { Meta, StoryObj } from "@storybook/react-vite";

import DangerExample from "../../registry/examples/alert/danger";
import InfoExample from "../../registry/examples/alert/info";
import SuccessExample from "../../registry/examples/alert/success";
import TitleOnlyExample from "../../registry/examples/alert/title-only";
import WarningExample from "../../registry/examples/alert/warning";
import { Alert } from "./alert";

/**
 * A message in the flow of the page: `tone` info · success · warning · danger, an `icon` slot, a `title`, the text, an
 * `action`. danger and warning are `role="alert"`, info and success `role="status"`. Each story renders a named
 * example of the registry (`registry/examples/alert/*`): the code krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Primitives/Alert",
  component: Alert,
  args: { title: "New payout schedule" },
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

export const Info: Story = { render: () => <InfoExample /> };
export const Success: Story = { render: () => <SuccessExample /> };
export const Warning: Story = { render: () => <WarningExample /> };
export const Danger: Story = { render: () => <DangerExample /> };
export const TitleOnly: Story = { render: () => <TitleOnlyExample /> };
