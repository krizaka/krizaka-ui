import type { Meta, StoryObj } from "@storybook/react-vite";

import Showcase from "../registry/showcase";

/**
 * The showcase krizaka.com/docs/ui shows first: a mosaic of real primitives in the Krizaka material and its griffe,
 * the brand and the theme switched live (`registry/showcase/index.tsx`).
 */
const meta = {
  title: "Showcase/Mosaic",
  component: Showcase,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Showcase>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Showcase className="m-4" /> };
export const Orazaka: Story = { render: () => <Showcase className="m-4" defaultBrand="orazaka" /> };
export const Orochia: Story = { render: () => <Showcase className="m-4" defaultBrand="orochia" /> };
