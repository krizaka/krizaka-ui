import type { Meta, StoryObj } from "@storybook/react-vite";

import StatusSetExample from "../../registry/examples/kind-config-editor/native/status-set";
import TagSetExample from "../../registry/examples/kind-config-editor/native/tag-set";
import { nativeFrame } from "./story-frame";

/** Native — the admin's editors (#690). Each story renders a named example of the registry (`registry/examples/kind-config-editor/native/*`). */
const meta = { title: "Native/KindConfigEditor", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const TagSet: Story = { render: () => <TagSetExample /> };
export const StatusSet: Story = { render: () => <StatusSetExample /> };
