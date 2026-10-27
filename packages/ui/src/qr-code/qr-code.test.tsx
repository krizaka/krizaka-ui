import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { axeViolations } from "../test/axe";
import { QrCode } from "./index";

afterEach(() => vi.restoreAllMocks());

describe("QrCode", () => {
  it("is an image named by its label, drawn in dark modules on a light tile", async () => {
    const { container } = render(<QrCode value="https://akinaza.com/ical/x.ics" label="Calendar feed — scan with your phone" />);
    const image = screen.getByRole("img", { name: "Calendar feed — scan with your phone" });
    expect(image.tagName.toLowerCase()).toBe("svg");
    expect(image.querySelector("rect")!.getAttribute("fill")).toBe("#ffffff");
    expect(image.querySelector("path")!.getAttribute("fill")).toBe("#0b0f19");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("keeps a quiet zone of four modules by default, two at least", () => {
    const side = (props: { quietZone?: number }) => {
      const view = render(<QrCode value="a" label="x" {...props} />);
      const modules = Number(view.getByRole("img").getAttribute("viewBox")!.split(" ")[2]);
      view.unmount();
      return modules;
    };
    expect(side({})).toBe(21 + 8);
    expect(side({ quietZone: 0 })).toBe(21 + 4);
  });

  it("has no copy button unless it is given its words", () => {
    render(<QrCode value="a" label="x" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("copies the text and says so", async () => {
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const onCopy = vi.fn();
    const { container } = render(<QrCode value="https://akinaza.com/ical/x.ics" label="Feed" copyLabel="Copy the link" copiedLabel="Link copied" onCopy={onCopy} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy the link" }));
    expect(writeText).toHaveBeenCalledWith("https://akinaza.com/ical/x.ics");
    expect(await screen.findByRole("button", { name: "Link copied" })).toBeTruthy();
    expect(onCopy).toHaveBeenCalledOnce();
    expect(await axeViolations(container)).toEqual([]);
  });
});
