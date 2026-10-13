import type { Meta, StoryObj } from "@storybook/react-vite";

import InterestsExample from "../../registry/examples/tag-selector/native/interests";
import { nativeFrame } from "./story-frame";

/** Native — TagSelector. Each story renders a named example of the registry (`registry/examples/tag-selector/native/*`). */
const meta = { title: "Native/TagSelector", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Interests: Story = { render: () => <InterestsExample /> };
