import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { BirdPlate } from "./index";

const flock = [
  { bird: "falcon" as const, label: "the falcon", promise: "keeps watch: security comes first." },
  { bird: "owl" as const, label: "the owl", promise: "reads every page and knows every face." },
];

describe("BirdPlate", () => {
  it("numbers each bird as a figure, captions it with its promise, the birds decorative, with no axe violation", async () => {
    const { container } = render(<BirdPlate title="Plate I · The flock" figures={flock} />);
    expect(container.querySelector("figure > figcaption")?.textContent).toContain("Plate I · The flock");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain("fig. 1 — the falcon");
    expect(items[1].textContent).toContain("fig. 2 — the owl reads every page and knows every face.");
    for (const svg of container.querySelectorAll("svg")) expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelectorAll("svg[data-bird]")).toHaveLength(2);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("continues a numbering, draws one bird large, still by default", () => {
    const { container } = render(<BirdPlate layout="single" start={6} figureLabel="fig." figures={[flock[1]]} />);
    expect((container.firstElementChild as HTMLElement).dataset.layout).toBe("single");
    expect(container.querySelector("ol")?.getAttribute("start")).toBe("6");
    expect(screen.getByText(/fig\. 6 — the owl/)).toBeTruthy();
    expect(container.querySelector("svg")?.getAttribute("width")).toBe("168");
    expect(container.querySelector("svg")?.hasAttribute("data-animated")).toBe(false);
  });
});
