import type { Meta, StoryObj } from "@storybook/react-vite";

import DeploymentRegionsExample from "../../registry/examples/globe/deployment-regions";
import { chartFrame } from "./frame";

/** Globe. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts/Globe", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const DeploymentRegions: Story = { render: () => <DeploymentRegionsExample /> };
