import type { Meta, StoryObj } from "@storybook/react-vite";

import LibraryExample from "../../registry/examples/desktop-window/library";

/** Desktop window — a layout. The window at its size classes: compact (900), regular (1280), expanded (1680). */
const meta = { title: "Layouts/DesktopWindow", parameters: { layout: "fullscreen", contain: true } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Library: Story = { render: () => <LibraryExample />, parameters: { viewportWidth: 1280 } };
export const LibraryCompact: Story = { render: () => <LibraryExample />, parameters: { viewportWidth: 900 } };
export const LibraryExpanded: Story = { render: () => <LibraryExample />, parameters: { viewportWidth: 1680 } };
