import { render } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Kbd } from "./index";

describe("Kbd", () => {
  it("renders a <kbd> with its size, with no axe violation", async () => {
    const { container } = render(
      <p>
        Search <Kbd>⌘</Kbd>
        <Kbd size="sm">K</Kbd>
      </p>,
    );
    const keys = container.querySelectorAll("kbd");
    expect(keys).toHaveLength(2);
    expect(keys[1]?.className).toContain("h-5");
    expect(await axeViolations(container)).toEqual([]);
  });
});
