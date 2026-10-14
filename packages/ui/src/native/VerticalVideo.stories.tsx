import type { Meta, StoryObj } from "@storybook/react-vite";

import RailExample from "../../registry/examples/vertical-video/native/rail";
import { nativeFrame } from "./story-frame";

/** Native — VerticalVideo through react-native-web (the poster stands for the clip). Each story renders a named example. */
// Text over a photo: axe cannot know the picture's pixels. The pair is the platform's invariant `textOnMedia` over `scrim`.
const meta = { title: "Native/VerticalVideo", decorators: [nativeFrame], parameters: { a11y: { test: "off" } } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Rail: Story = { render: () => <RailExample /> };
