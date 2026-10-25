import type { Meta, StoryObj } from "@storybook/react-vite";

import CoverageExample from "../../registry/examples/grade-stamp/coverage";
import LighthouseExample from "../../registry/examples/grade-stamp/lighthouse";
import { GradeStamp } from "./grade-stamp";

/** GradeStamp — a retro block of the Krizaka style. Each story renders a named example. */
const meta = {
  title: "Blocks/GradeStamp",
  component: GradeStamp,
} satisfies Meta<typeof GradeStamp>;
export default meta;

type Story = StoryObj;

export const Coverage: Story = { render: () => <CoverageExample /> };
export const Lighthouse: Story = { render: () => <LighthouseExample /> };
