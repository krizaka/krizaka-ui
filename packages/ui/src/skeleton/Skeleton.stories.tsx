import type { Meta, StoryObj } from "@storybook/react-vite";

import CircleExample from "../../registry/examples/skeleton/circle";
import CompositionExample from "../../registry/examples/skeleton/composition";
import RectExample from "../../registry/examples/skeleton/rect";
import TextExample from "../../registry/examples/skeleton/text";
import { Skeleton } from "./skeleton";

/**
 * A placeholder the shape of what is loading (decorative: announce the wait elsewhere). Still under reduced motion.
 * Each story renders a named example of the registry (`registry/examples/skeleton/*`): the code krizaka.com/docs/ui shows.
 */
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

export const Text: Story = { render: () => <TextExample /> };
export const Circle: Story = { render: () => <CircleExample /> };
export const Rect: Story = { render: () => <RectExample /> };
export const Composition: Story = { render: () => <CompositionExample /> };
