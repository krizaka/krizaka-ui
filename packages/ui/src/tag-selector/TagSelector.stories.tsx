import type { Meta, StoryObj } from "@storybook/react-vite";

import InterestsExample from "../../registry/examples/tag-selector/interests";

/** TagSelector. Each story renders a named example of the registry (`registry/examples/tag-selector/*`): the code ui.krizaka.com shows. */
const meta = { title: "Primitives/TagSelector" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Interests: Story = { render: () => <InterestsExample /> };
