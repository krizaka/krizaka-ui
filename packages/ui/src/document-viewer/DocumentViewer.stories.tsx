import type { Meta, StoryObj } from "@storybook/react-vite";

import HighlightsExample from "../../registry/examples/document-viewer/highlights";

/** DocumentViewer: each story renders a named example of the registry (`registry/examples/document-viewer/*`). */
const meta = {
  title: "Primitives/DocumentViewer",
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

// pdf.js is loaded from a CDN at render time: the page is audited by axe, not screenshot-compared.
export const Highlights: Story = { render: () => <HighlightsExample />, parameters: { screenshot: false } };
