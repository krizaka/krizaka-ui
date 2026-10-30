import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { axeViolations } from "../test/axe";
import { MapInfoCard, RouteCard, routeLinks } from "./cards";
import { MapSheet } from "./sheet";

const DEST: [number, number] = [-73.5673, 45.5017];
const FROM: [number, number] = [-73.58, 45.51];
const LABELS = { apple: "Apple Maps", google: "Google Maps", osm: "OpenStreetMap", waze: "Waze", transit: "Transit" };

describe("routeLinks", () => {
  it("writes latitude before longitude, from the (lng, lat) the map uses", () => {
    const l = routeLinks(DEST);
    expect(l.apple).toBe("https://maps.apple.com/?daddr=45.5017,-73.5673&dirflg=d");
    expect(l.google).toBe("https://www.google.com/maps/dir/?api=1&destination=45.5017,-73.5673&travelmode=driving");
    expect(l.waze).toBe("https://waze.com/ul?ll=45.5017,-73.5673&navigate=yes");
    expect(l.transit).toContain("travelmode=transit");
  });
  it("starts from the origin when it is known, in every app that takes one", () => {
    const l = routeLinks(DEST, FROM);
    expect(l.apple).toContain("saddr=45.51,-73.58");
    expect(l.google).toContain("origin=45.51,-73.58");
    expect(l.transit).toContain("origin=45.51,-73.58");
    expect(l.osm).toBe("https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=45.51,-73.58;45.5017,-73.5673");
  });
  it("without an origin, OSM shows the place instead of a route it cannot plan", () => {
    expect(routeLinks(DEST).osm).toBe("https://www.openstreetmap.org/?mlat=45.5017&mlon=-73.5673#map=16/45.5017/-73.5673");
  });
  it("rounds to a metre-level precision", () => {
    expect(routeLinks([-73.123456789, 45.987654321]).waze).toContain("ll=45.987654,-73.123457");
  });
});

describe("MapInfoCard", () => {
  it("renders only the fields it is given, title as a heading", async () => {
    const { container } = render(<MapInfoCard title="Atelier Rose" meta="Hair · 400 m" status="Open now" action={<a href="/shop">See the shop</a>} />);
    expect(screen.getByRole("heading", { level: 3, name: "Atelier Rose" })).toBeTruthy();
    expect(screen.getByText("Open now")).toBeTruthy();
    expect(screen.getByRole("link", { name: "See the shop" })).toBeTruthy();
    expect(container.querySelector("img")).toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });
  it("honours the heading level and shows a photo only when given one", () => {
    render(<MapInfoCard title="Café" titleLevel={2} photo={<img alt="The front" src="x.png" />} />);
    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
    expect(screen.getByAltText("The front")).toBeTruthy();
  });
});

describe("RouteCard", () => {
  it("lists one link per app, opened safely in a new tab, named by the host's words", async () => {
    const { container } = render(<RouteCard destination="Atelier Rose" position={DEST} directionsLabel="Directions" appLabels={LABELS} />);
    const links = screen.getAllByRole("link");
    expect(links.map((a) => a.textContent)).toEqual(["Apple Maps", "Google Maps", "OpenStreetMap", "Waze", "Transit"]);
    for (const a of links) {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    }
    expect(screen.getByRole("navigation", { name: "Directions" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
  it("shows only the times it is given and only the apps asked for", () => {
    render(<RouteCard destination="Atelier Rose" position={DEST} origin={FROM} directionsLabel="Directions" appLabels={LABELS} apps={["apple", "waze"]} times={[{ label: "On foot", value: "12 min" }]} />);
    expect(screen.getByText("On foot")).toBeTruthy();
    expect(screen.getByText("12 min")).toBeTruthy();
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Apple Maps" }).getAttribute("href")).toContain("saddr=");
  });
  it("draws no times row when there are none", () => {
    const { container } = render(<RouteCard destination="X" position={DEST} directionsLabel="Directions" appLabels={LABELS} times={[]} />);
    expect(container.querySelector("dl")).toBeNull();
  });
});

describe("MapSheet", () => {
  it("is non-modal: no dialog role, no trap, the page stays reachable", () => {
    render(<><button>behind</button><MapSheet label="Place details" handleLabel="Resize"><p>content</p></MapSheet></>);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("region", { name: "Place details" })).toBeTruthy();
    expect(document.querySelector("[inert]")).toBeNull();
    expect(screen.getByRole("button", { name: "behind" }).closest("[aria-hidden]")).toBeNull();
  });
  it("starts at its default snap and cycles on a press of the handle", async () => {
    const onSnapChange = vi.fn();
    render(<MapSheet label="Place" handleLabel="Resize" defaultSnap="half" onSnapChange={onSnapChange}>x</MapSheet>);
    const sheet = screen.getByRole("region");
    expect(sheet.getAttribute("data-snap")).toBe("half");
    await userEvent.click(screen.getByRole("button", { name: "Resize" }));
    expect(sheet.getAttribute("data-snap")).toBe("full");
    await userEvent.click(screen.getByRole("button", { name: "Resize" }));
    expect(sheet.getAttribute("data-snap")).toBe("peek");
    expect(onSnapChange.mock.calls.map((c) => c[0])).toEqual(["full", "peek"]);
  });
  it("steps with the arrows, jumps with Home / End and stops at the ends", async () => {
    render(<MapSheet label="Place" handleLabel="Resize">x</MapSheet>);
    const sheet = screen.getByRole("region");
    screen.getByRole("button", { name: "Resize" }).focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(sheet.getAttribute("data-snap")).toBe("half");
    await userEvent.keyboard("{ArrowUp}{ArrowUp}");
    expect(sheet.getAttribute("data-snap")).toBe("full");
    await userEvent.keyboard("{Home}");
    expect(sheet.getAttribute("data-snap")).toBe("peek");
    await userEvent.keyboard("{ArrowDown}");
    expect(sheet.getAttribute("data-snap")).toBe("peek");
    await userEvent.keyboard("{End}");
    expect(sheet.getAttribute("data-snap")).toBe("full");
  });
  it("is controlled when given a snap: it follows the prop, not its own state", async () => {
    const onSnapChange = vi.fn();
    render(<MapSheet label="Place" handleLabel="Resize" snap="peek" onSnapChange={onSnapChange}>x</MapSheet>);
    await userEvent.click(screen.getByRole("button", { name: "Resize" }));
    expect(onSnapChange).toHaveBeenCalledWith("half");
    expect(screen.getByRole("region").getAttribute("data-snap")).toBe("peek");
  });
  it("has no axe violations", async () => {
    const { container } = render(<MapSheet label="Place" handleLabel="Resize"><MapInfoCard title="Atelier" /></MapSheet>);
    expect(await axeViolations(container)).toEqual([]);
  });
});
