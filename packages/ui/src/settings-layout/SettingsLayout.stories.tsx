import type { Meta, StoryObj } from "@storybook/react-vite";

import AccountExample from "../../registry/examples/settings-layout/account";
import FlatExample from "../../registry/examples/settings-layout/flat";
import GroupedExample from "../../registry/examples/settings-layout/grouped";
import SectionsExample from "../../registry/examples/settings-layout/sections";
import { SettingsLayout } from "./settings-layout";

/** Settings layout — a layout. Each story renders a named example; a template has its phone story too. */
const meta = {
  title: "Layouts/SettingsLayout",
  component: SettingsLayout,
  parameters: { layout: "padded" },
} satisfies Meta<typeof SettingsLayout>;
export default meta;

type Story = StoryObj;

export const Account: Story = { render: () => <AccountExample /> };
/** The same template on a phone (390 × 844): the screenshot is taken at that width. */
export const AccountPhone: Story = { render: () => <AccountExample />, parameters: { phone: true } };
/** A private space with eight sections: grouped in the sidebar, one menu on a phone (390 × 844). */
export const Grouped: Story = { render: () => <GroupedExample /> };
export const GroupedPhone: Story = { render: () => <GroupedExample />, parameters: { phone: true } };
export const Sections: Story = { render: () => <SectionsExample /> };
export const Flat: Story = { render: () => <FlatExample /> };
/** The calm variant on a phone (390 × 844). */
export const FlatPhone: Story = { render: () => <FlatExample />, parameters: { phone: true } };
