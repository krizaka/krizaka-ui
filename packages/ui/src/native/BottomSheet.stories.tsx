import type { Meta, StoryObj } from "@storybook/react-vite";

import CommentsExample from "../../registry/examples/bottom-sheet/native/comments";
import FiltersExample from "../../registry/examples/bottom-sheet/native/filters";
import { nativeFrame } from "./story-frame";

/**
 * Native — BottomSheet. Each story renders a named example of the registry (`registry/examples/bottom-sheet/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it. Opened at load (`defaultOpen`), captured on the viewport.
 */
const meta = { title: "Native/BottomSheet", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Comments: Story = { render: () => <CommentsExample defaultOpen />, parameters: { capture: "viewport" } };
export const Filters: Story = { render: () => <FiltersExample defaultOpen />, parameters: { capture: "viewport" } };
