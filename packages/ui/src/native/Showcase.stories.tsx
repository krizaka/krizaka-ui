import type { Meta, StoryObj } from "@storybook/react-vite";

import SlidesExample from "../../registry/examples/showcase/native/slides";
import { nativeFrame } from "./story-frame";

/** Native — Showcase. Each story renders a named example of the registry (`registry/examples/showcase/native/*`). */
const meta = { title: "Native/Showcase", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Slides: Story = { render: () => <SlidesExample /> };
