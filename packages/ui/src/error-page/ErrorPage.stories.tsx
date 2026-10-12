import type { Meta, StoryObj } from "@storybook/react-vite";

import NotFoundExample from "../../registry/examples/error-page/not-found";
import { ErrorPage } from "./error-page";

/** Error page — a page template. Each story renders a named example, on a desktop and on a phone. */
const meta = {
  title: "Templates/ErrorPage",
  component: ErrorPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ErrorPage>;
export default meta;

type Story = StoryObj;

export const NotFound: Story = { render: () => <NotFoundExample /> };
/** On a phone (390 × 844). */
export const NotFoundPhone: Story = { render: () => <NotFoundExample />, parameters: { phone: true } };
