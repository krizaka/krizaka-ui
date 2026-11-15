import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { DescriptionList, KeyValueGrid } from "./index";

const items = [
  { term: "Status", details: "Paid", hint: "Nov 15" },
  { term: "Credits", details: "12" },
];

describe("DescriptionList", () => {
  it("pairs each term with its value in a description list, with no axe violation", async () => {
    const { container } = render(<DescriptionList items={items} />);
    expect(container.querySelectorAll("dt").length).toBe(2);
    expect(screen.getByText("Status").nextElementSibling?.textContent).toBe("PaidNov 15");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("changes the layout, not the markup", () => {
    const { container } = render(<DescriptionList items={items} layout="inline" />);
    expect(container.querySelector("dl")?.className).toContain("divide-y");
    expect(container.querySelectorAll("dd").length).toBe(2);
  });

  it("keeps a stable key for terms that are not strings", () => {
    const { container } = render(<DescriptionList items={[{ id: "a", term: <b>A</b>, details: "1" }, { id: "b", term: <b>B</b>, details: "2" }]} />);
    expect(container.querySelectorAll("dt").length).toBe(2);
  });
});

describe("KeyValueGrid", () => {
  it("wraps its cards at the minimum width asked", () => {
    const { container } = render(<KeyValueGrid items={items} minWidth={14} />);
    expect(container.querySelector("dl")?.getAttribute("style")).toContain("--kz-kv-min: 14rem");
  });
});
