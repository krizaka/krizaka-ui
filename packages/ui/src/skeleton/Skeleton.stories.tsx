import type { Meta, StoryObj } from "@storybook/react-vite";

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
export const Composition: Story = {
  render: () => (
    <div className="flex flex-col gap-3 rounded-xl border border-border-default bg-surface-1 p-4">
      <Skeleton shape="rect" className="h-32" />
      <div className="flex items-center gap-3">
        <Skeleton shape="circle" className="h-8" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton />
          <Skeleton className="w-2/3" />
        </div>
      </div>
    </div>
  ),
};
