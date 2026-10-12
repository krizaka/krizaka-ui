import { render, screen } from "@testing-library/react";

import Example from "../../registry/examples/error-page/not-found";
import { axeViolations } from "../test/axe";
import { ErrorPage } from "./index";

describe("ErrorPage", () => {
  it("renders the template with its h1, its parts, and no axe violation", async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole("heading", { level: 1, name: "This page took another road" })).toBeTruthy();
    expect(container.querySelector(".kz-tpl-error-code")?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByRole("link", { name: "Home" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is exported", () => {
    expect(typeof ErrorPage).toBe("function");
  });
});
