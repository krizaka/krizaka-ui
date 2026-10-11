import type { Meta, StoryObj } from "@storybook/react-vite";

import EndingsExample from "../../registry/examples/loader/endings";
import FetchFlowExample from "../../registry/examples/loader/fetch-flow";
import MinimalExample from "../../registry/examples/loader/minimal";
import OverlayExample from "../../registry/examples/loader/overlay";
import RegionHandoverExample from "../../registry/examples/loader/region-handover";
import UploadEtaExample from "../../registry/examples/loader/upload-eta";
import { Loader } from "./loader";

/** A wait from start to end, and the region that hands over to a skeleton. Each story renders a named example. */
const meta = {
  title: "Primitives/Loader",
  component: Loader,
  args: { label: "Loading" },
} satisfies Meta<typeof Loader>;
export default meta;

type Story = StoryObj<typeof meta>;

export const FetchFlow: Story = { render: () => <FetchFlowExample /> };
export const RegionHandover: Story = { render: () => <RegionHandoverExample /> };
export const UploadEta: Story = { render: () => <UploadEtaExample /> };
export const Overlay: Story = { render: () => <OverlayExample /> };
export const Endings: Story = { render: () => <EndingsExample /> };
export const Minimal: Story = { render: () => <MinimalExample /> };
