import type { Meta, StoryObj } from "@storybook/react-vite";

import LocationPickerExample from "../../registry/examples/map/native/location-picker";
import PlacesExample from "../../registry/examples/map/native/places";
import { nativeFrame } from "./story-frame";

/**
 * Native — the map through react-native-web, MapLibre Native drawn by a stand-in (the markers placed on the map's paper):
 * each story renders a named example of the registry (`registry/examples/map/native/*`).
 */
const meta = {
  title: "Native/Map",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Places: Story = { render: () => <PlacesExample /> };
export const LocationPicker: Story = { render: () => <LocationPickerExample /> };
