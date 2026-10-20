import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { SpecimenTag, Stamp } from "./index";

describe("SpecimenTag", () => {
  it("labels a product: number, title heading, a stamp, its fields and foot, with no axe violation", async () => {
    const { container } = render(
      <SpecimenTag code="KZ-02" title="Yomizaka" status={{ label: "in development", tone: "wip" }} fields={[{ label: "reads", value: "leases" }]} footer={<a href="https://dev.yomizaka.com">site</a>}>
        <p>Leases, read and checked.</p>
      </SpecimenTag>,
    );
    const tag = container.querySelector("article") as HTMLElement;
    expect(tag.className).toContain("kz-tag");
    expect(tag.dataset.mount).toBe("pin");
    expect(screen.getByRole("heading", { level: 3, name: "Yomizaka" })).toBeTruthy();
    expect(screen.getByText("KZ-02").className).toContain("kz-tag-code");
    expect(screen.getByText("in development").dataset.tone).toBe("wip");
    expect(screen.getByText("reads").tagName).toBe("DT");
    expect(screen.getByText("leases").tagName).toBe("DD");
    expect(container.querySelector(".kz-tag-eyelet")?.getAttribute("aria-hidden")).toBe("true");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("hangs from a wire, takes another title level, and keeps the mark decorative", () => {
    render(<SpecimenTag mount="hang" title="Orochia" titleAs="h4" mark={<svg data-testid="m" />} />);
    expect(screen.getByRole("heading", { level: 4, name: "Orochia" }).closest("article")?.dataset.mount).toBe("hang");
    expect(screen.getByTestId("m").parentElement?.getAttribute("aria-hidden")).toBe("true");
  });

  it("stamps in lower case, never as an uppercase chip (#417)", () => {
    render(<Stamp tone="construction">in construction</Stamp>);
    const stamp = screen.getByText("in construction");
    expect(stamp.className).toContain("kz-stamp");
    expect(stamp.className).not.toContain("uppercase");
    expect(stamp.dataset.tone).toBe("construction");
  });
});
