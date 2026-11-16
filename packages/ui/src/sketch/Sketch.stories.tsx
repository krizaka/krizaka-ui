import type { Meta, StoryObj } from "@storybook/react-vite";

import BeforeAfterExample from "../../registry/examples/sketch/before-after";
import DesktopExample from "../../registry/examples/sketch/desktop";
import HatchExample from "../../registry/examples/sketch/hatch";
import PhoneExample from "../../registry/examples/sketch/phone";
import { Sketch } from "./sketch";

/** Sketch — a Cahier block. Each story renders a named example of the registry, at a laptop's 1440 and a phone's 390. */
const meta = { title: "Blocks/Sketch", component: Sketch } satisfies Meta<typeof Sketch>;
export default meta;

type Story = StoryObj;

const wide = { viewportWidth: 1440 };
const phone = { phone: true, noOverflow: true };
export const Desktop: Story = { render: () => <DesktopExample />, parameters: wide };
export const DesktopPhone: Story = { render: () => <DesktopExample />, parameters: phone };
export const Phone: Story = { render: () => <PhoneExample />, parameters: wide };
export const PhonePhone: Story = { render: () => <PhoneExample />, parameters: phone };
export const BeforeAfter: Story = { render: () => <BeforeAfterExample />, parameters: wide };
export const BeforeAfterPhone: Story = { render: () => <BeforeAfterExample />, parameters: phone };
export const Hatch: Story = { render: () => <HatchExample />, parameters: wide };
export const HatchPhone: Story = { render: () => <HatchExample />, parameters: phone };
