import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Slot, VisuallyHidden } from "./index";

describe("Slot and VisuallyHidden", () => {
  it("merges props into the child and names it for assistive technology only", async () => {
    const { container } = render(
      <Slot className="a" data-state="open">
        <a href="/" className="b">
          <VisuallyHidden>Home</VisuallyHidden>
        </a>
      </Slot>,
    );
    const link = screen.getByRole("link", { name: "Home" });
    expect(link.className).toBe("a b");
    expect(link.dataset.state).toBe("open");
    expect(await axeViolations(container)).toEqual([]);
  });
});
