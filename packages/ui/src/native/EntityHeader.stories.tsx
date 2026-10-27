import type { Meta, StoryObj } from "@storybook/react-vite";

import BasicExample from "../../registry/examples/entity-header/native/basic";
import { nativeFrame } from "./story-frame";

/** Native — the head of an entity, name and description edited in place. Each story renders a named example of the registry. */
const meta = { title: "Native/EntityHeader", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: () => <BasicExample /> };
