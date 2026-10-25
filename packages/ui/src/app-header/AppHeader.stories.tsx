import type { Meta, StoryObj } from "@storybook/react-vite";

import BasicExample from "../../registry/examples/app-header/basic";
import FamilyExample from "../../registry/examples/app-header/family";

/** AppHeader. Each story renders a named example of the registry (`registry/examples/app-header/*`). */
const meta = { title: "Navigation/AppHeader", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: () => <BasicExample /> };
export const BasicPhone: Story = { render: () => <BasicExample />, parameters: { phone: true } };
export const Family: Story = { render: () => <FamilyExample /> };
export const FamilyPhone: Story = { render: () => <FamilyExample />, parameters: { phone: true } };
