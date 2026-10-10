import type { Meta, StoryObj } from "@storybook/react-vite";

import AccentExample from "../../registry/examples/badge/accent";
import DangerExample from "../../registry/examples/badge/danger";
import MediumExample from "../../registry/examples/badge/medium";
import NeutralExample from "../../registry/examples/badge/neutral";
import ScrimExample from "../../registry/examples/badge/scrim";
import SuccessExample from "../../registry/examples/badge/success";
import WarningExample from "../../registry/examples/badge/warning";
import { Badge } from "./badge";

/**
 * A short status. `tone` × `size`, an optional `dot` (pulsing with `pulse`); the tone is exposed as `data-tone`.
 * Each story renders a named example of the registry (`registry/examples/badge/*`).
 */
const meta = {
  title: "Primitives/Badge",
  component: Badge,
} satisfies Meta<typeof Badge>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Neutral: Story = { render: () => <NeutralExample /> };
export const Accent: Story = { render: () => <AccentExample /> };
export const Success: Story = { render: () => <SuccessExample /> };
export const Warning: Story = { render: () => <WarningExample /> };
export const Danger: Story = { render: () => <DangerExample /> };
export const Scrim: Story = { render: () => <ScrimExample /> };
export const Medium: Story = { render: () => <MediumExample /> };
