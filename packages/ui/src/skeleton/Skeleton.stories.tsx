import type { Meta, StoryObj } from "@storybook/react-vite";

import SkeletonDemo from "../../registry/demos/skeleton";
import { Skeleton } from "./skeleton";

/** A placeholder the shape of what is loading (decorative: announce the wait elsewhere). Still under reduced motion. */
const meta = {
  title: "Primitives/Skeleton",
  component: Skeleton,
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Skeleton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Text: Story = {};

export const Circle: Story = { args: { shape: "circle" } };

export const Rect: Story = { args: { shape: "rect" } };

/** Shapes composed into a card being loaded. */
export const Composition: Story = { render: () => <SkeletonDemo /> };
