import type { Meta, StoryObj } from "@storybook/react-vite";

import SheetExample from "../../registry/examples/dialog/native/sheet";
import { nativeFrame } from "./story-frame";

/**
 * Native — Dialog (the bottom sheet) through react-native-web. Each story renders a named example of the registry
 * (`registry/examples/dialog/native/*`): the code ui.krizaka.com shows, with these screenshots.
 */
const meta = {
  title: "Native/Dialog",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

// react-native-web draws React Native's Modal as an unnamed dialog around the sheet (the sheet itself is the named
// dialog): its outer container is the web renderer's, not ours — on iOS and Android the Modal is the platform's.
export const Sheet: Story = {
  render: () => <SheetExample defaultOpen />,
  parameters: { capture: "viewport", a11y: { config: { rules: [{ id: "aria-dialog-name", enabled: false }] } } },
};
