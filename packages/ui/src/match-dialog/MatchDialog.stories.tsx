import type { Meta, StoryObj } from "@storybook/react-vite";

import ItsAMatchExample from "../../registry/examples/match-dialog/its-a-match";

/** MatchDialog. Each story renders a named example of the registry (`registry/examples/match-dialog/*`): the code ui.krizaka.com shows. */
const meta = { title: "Primitives/MatchDialog" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const ItsAMatch: Story = { render: () => <ItsAMatchExample defaultOpen />, parameters: { capture: "viewport" } };
