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

/**
 * Captured on the viewport. react-native-web draws the `Modal` as the page's dialog and gives it its `dialog` role only
 * once it is the active modal — the audit can land between the two (aria-modal and the name on a plain element); the
 * native platforms use `accessibilityViewIsModal` and the content's heading instead. Exception reviewed in DS4.
 */
const OVERLAY = { capture: "viewport", a11y: { config: { rules: [{ id: "aria-allowed-attr", enabled: false }, { id: "aria-dialog-name", enabled: false }] } } };

export const Comments: Story = { render: () => <CommentsExample defaultOpen />, parameters: OVERLAY };
export const Filters: Story = { render: () => <FiltersExample defaultOpen />, parameters: OVERLAY };
