import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/upload-queue/default";
import TrayExample from "../../registry/examples/upload-queue/tray";
import { UploadQueue } from "./upload-queue";

/** The upload queue. Each story renders a named example of the registry (`registry/examples/upload-queue/*`). */
const meta = { title: "Primitives/UploadQueue", component: UploadQueue, args: { label: "Vérifications", items: [] } } satisfies Meta<typeof UploadQueue>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Queue: Story = { render: () => <DefaultExample /> };
export const Tray: Story = { render: () => <TrayExample />, parameters: { layout: "fullscreen" } };
