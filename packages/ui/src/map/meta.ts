import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Map",
  summary:
    "Maps that cost nothing per view — MapLibre (open source) over Protomaps tiles on the Krizaka CDN, painted from the tokens in dark or light and in the product's accent — with markers, clusters, the person's position, a radius and a location picker.",
  status: "beta",
  category: "data-display",
  platforms: "both",
  whenToUse: [
    "To show where things are: pick-up points, creators near you, an event's venue.",
    "`Cluster` for many points (dozens to thousands): they group while close and open by zooming in.",
    "`LocationPicker` to choose a place: a meeting point, a delivery address, the centre of a search with its radius.",
    "`StaticMap` where a live map is too much (a card, a list, an e-mail) and as the `fallback` of every `Map`.",
  ],
  whenNotToUse: [
    { when: "For an address typed or searched: a text field (geocoding is a server's job — Nominatim or Photon self-hosted later), the map only confirms it.", use: "field" },
    { when: "For figures by country or region (a choropleth): a chart.", use: "stat" },
  ],
  bestPractices: [
    "Give every map a `label` and every marker a `label`: they are read as the list of places in place of the map.",
    "Always pass a `fallback` (`StaticMap` with the same centre and places): it shows while the engine loads and for good without WebGL.",
    "Ask for the position only on a press (`LocationPicker`'s Near me), never on load; every refusal has its words.",
    "Keep the attribution visible (OpenStreetMap's licence, the ODbL, asks for it): the components draw it.",
    "Install the engine only where a map is shown: `maplibre-gl` (web) or `@maplibre/maplibre-react-native` (Expo) — optional peers.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "The map (a region named by `label`), then its buttons: zoom, the markers that do something, Near me." },
      { keys: "Arrow keys", action: "Pan the focused map." },
      { keys: "+ / −", action: "Zoom the focused map in or out." },
    ],
    notes: [
      "The canvas is hidden from assistive technologies: the places are read as a list (each `Marker`, `Cluster` point and the person's position by its `label`).",
      "A marker with `onPress` is a button named by its label (`aria-pressed` when it can be chosen); the chosen one shows its name above it.",
      "Under reduced motion the camera jumps instead of flying and the position's pulse stands still.",
      "Colours come from the tokens: the water is the accent softened, roads and labels the text roles — readable in both schemes.",
    ],
  },
  related: ["dialog", "search-field", "chip"],
  web: {
    imports: ["Map", "Marker", "Cluster", "UserPosition", "RadiusCircle", "LocationPicker", "StaticMap", "mapStyle", "distanceMeters", "formatDistance"],
    examples: [
      { name: "places", title: "Places", description: "Pick-up points in Montréal: markers are buttons, the chosen one shows its name." },
      { name: "cluster", title: "Cluster", description: "Sixty creators grouped while they are close; a group opens by zooming in." },
      { name: "location-picker", title: "Location picker", description: "A meeting point under the pin, its distance from the person, a 1-km zone and Near me." },
      { name: "static", title: "Static map", description: "The places on the map's paper, without an engine: a card, a list item, a fallback." },
    ],
  },
  native: {
    entry: "@krizaka/ui/native/map",
    imports: ["Map", "Marker", "Cluster", "UserPosition", "RadiusCircle", "LocationPicker"],
    differences: [
      "MapLibre Native (`@maplibre/maplibre-react-native`, an optional peer, with its Expo config plugin): the same style and tiles as the web — it reads `pmtiles://` itself.",
      "A marker's details open in a `Sheet` (`@krizaka/ui/native`); markers and Near me play a haptic.",
      "Near me asks the system's permission through MapLibre's `LocationManager` when pressed; the app declares the location usage in its config.",
      "The map's name lists its places for VoiceOver and TalkBack; the screenshots of these stories are drawn by a stand-in (the markers placed, not the tiles).",
    ],
    examples: [
      { name: "places", title: "Places", description: "Pick-up points: a marker pressed opens its details in a bottom sheet." },
      { name: "location-picker", title: "Location picker", description: "A meeting point under the pin; Near me on request." },
    ],
  },
} satisfies ComponentMeta;
