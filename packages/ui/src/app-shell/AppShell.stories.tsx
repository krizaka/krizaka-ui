import type { Meta, StoryObj } from "@storybook/react-vite";

import AdminConsoleExample from "../../registry/examples/app-shell/admin-console";
import BasicExample from "../../registry/examples/app-shell/basic";
import OrochiaStudioExample from "../../registry/examples/app-shell/orochia-studio";
import { AppShellRoot } from "./app-shell";

/** App shell — a layout. Each story renders a named example; a template has its phone story too. */
const meta = {
  title: "Layouts/AppShell",
  component: AppShellRoot,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppShellRoot>;
export default meta;

type Story = StoryObj;

export const OrochiaStudio: Story = { render: () => <OrochiaStudioExample /> };
/** The same template on a phone (390 × 844): the screenshot is taken at that width. */
export const OrochiaStudioPhone: Story = { render: () => <OrochiaStudioExample />, parameters: { phone: true } };
export const AdminConsole: Story = { render: () => <AdminConsoleExample /> };
/** The same template on a phone (390 × 844): the screenshot is taken at that width. */
export const AdminConsolePhone: Story = { render: () => <AdminConsoleExample />, parameters: { phone: true } };
export const Basic: Story = { render: () => <BasicExample /> };
