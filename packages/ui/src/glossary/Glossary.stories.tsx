import type { Meta, StoryObj } from "@storybook/react-vite";

import ShopTermsExample from "../../registry/examples/glossary/shop-terms";
import { Glossary } from "./glossary";

const meta = {
  title: "Blocks/Glossary",
  component: Glossary,
} satisfies Meta<typeof Glossary>;
export default meta;

type Story = StoryObj;

export const ShopTerms: Story = { render: () => <ShopTermsExample />, parameters: { phone: true } };
