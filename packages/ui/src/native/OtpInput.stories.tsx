import type { Meta, StoryObj } from "@storybook/react-vite";

import InvalidExample from "../../registry/examples/otp-input/native/invalid";
import VerifyExample from "../../registry/examples/otp-input/native/verify";
import { nativeFrame } from "./story-frame";

/**
 * Native — OtpInput. Each story renders a named example of the registry (`registry/examples/otp-input/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/OtpInput", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Verify: Story = { render: () => <VerifyExample /> };
export const Invalid: Story = { render: () => <InvalidExample /> };
