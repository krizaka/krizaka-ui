// The native map on MapLibre Native (a stand-in under Jest): the style from the tokens, markers as buttons, the places in
// the map's name, Near me's permission flow.
import { describe, expect, test } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import * as React from "react";

import { LocationPicker, Map, Marker } from "./map";
import { LocationManager } from "./mocks/maplibre";

describe("native Map", () => {
  test("its style from the tokens, its places in its name, a marker a button", async () => {
    const pressed: string[] = [];
    await render(
      <Map label="Pick-up points" center={[-73.58, 45.52]}>
        <Marker position={[-73.6, 45.52]} label="Café Olimpico" onPress={() => pressed.push("olimpico")} />
      </Map>,
    );
    const map = screen.getByTestId("maplibre-map");
    expect(map.props.mapStyle.sources.region.url).toMatch(/^pmtiles:\/\//);
    await waitFor(() => expect(screen.getByTestId("maplibre-map").props["aria-label"]).toBe("Pick-up points: Café Olimpico"));
    await fireEvent.press(screen.getByRole("button", { name: "Café Olimpico" }));
    expect(pressed).toEqual(["olimpico"]);
    expect(screen.getByText("Protomaps · © OpenStreetMap contributors")).toBeTruthy();
  });

  test("Near me asks the permission when pressed: refused, then granted with the distance", async () => {
    const values: unknown[] = [];
    LocationManager.permission = false;
    await render(<LocationPicker label="Meeting point" locale="en-CA" value={[-73.5673, 45.5017]} onValueChange={(v) => values.push(v)} />);
    await fireEvent.press(screen.getByRole("button", { name: "Near me" }));
    expect(await screen.findByText("Location is off for this app. Move the map instead.")).toBeTruthy();
    LocationManager.permission = true;
    await fireEvent.press(screen.getByRole("button", { name: "Near me" }));
    await waitFor(() => expect(values).toEqual([[-73.58, 45.52]]));
    expect(await screen.findByText(/km from you$/)).toBeTruthy();
  });
});
