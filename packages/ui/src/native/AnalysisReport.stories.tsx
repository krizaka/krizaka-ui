import type { Meta, StoryObj } from "@storybook/react-vite";

import DocumentValidationExample from "../../registry/examples/analysis-report/native/document-validation";
import { nativeFrame } from "./story-frame";

/** Native — the result of an AI analysis. Each story renders a named example of the registry. */
const meta = { title: "Native/AnalysisReport", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const DocumentValidation: Story = { render: () => <DocumentValidationExample /> };
