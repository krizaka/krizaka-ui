import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/drop-overlay/default";
import { DropOverlay } from "./drop-overlay";

/** The drop overlay. Each story renders a named example of the registry (`registry/examples/drop-overlay/*`). */
const meta = { title: "Primitives/DropOverlay", component: DropOverlay, args: { label: "Déposez", onFiles: () => {} } } satisfies Meta<typeof DropOverlay>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
