import type { Meta, StoryObj } from "@storybook/react-vite";

import ContainersExample from "../../registry/examples/architecture-diagram/containers";
import ContextExample from "../../registry/examples/architecture-diagram/context";
import DynamicExample from "../../registry/examples/architecture-diagram/dynamic";
import { ArchitectureDiagram } from "./architecture-diagram";

/** ArchitectureDiagram. Each story renders a named example of the registry (`registry/examples/architecture-diagram/*`); the phone stories show the drawing scrolling in its frame. */
const meta = { title: "Data display/ArchitectureDiagram", component: ArchitectureDiagram } satisfies Meta<typeof ArchitectureDiagram>;
export default meta;

type Story = StoryObj;

export const Context: Story = { render: () => <ContextExample /> };
export const Containers: Story = { render: () => <ContainersExample /> };
export const Dynamic: Story = { render: () => <DynamicExample /> };
export const DynamicPhone: Story = { render: () => <DynamicExample />, parameters: { phone: true } };
export const ContainersPhone: Story = { render: () => <ContainersExample />, parameters: { phone: true } };
