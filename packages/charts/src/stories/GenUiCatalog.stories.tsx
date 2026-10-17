import type { Meta, StoryObj } from "@storybook/react-vite";

import DashboardExample from "../../registry/examples/genui-catalog/dashboard";
import { chartFrame } from "./frame";

/** The generated view catalog (ADR-082). Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts/GenUiCatalog", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Dashboard: Story = { render: () => <DashboardExample /> };
