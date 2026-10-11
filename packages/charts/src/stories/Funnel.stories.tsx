import type { Meta, StoryObj } from "@storybook/react-vite";

import SignupExample from "../../registry/examples/funnel/signup";
import { chartFrame } from "./frame";

/** Funnel. Each story renders a named example of the registry: the code krizaka.com/docs/ui shows. */
const meta = { title: "Charts/Funnel", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Signup: Story = { render: () => <SignupExample /> };
