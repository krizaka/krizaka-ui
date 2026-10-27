import type { Meta, StoryObj } from "@storybook/react-vite";

import AdminExample from "../../registry/examples/app-frame/admin";
import AppExample from "../../registry/examples/app-frame/app";

/** App frame — the one signed-in frame. Each story renders a named example; the phone story is the tab bar. */
const meta = { title: "Layouts/AppFrame", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const App: Story = { render: () => <AppExample /> };
/** The same frame on a phone (390 × 844): the rail is the tab bar, the top bar carries the mark and the account. */
export const AppPhone: Story = { render: () => <AppExample />, parameters: { phone: true } };
export const Admin: Story = { render: () => <AdminExample /> };
export const AdminPhone: Story = { render: () => <AdminExample />, parameters: { phone: true } };
