import type { Meta, StoryObj } from "@storybook/react-vite";

import ConfirmExample from "../../registry/examples/dialog/native/confirm";
import FormExample from "../../registry/examples/dialog/native/form";
import { nativeFrame } from "./story-frame";

/**
 * Native — Dialog. Each story renders a named example of the registry (`registry/examples/dialog/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it. Opened at load (`defaultOpen`), captured on the viewport.
 */
const meta = { title: "Native/Dialog", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Confirm: Story = { render: () => <ConfirmExample defaultOpen />, parameters: { capture: "viewport" } };
export const Form: Story = { render: () => <FormExample defaultOpen />, parameters: { capture: "viewport" } };
