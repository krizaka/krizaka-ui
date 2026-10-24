import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";

import { StyledText } from "./server";
import {
  contrastRatio,
  defaultTextStyle,
  fontIds,
  isLargeText,
  isUnderMinimumSize,
  parseColor,
  parseTextStyle,
  requiredContrast,
  sizeSteps,
  type TextStyle,
  textStyleProps,
  toneIds,
} from "./text-style";

const stored: TextStyle = { font: "display", size: "3xl", weight: 400, leading: "tight", tracking: "wide", align: "center", case: "small-caps", italic: true, tone: "accent" };

describe("parseTextStyle", () => {
  it("round-trips a valid value, through JSON as a database would", () => {
    expect(parseTextStyle(stored)).toEqual(stored);
    expect(parseTextStyle(JSON.parse(JSON.stringify(stored)))).toEqual(stored);
  });

  it("answers the default for anything that is not a text style", () => {
    for (const input of [undefined, null, 42, "x", [], [stored], true]) expect(parseTextStyle(input)).toEqual(defaultTextStyle);
  });

  it("refuses a free font, a hex colour, pixels and injected CSS", () => {
    const hostile = [
      { font: "Comic Sans MS" },
      { font: "https://fonts.googleapis.com/css2?family=Evil" },
      { tone: "#ff0000" },
      { tone: "red; background:url(https://evil.example/x)" },
      { size: "16px" },
      { size: 16 },
      { weight: 800 },
      { weight: "700" },
      { italic: "yes" },
      { align: '"; background:url(https://evil.example/x)' },
    ];
    for (const patch of hostile) expect(parseTextStyle({ ...stored, ...patch })).toEqual(defaultTextStyle);
  });

  it("drops keys it does not know and fills those an older value lacks", () => {
    expect(parseTextStyle({ ...stored, background: "url(x)" })).toEqual(stored);
    expect(parseTextStyle({ font: "mono", size: "lg" })).toEqual({ ...defaultTextStyle, font: "mono", size: "lg" });
  });

  it("returns a copy, never the shared default", () => {
    const a = parseTextStyle(null);
    a.size = "4xl";
    expect(parseTextStyle(null).size).toBe("md");
  });

  it("holds every font, step and tone of the tables", () => {
    for (const font of fontIds) expect(parseTextStyle({ font }).font).toBe(font);
    for (const size of sizeSteps) expect(parseTextStyle({ size }).size).toBe(size);
    for (const tone of toneIds) expect(parseTextStyle({ tone }).tone).toBe(tone);
  });
});

describe("textStyleProps", () => {
  it("builds the class and a style of CSS variables only", () => {
    const { className, style } = textStyleProps(stored);
    expect(className).toBe("kz-text-style");
    expect(style).toMatchObject({
      fontFamily: "var(--kz-font-display)",
      fontSize: "var(--kz-text-style-3xl, 1.875rem)",
      fontWeight: 400,
      textAlign: "center",
      textTransform: "none",
      fontVariantCaps: "small-caps",
      fontStyle: "italic",
      color: "var(--kz-accent-text)",
    });
    expect(style.lineHeight).toBe("var(--kz-text-style-leading-tight, 1.15)");
    expect(style.letterSpacing).toBe("var(--kz-text-style-tracking-wide, 0.08em)");
  });

  it("draws the default for a hostile value: nothing of it reaches the CSS", () => {
    const hostile = { ...stored, font: "x; background:url(https://evil.example/x)", tone: "#f00" };
    expect(textStyleProps(hostile)).toEqual(textStyleProps(defaultTextStyle));
    expect(JSON.stringify(textStyleProps(hostile))).not.toMatch(/evil|#f00|url\(/);
  });

  it("only ever uses variables, keywords and numbers", () => {
    for (const font of fontIds)
      for (const size of sizeSteps)
        for (const tone of toneIds) {
          const { style } = textStyleProps({ ...stored, font, size, tone, case: "upper" });
          for (const [name, value] of Object.entries(style)) {
            if (typeof value === "string" && ["fontFamily", "fontSize", "lineHeight", "letterSpacing", "color"].includes(name)) expect(value).toMatch(/^var\(--kz-[a-z0-9-]+(, [0-9.a-z-]+)?\)$/);
          }
          expect(style.textTransform).toBe("uppercase");
        }
  });
});

describe("StyledText", () => {
  it("renders the element asked with the style of its value", () => {
    render(
      <StyledText as="h2" value={stored} id="shop">
        Boulangerie Martin
      </StyledText>,
    );
    const heading = screen.getByRole("heading", { level: 2, name: "Boulangerie Martin" });
    expect(heading.id).toBe("shop");
    expect(heading.className).toContain("kz-text-style");
    expect(heading.style.fontFamily).toBe("var(--kz-font-display)");
  });

  it("renders on a server, a paragraph by default, the default style for an invalid value", () => {
    const html = renderToStaticMarkup(<StyledText value={{ tone: "#fff" }}>Hi</StyledText>);
    expect(html).toContain("<p ");
    expect(html).toContain("var(--kz-text-primary)");
    expect(html).not.toContain("#fff");
  });
});

describe("contrast", () => {
  it("reads the colours a browser answers", () => {
    expect(parseColor("rgb(255, 0, 0)")).toEqual([255, 0, 0]);
    expect(parseColor("rgb(0 128 255 / 0.5)")).toEqual([0, 128, 255]);
    expect(parseColor("#fff")).toEqual([255, 255, 255]);
    expect(parseColor("#102030")).toEqual([16, 32, 48]);
    expect(parseColor("color(srgb 1 0 0)")).toEqual([255, 0, 0]);
    expect(parseColor("var(--kz-text-primary)")).toBeNull();
  });

  it("computes the WCAG ratio", () => {
    expect(contrastRatio([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 5);
    expect(contrastRatio([119, 119, 119], [255, 255, 255])).toBeCloseTo(4.48, 1);
  });

  it("asks 3:1 of large text and 4.5:1 of the rest", () => {
    expect(isLargeText({ size: "2xl", weight: 400 })).toBe(true);
    expect(isLargeText({ size: "xl", weight: 700 })).toBe(true);
    expect(isLargeText({ size: "xl", weight: 400 })).toBe(false);
    expect(requiredContrast({ size: "md", weight: 400 })).toBe(4.5);
    expect(requiredContrast({ size: "4xl", weight: 400 })).toBe(3);
  });

  it("compares a step with a minimum", () => {
    expect(isUnderMinimumSize("xs", "sm")).toBe(true);
    expect(isUnderMinimumSize("sm", "sm")).toBe(false);
  });
});
