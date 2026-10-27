import type { Meta, StoryObj } from "@storybook/react-vite";

import SignupExample from "../../registry/examples/form-flow/native/signup";
import { nativeFrame } from "./story-frame";

/** Native — FormFlow: a form in steps on a screen. */
const meta = { title: "Native/FormFlow", decorators: [nativeFrame], parameters: { contain: true } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Signup: Story = { render: () => <SignupExample /> };
