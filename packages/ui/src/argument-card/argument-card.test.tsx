import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { ArgumentCard } from "./index";

describe("ArgumentCard", () => {
  it("argues compactly: head, hook, a panel for the long version, the way in — with no axe violation", async () => {
    const { container } = render(
      <ArgumentCard
        id="java"
        title="Krizaka Java"
        meta="com.krizaka"
        facts={[{ label: "Central 0.1.0", tone: "ok" }]}
        mark={<svg />}
        hook={{ label: "The trap", text: "Versions drift." }}
        panelLabel="Details"
        points={{ label: "What it does", items: ["One parent."] }}
        rule={<p>The duck's rule</p>}
        details={[{ label: "Cost", text: "You follow the parent." }]}
        actions={<button type="button">Discuss</button>}
      />,
    );
    expect(screen.getByRole("article", { name: "Krizaka Java" })).toBeTruthy();
    expect(container.querySelector(".kz-arg-line")?.textContent).toBe("The trap — Versions drift.");
    expect(container.querySelector(".kz-arg-mark")?.getAttribute("aria-hidden")).toBe("true");
    const panel = container.querySelector("details") as HTMLDetailsElement;
    expect(panel.open).toBe(false);
    expect(panel.querySelector("summary")?.textContent).toContain("Details");
    expect(panel.textContent).toContain("One parent.");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is only its face with a detail page: no fold, one short action described by the title", () => {
    const { container } = render(
      <ArgumentCard id="x" title="X" level={2} hook={{ label: "Trap", text: "T" }} panelLabel="Details" points={{ label: "P", items: ["a"] }} more={{ href: "#x", label: "Details" }} />,
    );
    expect(container.querySelector("details")).toBeNull();
    expect(screen.getByRole("link", { name: /Details/ }).getAttribute("aria-describedby")).toBe("x");
    expect(screen.getByRole("heading", { level: 2, name: "X" })).toBeTruthy();
  });
});
