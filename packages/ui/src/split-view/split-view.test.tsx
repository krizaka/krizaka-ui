import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { SplitView } from "./index";

describe("SplitView", () => {
  it("shows the list and the empty detail, with no axe violation", async () => {
    const { container } = render(<SplitView listTitle="Messages" list={<p>threads</p>} empty="Choose a thread." />);
    expect(screen.getByRole("heading", { level: 2, name: "Messages" })).toBeTruthy();
    expect(screen.getByText("Choose a thread.")).toBeTruthy();
    expect(container.querySelector("[data-hidden-on-phone]")?.textContent).toContain("Choose a thread.");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("hides the list on a phone when an item is open", () => {
    const { container } = render(<SplitView listTitle="Messages" list={<p>threads</p>} detail={<p>thread</p>} back={<a href="#m">Back</a>} showDetail />);
    expect(container.querySelector("[data-hidden-on-phone]")?.textContent).toContain("threads");
    expect(screen.getByRole("link", { name: "Back" })).toBeTruthy();
  });
});
