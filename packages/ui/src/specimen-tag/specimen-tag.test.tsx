import { themes } from "@krizaka/tokens/native";
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
    render(<SpecimenTag mount="hang" title="Yomizaka" titleAs="h4" mark={<svg data-testid="m" />} />);
    expect(screen.getByRole("heading", { level: 4, name: "Yomizaka" }).closest("article")?.dataset.mount).toBe("hang");
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

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

describe("Stamp tones ink and hue, a glyph and a straight text (krizaka-ui#601)", () => {
  it("takes the page's ink and the hue's text as tones", () => {
    render(<><Stamp tone="ink">45 min</Stamp><Stamp tone="hue">Plateau</Stamp></>);
    expect(screen.getByText("45 min").dataset.tone).toBe("ink");
    expect(screen.getByText("Plateau").dataset.tone).toBe("hue");
  });

  it("every tone reads at least 4.5:1 on the page and on a card, in both themes", () => {
    const ink: Record<string, "textPrimary" | "textSecondary" | "successText" | "accentText"> = { ink: "textPrimary", hue: "accentText", ok: "successText", wip: "textSecondary", neutral: "textPrimary" };
    for (const mode of ["dark", "light"] as const) {
      for (const [tone, role] of Object.entries(ink)) {
        for (const surface of ["surface0", "surface1"] as const) {
          expect(contrast(themes[mode][role], themes[mode][surface]), `${tone} ${mode} ${surface}`).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });

  it("holds a decorative glyph before the text", async () => {
    const { container } = render(<Stamp tone="ink" icon={<svg data-testid="g" />}>vibe</Stamp>);
    const glyph = screen.getByTestId("g").parentElement as HTMLElement;
    expect(glyph.getAttribute("aria-hidden")).toBe("true");
    expect(glyph.className).toContain("kz-stamp-icon");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("keeps the border askew and the text straight: default for the small size, opt-in for the medium", () => {
    render(<><Stamp size="sm">a</Stamp><Stamp size="md">b</Stamp><Stamp size="md" straightText>c</Stamp><Stamp size="sm" straightText={false}>d</Stamp></>);
    expect(screen.getByText("a").hasAttribute("data-straight")).toBe(true);
    expect(screen.getByText("a").dataset.size).toBe("sm");
    expect(screen.getByText("b").hasAttribute("data-straight")).toBe(false);
    expect(screen.getByText("c").hasAttribute("data-straight")).toBe(true);
    expect(screen.getByText("d").hasAttribute("data-straight")).toBe(false);
  });
});
