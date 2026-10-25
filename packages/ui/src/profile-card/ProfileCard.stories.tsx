import type { Meta, StoryObj } from "@storybook/react-vite";

import ArcadeExample from "../../registry/examples/profile-card/arcade";
import BannerExample from "../../registry/examples/profile-card/banner";
import CreatorExample from "../../registry/examples/profile-card/creator";
import MatchExample from "../../registry/examples/profile-card/match";
import { ProfileCard } from "./profile-card";

/** ProfileCard — the storytelling kit (story.css): sober by default, `variant="arcade"` opt-in. Each story renders a named example; still in the screenshots (reduced motion). */
const meta = {
  title: "Story/ProfileCard",
  component: ProfileCard,
} satisfies Meta<typeof ProfileCard>;
export default meta;

type Story = StoryObj;

export const Creator: Story = { render: () => <CreatorExample /> };
export const Match: Story = { render: () => <MatchExample /> };
export const Arcade: Story = { render: () => <ArcadeExample /> };
/** ProfileBanner (#650): a client's page — on a desktop, and at 360 px (no text over the cover, the avatar overlapping it). */
export const Banner: Story = { render: () => <BannerExample />, parameters: { layout: "padded" } };
export const BannerPhone: Story = { render: () => <BannerExample />, parameters: { phone: true } };
