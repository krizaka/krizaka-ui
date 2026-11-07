import { render, screen } from "@testing-library/react";

import { RunFacts } from "../RunFacts";

describe("RunFacts", () => {
  it("is a description list: each label with its value, in order", () => {
    const { container } = render(
      <RunFacts
        facts={[
          { label: "Seed", value: "1" },
          { label: "Run", value: "abc-def" },
        ]}
        className="extra"
      />,
    );
    expect(container.querySelector("dl")).toHaveClass("extra");
    expect(Array.from(container.querySelectorAll("dt")).map((n) => n.textContent)).toEqual(["Seed", "Run"]);
    // A long id breaks where it must, a sentence at its spaces (overflow-wrap: anywhere, never break-all).
    expect(screen.getByText("abc-def").className).toContain("[overflow-wrap:anywhere]");
    expect(screen.getByText("abc-def").className).not.toContain("break-all");
  });
});
