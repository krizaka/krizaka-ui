import type { Meta, StoryObj } from "@storybook/react-vite";

import ClientsExample from "../../registry/examples/catalogue-page/clients";
import ComponentsExample from "../../registry/examples/catalogue-page/components";
import { CataloguePage } from "./catalogue-page";

/** Catalogue page — a page template. Each story renders a named example, on a desktop and on a phone. */
const meta = {
  title: "Templates/CataloguePage",
  component: CataloguePage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CataloguePage>;
export default meta;

type Story = StoryObj;

export const Components: Story = { render: () => <ComponentsExample /> };
/** On a phone (390 × 844). */
export const ComponentsPhone: Story = { render: () => <ComponentsExample />, parameters: { phone: true } };
export const Clients: Story = { render: () => <ClientsExample /> };
export const ClientsPhone: Story = { render: () => <ClientsExample />, parameters: { phone: true } };
