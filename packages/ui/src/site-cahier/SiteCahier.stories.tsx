import type { Meta, StoryObj } from "@storybook/react-vite";

import JavaReleasesExample from "../../registry/examples/site-cahier/java-releases";
import MotionLabExample from "../../registry/examples/site-cahier/motion-lab";
import TsChangelogExample from "../../registry/examples/site-cahier/ts-changelog";
import TsDocExample from "../../registry/examples/site-cahier/ts-doc";
import UiHomeExample from "../../registry/examples/site-cahier/ui-home";
import { SiteCahier } from "./site-cahier";

/** SiteCahier — a retro block of the Krizaka style. Each story renders a named example. */
const meta = {
  title: "Templates/SiteCahier",
  component: SiteCahier,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SiteCahier>;
export default meta;

type Story = StoryObj;

export const UiHome: Story = { render: () => <UiHomeExample /> };
/** On a phone (390 × 844). */
export const UiHomePhone: Story = { render: () => <UiHomeExample />, parameters: { phone: true } };
export const JavaReleases: Story = { render: () => <JavaReleasesExample /> };
/** On a phone (390 × 844). */
export const JavaReleasesPhone: Story = { render: () => <JavaReleasesExample />, parameters: { phone: true } };
export const MotionLab: Story = { render: () => <MotionLabExample /> };
/** On a phone (390 × 844). */
export const MotionLabPhone: Story = { render: () => <MotionLabExample />, parameters: { phone: true } };
export const TsDoc: Story = { render: () => <TsDocExample /> };
/** On a phone (390 × 844). */
export const TsDocPhone: Story = { render: () => <TsDocExample />, parameters: { phone: true } };
export const TsChangelog: Story = { render: () => <TsChangelogExample /> };
/** On a phone (390 × 844). */
export const TsChangelogPhone: Story = { render: () => <TsChangelogExample />, parameters: { phone: true } };
