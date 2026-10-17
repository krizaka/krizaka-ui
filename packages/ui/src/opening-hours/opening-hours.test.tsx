import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { OpeningHours } from "./index";

const days = [
  { id: "mon", label: "Monday", hours: "8 am – 5 pm" },
  { id: "tue", label: "Tuesday", hours: "8 am – 5 pm" },
  { id: "sun", label: "Sunday", hours: "Closed" },
];

describe("OpeningHours", () => {
  it("says open now with what follows, and today's hours, with no axe violation", async () => {
    const { container } = render(<OpeningHours label="Hours" days={days} today="tue" status={{ open: true, label: "Open now", detail: "Closes at 5 pm" }} />);
    expect(screen.getByText("Open now")).toBeTruthy();
    expect(screen.getByText("Closes at 5 pm")).toBeTruthy();
    expect(container.querySelector("summary")!.textContent).toContain("8 am – 5 pm");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("marks today's row in the week", () => {
    render(<OpeningHours label="Hours" days={days} today="tue" status={{ open: false, label: "Closed" }} open />);
    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(3);
    expect(rows.filter((r) => r.getAttribute("aria-current") === "date").map((r) => r.textContent)).toEqual(["Tuesday8 am – 5 pm"]);
  });

  it("lights the dot only while open", () => {
    const { container, rerender } = render(<OpeningHours label="Hours" days={days} status={{ open: true, label: "Open now" }} />);
    expect(container.querySelector("summary [data-open]")!.getAttribute("data-open")).toBe("true");
    rerender(<OpeningHours label="Hours" days={days} status={{ open: false, label: "Closed" }} />);
    expect(container.querySelector("summary [data-open]")!.getAttribute("data-open")).toBe("false");
  });

  it("shows no hours on the row when today is not named", () => {
    const { container } = render(<OpeningHours label="Hours" days={days} status={{ open: false, label: "Closed" }} />);
    expect(container.querySelector("summary")!.textContent).not.toContain("8 am");
  });
});
