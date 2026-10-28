import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import DefaultExample from "../../registry/examples/price-catalogue-editor/default";
import { PriceCatalogueEditor } from "./price-catalogue-editor";

/** `PriceCatalogueEditor`: an admin edits price entries from a date. Each story renders the named example. */
const meta = { title: "Blocks/PriceCatalogueEditor", component: PriceCatalogueEditor,
  args: { prices: { units: [], availabilities: [], entries: [] }, locale: "en-CA", today: "2026-10-28", onSchedule: async () => ({ ok: true as const }), words: {} as never },
} satisfies Meta<typeof PriceCatalogueEditor>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DefaultExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Change — Demo · Pro/ }));
    await expect(canvas.getByText("Current subscriptions keep their price.")).toBeVisible();
  },
};
/** The same block on a phone (390 × 844): one column, the chip and the button under the amount. */
export const Phone: Story = { render: () => <DefaultExample />, parameters: { phone: true } };
