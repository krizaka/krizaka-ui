import type { Meta, StoryObj } from "@storybook/react-vite";

import DocumentValidationExample from "../../registry/examples/analysis-report/document-validation";
import StreamingExample from "../../registry/examples/analysis-report/streaming";

/** Analysis report. Each story renders a named example of the registry. */
const meta = { title: "Blocks/AnalysisReport", parameters: { layout: "padded" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const DocumentValidation: Story = { render: () => <DocumentValidationExample /> };
export const Streaming: Story = { render: () => <StreamingExample /> };
