import type { Meta, StoryObj } from "@storybook/react-vite";

import EmptyExample from "../../registry/examples/mascot-state/empty";
import ErrorExample from "../../registry/examples/mascot-state/error";
import LoadingExample from "../../registry/examples/mascot-state/loading";
import SuccessExample from "../../registry/examples/mascot-state/success";
import WelcomeExample from "../../registry/examples/mascot-state/welcome";
import { MascotState } from "./mascot-state";

/**
 * A moment told by a bird of the flock: nothing yet, it failed, done, a long task, welcome. Each story renders a named
 * example of the registry (`registry/examples/mascot-state/*`). Still in the screenshots (reduced motion).
 */
const meta = {
  title: "Primitives/MascotState",
  component: MascotState,
  args: { title: "No messages yet" },
} satisfies Meta<typeof MascotState>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = { render: () => <EmptyExample /> };
const ErrorStory: Story = { render: () => <ErrorExample /> };
export const Success: Story = { render: () => <SuccessExample /> };
export const Loading: Story = { render: () => <LoadingExample /> };
export const Welcome: Story = { render: () => <WelcomeExample /> };

export { ErrorStory as Error };
