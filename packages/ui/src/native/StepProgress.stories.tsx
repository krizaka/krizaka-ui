import type { Meta, StoryObj } from "@storybook/react-vite";

import SignUpExample from "../../registry/examples/step-progress/native/sign-up";
import { nativeFrame } from "./story-frame";

/** Native — StepProgress. Each story renders a named example of the registry (`registry/examples/step-progress/native/*`). */
const meta = { title: "Native/StepProgress", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const SignUp: Story = { render: () => <SignUpExample /> };
