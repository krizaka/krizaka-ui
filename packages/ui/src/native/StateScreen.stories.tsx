import type { Meta, StoryObj } from "@storybook/react-vite";

import EmptyExample from "../../registry/examples/state-screen/native/empty";
import ErrorExample from "../../registry/examples/state-screen/native/error";
import OfflineExample from "../../registry/examples/state-screen/native/offline";
import { nativeFrame } from "./story-frame";

/** Native — StateScreen: empty, error, offline. */
const meta = { title: "Native/StateScreen", decorators: [nativeFrame], parameters: { contain: true } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = { render: () => <EmptyExample /> };
const Failure: Story = { render: () => <ErrorExample /> };
// Exported as `Error` (the story's id is `error`, as the example's name): a variable of that name is refused.
export { Failure as Error };
export const Offline: Story = { render: () => <OfflineExample /> };
