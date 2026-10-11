import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { ActionBar } from "./index";

describe("ActionBar", () => {
  it("lists link actions with their words, the first primary, with no axe violation", async () => {
    const { container } = render(
      <ActionBar
        label="What next"
        primaryFirst
        actions={[
          { href: "#docs", label: "Read" },
          { href: "https://github.com/krizaka", label: "Code" },
        ]}
      />,
    );
    expect(screen.getByRole("list", { name: "What next" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Read" }).className).toContain("bg-accent");
    expect(screen.getByRole("link", { name: "Code" }).getAttribute("target")).toBe("_blank");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("names icon actions by their words, shown as a tooltip", async () => {
    const { container } = render(<ActionBar variant="icons" label="Talk" actions={[{ href: "https://x.dev/d", label: "Discuss", icon: <svg aria-hidden /> }]} />);
    const link = screen.getByRole("link", { name: "Discuss" });
    expect(link.dataset.tip).toBe("Discuss");
    expect(await axeViolations(container)).toEqual([]);
  });
});
