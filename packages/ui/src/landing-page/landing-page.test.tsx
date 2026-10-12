import { render, screen } from "@testing-library/react";

import Example from "../../registry/examples/landing-page/krizaka";
import { axeViolations } from "../test/axe";
import { LandingPage } from "./index";

describe("LandingPage", () => {
  it("renders the template with its h1, its parts, and no axe violation", async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole("heading", { level: 1, name: "Products that keep what is yours" })).toBeTruthy();
    expect(container.querySelector(".kz-tpl-bento [data-size='lg']")).toBeTruthy();
    expect(container.querySelectorAll(".kz-tpl-band dt")).toHaveLength(3);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is exported", () => {
    expect(typeof LandingPage).toBe("function");
  });
});
