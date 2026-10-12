import { render, screen } from "@testing-library/react";

import Example from "../../registry/examples/contact-page/team";
import { axeViolations } from "../test/axe";
import { ContactPage } from "./index";

describe("ContactPage", () => {
  it("renders the template with its h1, its parts, and no axe violation", async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole("heading", { level: 1, name: "Talk to the people who build it" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Send" })).toBeTruthy();
    expect(container.querySelectorAll(".kz-tpl-next li")).toHaveLength(2);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is exported", () => {
    expect(typeof ContactPage).toBe("function");
  });
});
