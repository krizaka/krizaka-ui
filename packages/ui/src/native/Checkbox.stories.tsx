import type { Meta, StoryObj } from "@storybook/react-vite";

import ConsentExample from "../../registry/examples/checkbox/native/consent";
import { nativeFrame } from "./story-frame";

/**
 * Native — Checkbox. Each story renders a named example of the registry (`registry/examples/checkbox/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/Checkbox", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Consent: Story = { render: () => <ConsentExample /> };
