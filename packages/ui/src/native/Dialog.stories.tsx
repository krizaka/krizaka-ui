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

/**
 * Captured on the viewport. react-native-web draws the `Modal` as the page's dialog and gives it its `dialog` role only
 * once it is the active modal — the audit can land between the two (aria-modal and the name on a plain element); the
 * native platforms use `accessibilityViewIsModal` and the content's heading instead. Exception reviewed in DS4.
 */
const OVERLAY = { capture: "viewport", a11y: { config: { rules: [{ id: "aria-allowed-attr", enabled: false }, { id: "aria-dialog-name", enabled: false }] } } };

export const Confirm: Story = { render: () => <ConfirmExample defaultOpen />, parameters: OVERLAY };
export const Form: Story = { render: () => <FormExample defaultOpen />, parameters: OVERLAY };
