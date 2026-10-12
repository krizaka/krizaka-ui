import type { Meta, StoryObj } from "@storybook/react-vite";

import KrizakaExample from "../../registry/examples/docs-hub-page/krizaka";
import { DocsHubPage } from "./docs-hub-page";

/** Docs hub page — a page template. Each story renders a named example, on a desktop and on a phone. */
const meta = {
  title: "Templates/DocsHubPage",
  component: DocsHubPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DocsHubPage>;
export default meta;

type Story = StoryObj;

export const Krizaka: Story = { render: () => <KrizakaExample /> };
/** On a phone (390 × 844). */
export const KrizakaPhone: Story = { render: () => <KrizakaExample />, parameters: { phone: true } };
