import type { Meta, StoryObj } from "@storybook/react-vite";

import ExpandableExample from "../../registry/examples/rail-nav/expandable";
import StudioExample from "../../registry/examples/rail-nav/studio";

/** RailNav + AppHeader — a navigation. Each story renders a named example; the studio has its phone story (the tab bar). */
const meta = { title: "Navigation/RailNav", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Studio: Story = { render: () => <StudioExample /> };
/** The same template on a phone (390 × 844): the rail is the tab bar, the header carries the mark. */
export const StudioPhone: Story = { render: () => <StudioExample />, parameters: { phone: true } };
export const Expandable: Story = { render: () => <ExpandableExample /> };
