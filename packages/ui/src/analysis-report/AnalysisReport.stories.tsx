import type { Meta, StoryObj } from "@storybook/react-vite";

import AuthenticityExample from "../../registry/examples/analysis-report/authenticity";
import DocumentValidationExample from "../../registry/examples/analysis-report/document-validation";
import LeaseReviewExample from "../../registry/examples/analysis-report/lease-review";
import LongAddressExample from "../../registry/examples/analysis-report/long-address";
import StreamingExample from "../../registry/examples/analysis-report/streaming";

/** Analysis report. Each story renders a named example of the registry. */
const meta = { title: "Blocks/AnalysisReport", parameters: { layout: "padded" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const DocumentValidation: Story = { render: () => <DocumentValidationExample /> };
export const Streaming: Story = { render: () => <StreamingExample /> };
export const LeaseReview: Story = { render: () => <LeaseReviewExample /> };
export const Authenticity: Story = { render: () => <AuthenticityExample /> };
export const LongAddress: Story = { render: () => <div style={{ width: 360 }}><LongAddressExample /></div> };
