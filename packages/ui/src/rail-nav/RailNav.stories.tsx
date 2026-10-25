import type { Meta, StoryObj } from "@storybook/react-vite";

import ExpandableExample from "../../registry/examples/rail-nav/expandable";
import ShortcutsExample from "../../registry/examples/rail-nav/shortcuts";
import StudioExample from "../../registry/examples/rail-nav/studio";

/** RailNav + AppHeader — a navigation. Each story renders a named example; the studio has its phone story (the tab bar). */
const meta = { title: "Navigation/RailNav", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Studio: Story = { render: () => <StudioExample /> };
/** The same template on a phone (390 × 844): the rail is the tab bar, the header carries the mark. */
export const StudioPhone: Story = { render: () => <StudioExample />, parameters: { phone: true } };
export const Expandable: Story = { render: () => <ExpandableExample /> };
/** Shortcuts (#647): at 1440 px the rail is expanded by default, its « Shortcuts » group above the toggle; at 1024 px it is narrow. */
export const Shortcuts: Story = { render: () => <ShortcutsExample />, parameters: { viewportWidth: 1440, noOverflow: true } };
export const ShortcutsNarrow: Story = { render: () => <ShortcutsExample />, parameters: { viewportWidth: 1024, noOverflow: true } };
