import type { Meta, StoryObj } from "@storybook/react-vite";

import GroupsExample from "../../registry/examples/docs-nav/groups";
import { DocsNav } from "./docs-nav";

/** Docs nav — navigation. Each story renders a named example. */
const meta = { title: "Navigation/DocsNav", component: DocsNav } satisfies Meta<typeof DocsNav>;
export default meta;

type Story = StoryObj;

export const Groups: Story = { render: () => <GroupsExample /> };
