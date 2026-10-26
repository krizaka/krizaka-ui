import { render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";

import { axeViolations } from "../test/axe";
import { MarginItem, MarginLayout } from "./index";

function Sample() {
  return (
    <MarginLayout aria-label="Findings">
      <MarginItem number="1" note="Clause 4.2 of the lease">
        The deposit exceeds one month.
      </MarginItem>
      <MarginItem number="2">The signature page is missing.</MarginItem>
    </MarginLayout>
  );
}

describe("MarginLayout", () => {
  it("is an ordered list of items, each with its content", async () => {
    const { container } = render(<Sample />);
    const list = screen.getByRole("list", { name: "Findings" });
    expect(list.tagName).toBe("OL");
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("The deposit exceeds one month.")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("hides the number from assistive tech (the list announces the position) and keeps the order number, text, note", () => {
    const { container } = render(<Sample />);
    const first = container.querySelector("li")!;
    const children = [...first.children];
    expect(children[0].getAttribute("aria-hidden")).toBe("true");
    expect(children[1].textContent).toBe("The deposit exceeds one month.");
    expect(children[2].getAttribute("data-slot")).toBe("note");
    expect(children[2].textContent).toBe("Clause 4.2 of the lease");
  });

  it("renders no note slot without a note", () => {
    const { container } = render(<Sample />);
    expect(container.querySelectorAll("li")[1].querySelector("[data-slot=note]")).toBeNull();
  });

  it("folds the note under the item and moves it to the right margin from 64 rem (lg), in tabular display figures", () => {
    const html = renderToStaticMarkup(<Sample />);
    expect(html).toContain("col-start-2");
    expect(html).toContain("lg:col-start-3");
    expect(html).toContain("lg:grid-cols-[4rem_minmax(0,1fr)_16rem]");
    expect(html).toContain("font-display");
    expect(html).toContain("tabular-nums");
  });

  it("uses tokens only, and is server markup", () => {
    expect(renderToStaticMarkup(<Sample />)).not.toMatch(/#[0-9a-f]{3,6}|rgb\(/i);
  });
});
