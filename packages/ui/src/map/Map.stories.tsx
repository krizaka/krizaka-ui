import type { Meta, StoryObj } from "@storybook/react-vite";

import ClusterExample from "../../registry/examples/map/cluster";
import LocationPickerExample from "../../registry/examples/map/location-picker";
import PlacesExample from "../../registry/examples/map/places";
import StaticExample from "../../registry/examples/map/static";

/**
 * Map: each story renders a named example of the registry (`registry/examples/map/*`) — the code ui.krizaka.com shows.
 * The live maps are audited but not screenshot-compared: their picture is WebGL over tiles from the CDN, which the
 * runner refuses (stories never touch the network); `Static` is the deterministic picture.
 */
const meta = { title: "Primitives/Map" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Places: Story = { render: () => <PlacesExample />, parameters: { screenshot: false } };
export const Cluster: Story = { render: () => <ClusterExample />, parameters: { screenshot: false } };
export const LocationPicker: Story = { render: () => <LocationPickerExample />, parameters: { screenshot: false } };
export const Static: Story = { render: () => <StaticExample /> };
