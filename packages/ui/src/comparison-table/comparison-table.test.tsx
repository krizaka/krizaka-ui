import { render, screen, within } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { ComparisonTable } from "./index";

const rows = [
  { id: "where", topic: "Where do your prompts go?", icon: <svg data-testid="icon-where" />, answers: { cloud: { key: "To a provider,", detail: "under their terms." }, mine: { key: "To your machines.", detail: "Nothing leaves." } } },
  { id: "pay", topic: "What do you pay?", answers: { cloud: { key: "Per token." }, mine: { key: "Your hardware.", detail: "Credits you hold." } } },
];
const columns = [
  { id: "cloud", label: "A cloud assistant" },
  { id: "mine", label: "Orazaka" },
];

function Table() {
  return <ComparisonTable label="Ownership" topicLabel="Question" columns={columns} highlight="mine" rows={rows} />;
}

describe("ComparisonTable", () => {
  it("is a named table whose rows line up: every cell sits on its row's grid line, in its column", () => {
    render(<Table />);
    const table = screen.getByRole("table", { name: "Ownership" });
    expect(within(table).getAllByRole("columnheader").map((h) => h.textContent)).toEqual(["Question", "A cloud assistant", "Orazaka"]);
    const body = within(table).getAllByRole("row").slice(1);
    body.forEach((row, r) => {
      for (const cell of [within(row).getByRole("rowheader"), ...within(row).getAllByRole("cell")]) expect(cell.style.gridRow).toBe(String(r + 2));
      expect(within(row).getAllByRole("cell").map((c) => c.style.gridColumn)).toEqual(["2", "3"]);
    });
  });

  it("draws the highlighted column as a band of the same grid, spanning the header and every row", () => {
    const { container } = render(<Table />);
    const band = container.querySelector("[data-band]") as HTMLElement;
    expect(band.style.gridColumn).toBe("3");
    expect(band.style.gridRow).toBe("1 / span 3");
    expect(screen.getAllByRole("columnheader").find((h) => h.hasAttribute("data-highlight"))?.textContent).toBe("Orazaka");
  });

  it("writes each answer as its key phrase in bold, then the detail; the other column is neutral, never struck", () => {
    const { container } = render(<Table />);
    const cell = within(screen.getByRole("table")).getAllByRole("cell")[1];
    expect(cell.querySelector("strong")?.textContent).toBe("To your machines.");
    expect(cell.textContent).toBe("To your machines. Nothing leaves.");
    expect(container.querySelector("s, del, .line-through")).toBeNull();
  });

  it("gives each question its icon", () => {
    render(<Table />);
    expect(screen.getAllByTestId("icon-where").length).toBeGreaterThan(0);
  });

  it("is one card per question on a phone, the answers named by their column, the highlighted one marked", () => {
    render(<Table />);
    const list = screen.getByRole("list", { name: "Ownership" });
    const cards = within(list).getAllByRole("listitem");
    expect(cards).toHaveLength(2);
    const terms = within(cards[0]).getAllByRole("term").map((t) => t.textContent);
    expect(terms).toEqual(["A cloud assistant", "Orazaka"]);
    expect(within(cards[0]).getByText("Orazaka").closest("[data-highlight]")).not.toBeNull();
  });

  it("staggers the rows' entrance through the motion system", () => {
    render(<Table />);
    const cards = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(cards.map((c) => c.getAttribute("data-reveal"))).toEqual(["soft", "soft"]);
    expect(cards.map((c) => c.style.getPropertyValue("--kz-delay"))).toEqual(["0ms", "70ms"]);
  });

  it("has no axe violation", async () => {
    const { container } = render(<Table />);
    expect(await axeViolations(container)).toEqual([]);
  });
});
