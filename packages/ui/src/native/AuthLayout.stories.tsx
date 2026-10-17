import type { Meta, StoryObj } from "@storybook/react-vite";

import SignInExample from "../../registry/examples/auth-layout/native/sign-in";
import { nativeFrame } from "./story-frame";

/** Native — an entry screen: the mark, a title, the form, the other way, the fine print. Each story renders a named example of the registry (`registry/examples/auth-layout/native/*`). */
const meta = {
  title: "Native/AuthLayout",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const SignIn: Story = { render: () => <SignInExample /> };
