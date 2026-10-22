import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Chip } from "../chip";
import { ChoiceGrid } from "../choice-grid";
import { Tabs } from "../tabs";
import { readRouteValue, useRouteState, writeRouteValue } from "./index";

const TYPES = ["auto", "lease", "contract"] as const;

function Probe() {
  const [type, setType] = useRouteState("type", { values: TYPES, default: "auto" });
  return (
    <button type="button" onClick={() => setType("lease")}>
      {type}
    </button>
  );
}

beforeEach(() => window.history.replaceState(null, "", "/app/verify"));

describe("useRouteState", () => {
  it.each([
    ["", "auto"],
    ["?type=lease", "lease"],
    ["?type=nonsense", "auto"],
    ["?other=1&type=contract", "contract"],
  ])("reads %s as %s (an unknown value reads as the default)", (search, expected) => {
    expect(readRouteValue(search, "type", { values: TYPES, default: "auto" })).toBe(expected);
  });

  it.each([
    ["", "lease", "?type=lease"],
    ["?type=lease", "auto", ""],
    ["?q=a&type=lease", "contract", "?q=a&type=contract"],
    ["?q=a&type=lease", "auto", "?q=a"],
  ])("writes %s + %s as %s (the default is not written, other parameters stay)", (search, value, expected) => {
    expect(writeRouteValue(search, "type", value, "auto")).toBe(expected);
  });

  it("writes the address on a change, pushing a history entry, and follows back", async () => {
    render(<Probe />);
    const length = window.history.length;
    await userEvent.click(screen.getByRole("button", { name: "auto" }));
    expect(window.location.search).toBe("?type=lease");
    expect(window.history.length).toBe(length + 1);
    expect(screen.getByRole("button", { name: "lease" })).toBeTruthy();
    act(() => {
      window.history.replaceState(null, "", "/app/verify");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(screen.getByRole("button", { name: "auto" })).toBeTruthy();
  });
});

describe("selection components in route mode (routeKey): the URL is the state", () => {
  it("Tabs: a click writes ?tab=, the address drives the active tab", async () => {
    render(
      <Tabs.Root routeKey="tab" routeValues={["a", "b"]} variant="segmented">
        <Tabs.List aria-label="Kind">
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a">panel a</Tabs.Content>
        <Tabs.Content value="b">panel b</Tabs.Content>
      </Tabs.Root>,
    );
    expect(screen.getByRole("tab", { name: "A" }).getAttribute("aria-selected")).toBe("true");
    await userEvent.click(screen.getByRole("tab", { name: "B" }));
    expect(window.location.search).toBe("?tab=b");
    expect(screen.getByRole("tab", { name: "B" }).getAttribute("aria-selected")).toBe("true");
  });

  it("Chip.Group: single choice bound to ?type=, and the address opens on that chip", async () => {
    window.history.replaceState(null, "", "/app/verify?type=lease");
    render(
      <Chip.Group type="single" required label="Type" routeKey="type" routeValues={["auto", "lease"]}>
        <Chip value="auto">Auto</Chip>
        <Chip value="lease">Lease</Chip>
      </Chip.Group>,
    );
    expect(screen.getByRole("radio", { name: "Lease" }).getAttribute("aria-checked")).toBe("true");
    await userEvent.click(screen.getByRole("radio", { name: "Auto" }));
    expect(window.location.search).toBe("");
  });

  it("ChoiceGrid: a tile writes ?plan=", async () => {
    render(
      <ChoiceGrid label="Plan" routeKey="plan" routeValues={["free", "pro"]} items={[{ id: "free", visual: null, name: "Free" }, { id: "pro", visual: null, name: "Pro" }]} />,
    );
    await userEvent.click(screen.getByRole("radio", { name: /Pro/ }));
    expect(window.location.search).toBe("?plan=pro");
  });
});

describe("RadioGroup (segmented) in route mode", () => {
  it("a segment writes ?kind=", async () => {
    const { RadioGroup } = await import("../radio-group");
    render(
      <RadioGroup.Root variant="segmented" label="Kind" routeKey="kind" routeValues={["auto", "lease"]}>
        <RadioGroup.Segment value="auto">Auto</RadioGroup.Segment>
        <RadioGroup.Segment value="lease">Lease</RadioGroup.Segment>
      </RadioGroup.Root>,
    );
    await userEvent.click(screen.getByRole("radio", { name: "Lease" }));
    expect(window.location.search).toBe("?kind=lease");
  });
});
