import type { Meta, StoryObj } from "@storybook/react-vite";

import MobileShowcase from "../../registry/showcase/mobile";
import { nativeFrame } from "./story-frame";

/**
 * Native — the mobile showcase (`registry/showcase/mobile.tsx`): the material on @krizaka/ui/native. Its Linux
 * screenshots are copied beside it by the build and shown on krizaka.com/docs/ui.
 */
const meta = {
  title: "Native/Showcase",
  component: MobileShowcase,
  decorators: [nativeFrame],
} satisfies Meta<typeof MobileShowcase>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Mobile: Story = { render: () => <MobileShowcase /> };
