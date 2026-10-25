import type { Meta, StoryObj } from "@storybook/react-vite";

import CheckoutExample from "../../registry/examples/detail-layout/checkout";
import ClientExample from "../../registry/examples/detail-layout/client";
import JobExample from "../../registry/examples/detail-layout/job";
import NewInvoiceExample from "../../registry/examples/detail-layout/new-invoice";
import ProfileExample from "../../registry/examples/detail-layout/profile";
import VideoExample from "../../registry/examples/detail-layout/video";
import { DetailLayout } from "./detail-layout";

/** Detail layout — a layout. Each story renders a named example; a template has its phone story too. */
const meta = {
  title: "Layouts/DetailLayout",
  component: DetailLayout,
  parameters: { layout: "padded" },
} satisfies Meta<typeof DetailLayout>;
export default meta;

type Story = StoryObj;

export const Video: Story = { render: () => <VideoExample /> };
/** The same template on a phone (390 × 844): the screenshot is taken at that width. */
export const VideoPhone: Story = { render: () => <VideoExample />, parameters: { phone: true } };
export const Job: Story = { render: () => <JobExample /> };
export const Checkout: Story = { render: () => <CheckoutExample /> };
/** On a phone (390 × 844). */
export const CheckoutPhone: Story = { render: () => <CheckoutExample />, parameters: { phone: true } };
/** `cover`: a person's page, the header as a ProfileBanner (#650), and on a phone. */
export const Profile: Story = { render: () => <ProfileExample /> };
export const ProfilePhone: Story = { render: () => <ProfileExample />, parameters: { phone: true } };
export const Client: Story = { render: () => <ClientExample /> };
export const ClientPhone: Story = { render: () => <ClientExample />, parameters: { phone: true } };
export const NewInvoice: Story = { render: () => <NewInvoiceExample /> };
/** The StickyAction in task mode, with the total. */
export const NewInvoicePhone: Story = { render: () => <NewInvoiceExample />, parameters: { phone: true } };
