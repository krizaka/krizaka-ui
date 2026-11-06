import type { Meta, StoryObj } from "@storybook/react-vite";

import FrenchSovkoraExample from "../../../registry/examples/charts-provider/native/french-sovkora";
import { chartsNativeFrame } from "./frame";

/** Native — Charts provider. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts Native/ChartsProvider", decorators: [chartsNativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const FrenchSovkora: Story = { render: () => <FrenchSovkoraExample /> };
