import type { Meta, StoryObj } from "@storybook/react-vite";

import VerifiedExample from "../../registry/examples/verified-badge/native/verified";
import { nativeFrame } from "./story-frame";

/** Native — VerifiedBadge. Each story renders a named example of the registry (`registry/examples/verified-badge/native/*`). */
const meta = { title: "Native/VerifiedBadge", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Verified: Story = { render: () => <VerifiedExample /> };
