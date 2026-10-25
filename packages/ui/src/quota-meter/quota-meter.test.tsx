import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";

import { axeViolations } from "../test/axe";
import { QuotaMeter } from "./index";

const base = { title: "Storage", value: 8.6, max: 10, usedText: "8.6 GB of 10 GB", meterLabel: "Storage used" };

describe("QuotaMeter", () => {
  it("is a region named by its title, with a meter in words, and no axe violation", async () => {
    const { container } = render(<QuotaMeter {...base} level="warning" statusText="Close to the limit" details={["412 minutes"]} />);
    expect(screen.getByRole("region", { name: "Storage" })).toBeTruthy();
    expect(screen.getByRole("meter", { name: "Storage used" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("reads an alarming sentence as a status, and a calm one as plain text", () => {
    const { rerender } = render(<QuotaMeter {...base} level="critical" statusText="Almost full" />);
    expect(screen.getByRole("status").textContent).toBe("Almost full");
    rerender(<QuotaMeter {...base} level="ok" statusText="Plenty of room" />);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("draws no meter without a limit, caps an overshoot, and lists every notice as a status", () => {
    const { rerender } = render(<QuotaMeter {...base} max={null} />);
    expect(screen.queryByRole("meter")).toBeNull();
    rerender(<QuotaMeter {...base} value={14} notices={["On hold", "Paused"]} />);
    expect(screen.getByRole("meter").getAttribute("aria-valuenow")).toBe("10");
    expect(screen.getAllByRole("status")).toHaveLength(2);
  });

  it("leaves out the footer when compact — the title, the sentence and the notices stay — and renders on the server", () => {
    render(<QuotaMeter {...base} compact level="full" statusText="Full" notices={["Paused"]} details={["412 minutes"]} action={<a href="#a">Manage</a>} />);
    expect(screen.queryByText("412 minutes")).toBeNull();
    expect(screen.queryByRole("link", { name: "Manage" })).toBeNull();
    expect(screen.getByRole("region", { name: "Storage" })).toBeTruthy();
    expect(screen.getAllByRole("status").map((s) => s.textContent)).toEqual(["Full", "Paused"]);
    expect(renderToStaticMarkup(<QuotaMeter {...base} />)).toContain("8.6 GB of 10 GB");
  });

  it("keeps a decorative icon out of the region's name", () => {
    render(<QuotaMeter {...base} icon={<img src="data:," alt="Disk" />} />);
    expect(screen.getByRole("region", { name: "Storage" })).toBeTruthy();
    expect(screen.queryByRole("img", { name: "Disk" })).toBeNull();
  });
});
