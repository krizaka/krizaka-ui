import type { Meta, StoryObj } from "@storybook/react-vite";

import SignUpExample from "../../registry/examples/step-progress/sign-up";

/** StepProgress. Each story renders a named example of the registry (`registry/examples/step-progress/*`): the code krizaka.com/docs/ui shows. */
const meta = { title: "Primitives/StepProgress" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const SignUp: Story = { render: () => <SignUpExample /> };
