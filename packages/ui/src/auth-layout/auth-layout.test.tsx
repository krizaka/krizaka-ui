import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { AuthLayout } from "./index";

describe("AuthLayout", () => {
  it("renders the form under the page's h1, in main, with the brand panel, and no axe violation", async () => {
    const { container } = render(
      <AuthLayout brand="Orochia" title="Welcome back" description="Sign in." promise="Paid by your fans." footer="No account?" legal="Terms">
        <form aria-label="Sign in">
          <label htmlFor="e">Email</label>
          <input id="e" />
        </form>
      </AuthLayout>,
    );
    expect(screen.getByRole("main").querySelector("h1")?.textContent).toBe("Welcome back");
    expect(screen.getByText("Paid by your fans.")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});
