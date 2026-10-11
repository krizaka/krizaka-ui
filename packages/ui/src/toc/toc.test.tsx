import { fireEvent, render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Toc, TocLayout } from "./index";

const items = [
  { id: "install", label: "Install" },
  { id: "status", label: "Status" },
];

describe("Toc", () => {
  it("is a named navigation, the first section current, with no axe violation", async () => {
    const { container } = render(
      <TocLayout toc={<Toc label="On this page" items={items} />}>
        <h2 id="install">Install</h2>
        <h2 id="status">Status</h2>
      </TocLayout>,
    );
    const nav = screen.getByRole("navigation", { name: "On this page" });
    expect(nav.closest("aside")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Install" }).getAttribute("aria-current")).toBe("location");
    fireEvent.click(screen.getByRole("link", { name: "Status" }));
    expect(screen.getByRole("link", { name: "Status" }).getAttribute("aria-current")).toBe("location");
    expect(await axeViolations(container)).toEqual([]);
  });
});
