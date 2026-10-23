import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Signature } from "./index";

describe("Signature", () => {
  it("signs with a stamp and the house's name, the date a real time, with no axe violation", async () => {
    const { container } = render(<Signature date="23 octobre 2026" dateTime="2026-10-23" />);
    expect(screen.getByText("Krizaka · Montréal").className).toContain("kz-signature-name");
    expect(screen.getByText("23 octobre 2026").tagName).toBe("TIME");
    expect(screen.getByText("23 octobre 2026").getAttribute("datetime")).toBe("2026-10-23");
    expect(container.querySelector(".kz-signature-stamp")?.getAttribute("aria-hidden")).toBe("true");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is a stamp alone, named by the image, or a script alone", async () => {
    const stamp = render(<Signature variant="stamp" />);
    expect(screen.getByRole("img", { name: "Krizaka · Montréal" })).toBeTruthy();
    expect(stamp.container.querySelector(".kz-signature-text")).toBeNull();
    expect(await axeViolations(stamp.container)).toEqual([]);
    stamp.unmount();
    const script = render(<Signature variant="script" name="Krizaka" />);
    expect(script.container.querySelector(".kz-signature-stamp")).toBeNull();
    expect(screen.getByText("Krizaka")).toBeTruthy();
    expect(await axeViolations(script.container)).toEqual([]);
  });

  it("is inked the same way every time: a filter with a fixed seed, a unique id per instance", () => {
    const { container } = render(
      <>
        <Signature />
        <Signature />
      </>,
    );
    const filters = [...container.querySelectorAll("filter")];
    expect(filters).toHaveLength(2);
    expect(filters[0]!.id).not.toBe(filters[1]!.id);
    for (const f of filters) expect(f.querySelector("feTurbulence")?.getAttribute("seed")).toBe("7");
    expect((container.querySelector(".kz-signature") as HTMLElement).style.filter).toContain(`#${filters[0]!.id}`);
  });
});
