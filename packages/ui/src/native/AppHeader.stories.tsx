import type { Meta, StoryObj } from "@storybook/react-vite";

import FamilyExample from "../../registry/examples/app-header/native/family";
import { nativeFrame } from "./story-frame";

/** Native — AppHeader. Each story renders a named example of the registry (`registry/examples/app-header/native/*`). */
const meta = { title: "Native/AppHeader", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Family: Story = { render: () => <FamilyExample /> };
