import { render, screen } from "@testing-library/react";

import Example from "../../registry/examples/catalogue-page/components";
import { axeViolations } from "../test/axe";
import { CataloguePage, PlanStrip } from "./index";

describe("CataloguePage", () => {
  it("renders the template with its h1, its parts, and no axe violation", async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole("heading", { level: 1, name: "Components" })).toBeTruthy();
    expect(screen.getByText("6 components").getAttribute("aria-live")).toBe("polite");
    expect(container.querySelector("details.kz-tpl-catalogue-filters")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is exported", () => {
    expect(typeof CataloguePage).toBe("function");
  });
});

describe("CataloguePage (Operate additions)", () => {
  it("shows the plan strip with its meter, the dividers, and the selection bar after the results", async () => {
    const { container } = render(
      <CataloguePage
        title="Clients"
        filters={<span>chips</span>}
        filtersLabel="Filters"
        plan={<PlanStrip label="Your plan" figures={[{ id: "a", label: "clients", value: "3" }, { id: "b", label: "open", value: "2" }]} meter={{ label: "Clients on your plan", value: 3, max: 25, valueText: "3 of 25" }} />}
        dividers={<div role="group" aria-label="Shelf">Shelves</div>}
        selection={<div role="toolbar" aria-label="Selection">2 selected</div>}
        count="3 clients"
      >
        <ul><li>One</li></ul>
      </CataloguePage>,
    );
    const strip = screen.getByRole("region", { name: "Your plan" });
    expect(strip.textContent).toContain("clients");
    expect(screen.getByRole("meter", { name: "Clients on your plan" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Shelf" })).toBeTruthy();
    const results = screen.getByText("One");
    const bar = screen.getByRole("toolbar");
    expect(results.compareDocumentPosition(bar) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});
