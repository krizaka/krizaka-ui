import type { Meta, StoryObj } from "@storybook/react-vite";

import DisclosureExample from "../../registry/examples/captcha/disclosure";
import FormExample from "../../registry/examples/captcha/form";
import { Captcha } from "./captcha";

/** Captcha — Cloudflare Turnstile, invisible unless a challenge is needed. Each story renders a named example (`registry/examples/captcha/*`). */
const meta = {
  title: "Primitives/Captcha",
  component: Captcha,
} satisfies Meta<typeof Captcha>;
export default meta;

type Story = StoryObj;

export const Form: Story = { render: () => <FormExample /> };
export const Disclosure: Story = { render: () => <DisclosureExample /> };
