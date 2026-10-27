import type { Meta, StoryObj } from "@storybook/react-vite";

import BulletinBanner from "../../registry/examples/shop/bulletin-banner";
import BulletinBoard from "../../registry/examples/shop/bulletin-board";
import Faq from "../../registry/examples/shop/faq";
import Policies from "../../registry/examples/shop/policies";
import ReviewsQuote from "../../registry/examples/shop/reviews-quote";
import ReviewsStrip from "../../registry/examples/shop/reviews-strip";
import ReviewsSummaryCards from "../../registry/examples/shop/reviews-summary-cards";
import SocialFacade from "../../registry/examples/shop/social-facade";
import SocialLinks from "../../registry/examples/shop/social-links";
import StoryOwner from "../../registry/examples/shop/story-owner";
import StoryQuote from "../../registry/examples/shop/story-quote";
import TeamCards from "../../registry/examples/shop/team-cards";
import TeamRow from "../../registry/examples/shop/team-row";
import VideoShorts from "../../registry/examples/shop/video-shorts";
import VideoTv from "../../registry/examples/shop/video-tv";
import VisitCard from "../../registry/examples/shop/visit-card";
import VisitMap from "../../registry/examples/shop/visit-map";
import VisitSplit from "../../registry/examples/shop/visit-split";

/** Shop page, the rest of the catalogue (U2). Each story renders a named example of the registry. */
const meta = { title: "Primitives/ShopSections", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const VideoTv_: Story = { name: "Video · tv", render: () => <VideoTv />, parameters: { screenshot: false } };
export const VideoShorts_: Story = { name: "Video · shorts", render: () => <VideoShorts />, parameters: { screenshot: false } };
export const ReviewsSummaryCards_: Story = { name: "Reviews · score and cards", render: () => <ReviewsSummaryCards /> };
export const ReviewsQuote_: Story = { name: "Reviews · quote", render: () => <ReviewsQuote /> };
export const ReviewsStrip_: Story = { name: "Reviews · strip", render: () => <ReviewsStrip /> };
export const BulletinBoard_: Story = { name: "Bulletin · board", render: () => <BulletinBoard /> };
export const BulletinBanner_: Story = { name: "Bulletin · banner", render: () => <BulletinBanner /> };
export const TeamRow_: Story = { name: "Team · row", render: () => <TeamRow /> };
export const TeamCards_: Story = { name: "Team · cards", render: () => <TeamCards /> };
export const VisitCard_: Story = { name: "Visit · card", render: () => <VisitCard /> };
export const VisitMap_: Story = { name: "Visit · map", render: () => <VisitMap />, parameters: { screenshot: false } };
export const VisitSplit_: Story = { name: "Visit · split", render: () => <VisitSplit />, parameters: { screenshot: false } };
export const StoryQuote_: Story = { name: "Story · quote", render: () => <StoryQuote /> };
export const StoryOwner_: Story = { name: "Story · owner", render: () => <StoryOwner /> };
export const SocialLinks_: Story = { name: "Social · links", render: () => <SocialLinks /> };
export const SocialFacade_: Story = { name: "Social · facade", render: () => <SocialFacade /> };
export const Faq_: Story = { name: "Questions", render: () => <Faq /> };
export const Policies_: Story = { name: "Policies", render: () => <Policies /> };
export const VisitMapPhone: Story = { name: "Visit · map (phone)", render: () => <VisitMap />, parameters: { phone: true, noOverflow: true } };
export const ReviewsSummaryCardsPhone: Story = { name: "Reviews · score and cards (phone)", render: () => <ReviewsSummaryCards />, parameters: { phone: true, noOverflow: true } };
export const FaqPhone: Story = { name: "Questions (phone)", render: () => <Faq />, parameters: { phone: true, noOverflow: true } };
export const BulletinBoardPhone: Story = { name: "Bulletin · board (phone)", render: () => <BulletinBoard />, parameters: { phone: true, noOverflow: true } };
