import type { Meta, StoryObj } from "@storybook/react-vite";

import KrizakaExample from "../../registry/examples/landing-page/krizaka";
import ShowcaseExample from "../../registry/examples/landing-page/showcase";
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

/** A text-only hero on the quiet backdrop, a full-width carousel between the proofs and the features. */
export const Showcase: Story = { render: () => <ShowcaseExample /> };
/** The same, on a phone (390 × 844). */
export const ShowcasePhone: Story = { render: () => <ShowcaseExample />, parameters: { phone: true } };
