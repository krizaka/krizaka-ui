import type { Meta, StoryObj } from "@storybook/react-vite";

import AtRestExample from "../../registry/examples/terminal-replay/at-rest";
import SessionExample from "../../registry/examples/terminal-replay/session";
import { TerminalReplay } from "./terminal-replay";

/** A terminal session played back, or at rest. Each story renders a named example. */
const meta = {
  title: "Primitives/TerminalReplay",
  component: TerminalReplay,
  args: { steps: [], label: "", playLabel: "", pauseLabel: "", replayLabel: "" },
} satisfies Meta<typeof TerminalReplay>;
export default meta;

type Story = StoryObj<typeof meta>;

// Typed over time: its picture depends on when it is taken — audited, not screenshot-compared (the at-rest story is).
export const Session: Story = { render: () => <SessionExample />, parameters: { screenshot: false } };
export const AtRest: Story = { render: () => <AtRestExample /> };
