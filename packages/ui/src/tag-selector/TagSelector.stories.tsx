import type { Meta, StoryObj } from "@storybook/react-vite";

import CreatableExample from "../../registry/examples/tag-selector/creatable";
import InterestsExample from "../../registry/examples/tag-selector/interests";

/** TagSelector. Each story renders a named example of the registry (`registry/examples/tag-selector/*`): the code ui.krizaka.com shows. */
const meta = { title: "Primitives/TagSelector" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Interests: Story = { render: () => <InterestsExample /> };
/** `creatable` (#627): the tags of a workspace with their markers; type to narrow, Enter creates in the colour chosen. */
export const Creatable: Story = { render: () => <CreatableExample /> };
