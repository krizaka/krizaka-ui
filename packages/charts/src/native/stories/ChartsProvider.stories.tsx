import type { Meta, StoryObj } from "@storybook/react-vite";

import FrenchOrazakaExample from "../../../registry/examples/charts-provider/native/french-orazaka";
import { chartsNativeFrame } from "./frame";

/** Native — Charts provider. Each story renders a named example of the registry: the code krizaka.com/docs/ui shows. */
const meta = { title: "Charts Native/ChartsProvider", decorators: [chartsNativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const FrenchOrazaka: Story = { render: () => <FrenchOrazakaExample /> };
