import type { Meta, StoryObj } from "@storybook/react-vite";

import CreditsQuotaExample from "../../../registry/examples/gauge/native/credits-quota";
import { chartsNativeFrame } from "./frame";

/** Native — Gauge. Each story renders a named example of the registry: the code krizaka.com/docs/ui shows. */
const meta = { title: "Charts Native/Gauge", decorators: [chartsNativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const CreditsQuota: Story = { render: () => <CreditsQuotaExample /> };
