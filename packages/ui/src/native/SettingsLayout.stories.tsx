import type { Meta, StoryObj } from "@storybook/react-vite";

import AccountExample from "../../registry/examples/settings-layout/native/account";
import { nativeFrame } from "./story-frame";

/** Native — a phone's settings: a titled group of rows. Each story renders a named example of the registry. */
const meta = { title: "Native/SettingsLayout", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Account: Story = { render: () => <AccountExample /> };
