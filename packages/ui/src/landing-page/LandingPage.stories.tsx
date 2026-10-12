import type { Meta, StoryObj } from "@storybook/react-vite";

import KrizakaExample from "../../registry/examples/landing-page/krizaka";
import { LandingPage } from "./landing-page";

/** Landing page — a page template. Each story renders a named example, on a desktop and on a phone. */
const meta = {
  title: "Templates/LandingPage",
  component: LandingPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LandingPage>;
export default meta;

type Story = StoryObj;

export const Krizaka: Story = { render: () => <KrizakaExample /> };
/** On a phone (390 × 844). */
export const KrizakaPhone: Story = { render: () => <KrizakaExample />, parameters: { phone: true } };
