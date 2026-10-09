import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Alert } from "./index";

describe("Alert", () => {
  it.each([
    ["danger", "alert"],
    ["warning", "alert"],
    ["info", "status"],
    ["success", "status"],
  ] as const)("a %s alert has role=%s", async (tone, role) => {
    const { container } = render(
      <Alert tone={tone} title="Heads up" icon={<svg />} action={<button type="button">Fix</button>}>
        Something to know.
      </Alert>,
    );
    const alert = screen.getByRole(role);
    expect(alert.dataset.tone).toBe(tone);
    expect(alert.querySelector("[aria-hidden]")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("keeps the text a text role (contrast), the tone on the border and the icon", () => {
    render(<Alert tone="danger">Payment failed.</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert.className).toContain("text-fg");
    expect(alert.className).toContain("border-danger/50");
  });
});
