import type { Meta, StoryObj } from "@storybook/react-vite";

import BalanceExample from "../../registry/examples/number-ticker/native/balance";
import { nativeFrame } from "./story-frame";

/**
 * Native — NumberTicker. Each story renders a named example of the registry (`registry/examples/number-ticker/native/*`): the code
 * ui.krizaka.com shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/NumberTicker", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Balance: Story = { render: () => <BalanceExample /> };
