import type { Meta, StoryObj } from "@storybook/react-vite";

import GalleryExample from "../../registry/examples/image-viewer/native/gallery";
import { nativeFrame } from "./story-frame";

/**
 * Native — ImageViewer. Each story renders a named example of the registry (`registry/examples/image-viewer/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it. Opened at load (`defaultOpen`), captured on the viewport.
 */
const meta = { title: "Native/ImageViewer", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = { render: () => <GalleryExample defaultOpen />, parameters: { capture: "viewport" } };
