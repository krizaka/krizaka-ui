import { fireEvent, render, screen } from "@testing-library/react";

import Example from "../../registry/examples/clause-demo/lease";
import { axeViolations } from "../test/axe";
import { ClauseDemo, type ClauseLine } from "./index";

const lines: ClauseLine[] = [
  { id: "a", text: "The tenant pays on the first." },
  { id: "b", text: "Pets are allowed.", finding: { verdict: "Fine", tone: "success", title: "Nothing to change.", reference: "Art. 1" } },
  { id: "c", text: "A deposit of two months.", finding: { verdict: "To check", tone: "danger", title: "A deposit is not allowed.", quote: "two months", reference: "Art. 1904" } },
];

describe("ClauseDemo", () => {
  it("opens on the first danger line and has no axe violation", async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
    expect(screen.getAllByRole("button", { pressed: true })).toHaveLength(1);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("shows the verdict, the quote and the reference of the line opened by default", () => {
    render(<ClauseDemo title="Touch a clause." lines={lines} />);
    expect(screen.getByRole("button", { name: "A deposit of two months." }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText("To check")).toBeTruthy();
    expect(screen.getByText("two months")).toBeTruthy();
    expect(screen.getByText("Art. 1904")).toBeTruthy();
  });

  it("answers a tap, the keyboard's focus and a mouse hover; a line without a finding is not a control", () => {
    render(<ClauseDemo title="Touch a clause." lines={lines} />);
    const pets = screen.getByRole("button", { name: "Pets are allowed." });
    fireEvent.focus(pets);
    expect(screen.getByText("Nothing to change.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "A deposit of two months." }));
    expect(screen.getByText("A deposit is not allowed.")).toBeTruthy();
    fireEvent.pointerEnter(pets, { pointerType: "mouse" });
    expect(pets.getAttribute("aria-pressed")).toBe("true");
    expect(screen.queryByRole("button", { name: "The tenant pays on the first." })).toBeNull();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("names its answer panel as a polite live region tied to every line", () => {
    const { container } = render(<ClauseDemo title="Touch a clause." lines={lines} />);
    const panel = container.querySelector("[aria-live='polite']");
    expect(panel?.id).toBeTruthy();
    for (const b of screen.getAllByRole("button")) expect(b.getAttribute("aria-controls")).toBe(panel?.id);
  });
});
