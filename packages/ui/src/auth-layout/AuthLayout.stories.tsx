import type { Meta, StoryObj } from "@storybook/react-vite";

import OnboardingExample from "../../registry/examples/auth-layout/onboarding";
import SignInExample from "../../registry/examples/auth-layout/sign-in";
import VerifyExample from "../../registry/examples/auth-layout/verify";
import { AuthLayout } from "./auth-layout";

/** Auth layout — a layout. Each story renders a named example; a template has its phone story too. */
const meta = {
  title: "Layouts/AuthLayout",
  component: AuthLayout,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AuthLayout>;
export default meta;

type Story = StoryObj;

export const SignIn: Story = { render: () => <SignInExample /> };
/** The same template on a phone (390 × 844): the screenshot is taken at that width. */
export const SignInPhone: Story = { render: () => <SignInExample />, parameters: { phone: true } };
export const Onboarding: Story = { render: () => <OnboardingExample /> };
/** The same template on a phone (390 × 844): the screenshot is taken at that width. */
export const OnboardingPhone: Story = { render: () => <OnboardingExample />, parameters: { phone: true } };
export const Verify: Story = { render: () => <VerifyExample /> };
