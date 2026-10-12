import { render, screen } from "@testing-library/react";

import Example from "../../registry/examples/longform-page/story";
import { axeViolations } from "../test/axe";
import { LongformPage } from "./index";

describe("LongformPage", () => {
  it("renders the template with its h1, its parts, and no axe violation", async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole("heading", { level: 1, name: "Why a studio in Montréal builds its own AI" })).toBeTruthy();
    expect(screen.getAllByRole("region")).toHaveLength(2);
    expect(container.querySelector(".kz-tpl-pull")?.textContent).toContain("ocean");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is exported", () => {
    expect(typeof LongformPage).toBe("function");
  });
});
