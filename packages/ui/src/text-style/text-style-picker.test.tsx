import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";

import { axeViolations } from "../test/axe";
import { defaultTextStyle, type TextStyle, type TextStyleField, textStyleLabelsFr, TextStylePicker, type TextStylePickerProps } from "./index";

function Harness({ initial = defaultTextStyle as TextStyle, onChange, ...props }: Partial<TextStylePickerProps> & { initial?: TextStyle }) {
  const [value, setValue] = React.useState<TextStyle>(initial);
  return (
    <TextStylePicker
      previewText="Boulangerie Martin"
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
}

const computedStyles = (get: (element: Element) => Partial<CSSStyleDeclaration>) =>
  vi.spyOn(window, "getComputedStyle").mockImplementation(
    ((element: Element) =>
      ({
        color: "rgb(0, 0, 0)",
        backgroundColor: "rgba(0, 0, 0, 0)",
        fontSize: "16px",
        fontWeight: "400",
        getPropertyValue: () => "",
        ...get(element),
      }) as unknown as CSSStyleDeclaration) as typeof window.getComputedStyle,
  );

const colors = (color: string, backgroundColor: string, fontSize = "16px", fontWeight = "400") =>
  computedStyles((element) => ({
    color,
    backgroundColor:
      element instanceof HTMLElement && element.hasAttribute("data-text-style-sample")
        ? "rgba(0, 0, 0, 0)"
        : element instanceof HTMLElement && element.hasAttribute("data-preview")
          ? element.style.backgroundColor || backgroundColor
          : backgroundColor,
    fontSize,
    fontWeight,
  }));

afterEach(() => vi.restoreAllMocks());

describe("TextStylePicker", () => {
  it("has labelled controls and no axe violation", async () => {
    const { container } = render(<Harness />);
    expect(screen.getByRole("group", { name: "Text style" })).toBeTruthy();
    for (const name of ["Font", "Weight", "Line height", "Letter spacing", "Alignment", "Case", "Colour"]) expect(screen.getByRole("radiogroup", { name })).toBeTruthy();
    expect(screen.getByRole("slider", { name: "Size" })).toBeTruthy();
    expect(screen.getByRole("switch", { name: "Italic" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("shows the sample in the preview, in the value's style", () => {
    render(<Harness initial={{ ...defaultTextStyle, font: "mono", size: "2xl" }} />);
    const sample = within(screen.getByRole("group", { name: "Preview" })).getByText("Boulangerie Martin");
    expect(sample.style.fontFamily).toBe("var(--kz-font-mono)");
    expect(sample.style.fontSize).toBe("var(--kz-text-style-2xl, 1.5rem)");
  });

  it("draws each font option in its own face", () => {
    render(<Harness />);
    expect((screen.getByRole("radio", { name: "Display" }) as HTMLElement).style.fontFamily).toBe("var(--kz-font-display)");
    expect((screen.getByRole("radio", { name: "Typewriter" }) as HTMLElement).style.fontFamily).toBe("var(--kz-font-mono)");
  });

  it("changes the font, and moves the weight to one the face is cut in", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initial={{ ...defaultTextStyle, weight: 600 }} onChange={onChange} />);
    await user.click(screen.getByRole("radio", { name: "Display" }));
    expect(onChange).toHaveBeenLastCalledWith({ ...defaultTextStyle, font: "display", weight: 400 });
    expect(screen.getByRole("radio", { name: "Bold" }).hasAttribute("disabled")).toBe(true);
  });

  it("changes the size with the arrows, by a step of the scale", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await user.tab();
    screen.getByRole("slider", { name: "Size" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenLastCalledWith({ ...defaultTextStyle, size: "lg" });
    expect(screen.getByRole("slider", { name: "Size" }).getAttribute("aria-valuetext")).toBe("lg");
  });

  it("changes weight, spacing, alignment, case, italic and tone", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await user.click(screen.getByRole("radio", { name: "Bold" }));
    await user.click(screen.getByRole("radio", { name: "Relaxed" }));
    await user.click(screen.getByRole("radio", { name: "Wide" }));
    await user.click(screen.getByRole("radio", { name: "Centre" }));
    await user.click(screen.getByRole("radio", { name: "Small caps" }));
    await user.click(screen.getByRole("switch", { name: "Italic" }));
    await user.click(screen.getByRole("radio", { name: "Accent" }));
    expect(onChange).toHaveBeenLastCalledWith({ ...defaultTextStyle, weight: 700, leading: "relaxed", tracking: "wide", align: "center", case: "small-caps", italic: true, tone: "accent" });
  });

  it("applies a preset, with the host's own words", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} presets={[{ id: "title", label: "Titre", value: { font: "display", size: "3xl", align: "center" } }]} labels={textStyleLabelsFr} />);
    expect(screen.getByRole("radiogroup", { name: "Police" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Titre" }));
    expect(onChange).toHaveBeenLastCalledWith({ ...defaultTextStyle, font: "display", size: "3xl", align: "center" });
  });

  it("shows only the fields asked, and a preset changes only those", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness fields={["font", "size"]} onChange={onChange} presets={[{ id: "p", label: "Prix", value: { font: "mono", size: "2xl", tone: "accent", italic: true } }]} />);
    expect(screen.queryByRole("switch")).toBeNull();
    expect(screen.queryByRole("radiogroup", { name: "Colour" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Prix" }));
    expect(onChange).toHaveBeenLastCalledWith({ ...defaultTextStyle, font: "mono", size: "2xl" });
  });

  const presetWeightCases: {
    title: string;
    initial: TextStyle;
    fields?: readonly TextStyleField[];
    value: Partial<TextStyle>;
    expected: TextStyle;
  }[] = [
    {
      title: "fills in a font preset with a supported weight",
      initial: defaultTextStyle as TextStyle,
      fields: undefined,
      value: { font: "cahier" },
      expected: { ...defaultTextStyle, font: "cahier", weight: 500 },
    },
    {
      title: "replaces a disabled preset weight after changing the font",
      initial: defaultTextStyle as TextStyle,
      fields: undefined,
      value: { font: "display", weight: 700 },
      expected: { ...defaultTextStyle, font: "display", weight: 400 },
    },
    {
      title: "normalizes a weight-only preset against the current font",
      initial: { ...defaultTextStyle, font: "cahier", weight: 500 },
      fields: ["weight"] as const,
      value: { weight: 700 },
      expected: { ...defaultTextStyle, font: "cahier", weight: 500 },
    },
  ];

  it.each(presetWeightCases)("$title", async ({ initial, fields, value, expected }) => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Harness
        initial={initial}
        fields={fields}
        onChange={onChange}
        presets={[{ id: "preset", label: "Preset", value }]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Preset" }));
    expect(onChange).toHaveBeenLastCalledWith(expected);
  });

  it("shows any invalid value as the default", () => {
    render(<Harness initial={{ ...defaultTextStyle, tone: "#f00" } as unknown as TextStyle} />);
    expect((screen.getByRole("radio", { name: "Primary" }) as HTMLElement).getAttribute("aria-checked")).toBe("true");
  });

  it("is compact on request", () => {
    render(<Harness compact />);
    expect(screen.getByRole("group", { name: "Text style" }).hasAttribute("data-compact")).toBe(true);
  });
});

describe("TextStylePicker guard rails", () => {
  it("warns under 4.5:1 for body text, and says how much it reaches", async () => {
    colors("rgb(150, 150, 150)", "rgb(255, 255, 255)");
    render(<Harness />);
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("3.0:1"));
    expect(screen.getByRole("status").textContent).toContain("4.5:1 is needed");
  });

  it("asks only 3:1 of large titles", async () => {
    colors("rgb(150, 150, 150)", "rgb(255, 255, 255)", "30px");
    render(<Harness initial={{ ...defaultTextStyle, size: "3xl" }} role="title" />);
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("3:1 is needed"));
    colors("rgb(110, 110, 110)", "rgb(255, 255, 255)", "30px");
    render(<Harness initial={{ ...defaultTextStyle, size: "3xl" }} role="title" />);
    await waitFor(() => expect(screen.getAllByRole("status").some((s) => s.textContent === "")).toBe(true));
  });

  it("measures the sample's tone rather than the preview wrapper's inherited colour", async () => {
    computedStyles((element) => ({
      color: element.hasAttribute("data-text-style-sample") ? "rgb(150, 150, 150)" : "rgb(0, 0, 0)",
      backgroundColor: element.hasAttribute("data-preview") ? "rgb(255, 255, 255)" : "rgba(0, 0, 0, 0)",
    }));
    render(<Harness />);
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("3.0:1"));
  });

  it.each([
    ["black", "#000000", "rgb(255, 255, 255)", ""],
    ["red", "#ff0000", "rgb(255, 0, 0)", "1.0:1"],
  ])("includes an opaque %s preview surface in contrast measurement", async (_name, surface, color, expected) => {
    colors(color, "rgb(255, 255, 255)");
    render(<Harness initial={{ ...defaultTextStyle, tone: "primary" }} surface={surface} />);
    if (expected) await waitFor(() => expect(screen.getByRole("status").textContent).toContain(expected));
    else await waitFor(() => expect(screen.getByRole("status").textContent).toBe(""));
  });

  it("composites translucent preview surfaces over their ancestors", async () => {
    computedStyles((element) => ({
      color: element.hasAttribute("data-text-style-sample") ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
      backgroundColor:
        element instanceof HTMLElement && element.hasAttribute("data-preview")
          ? "rgba(0, 0, 0, 0.1)"
          : element === document.body
            ? "rgb(255, 255, 255)"
            : "rgba(0, 0, 0, 0)",
    }));
    render(<Harness surface="rgba(0, 0, 0, 0.1)" />);
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("1.3:1"));
  });

  it("uses the rendered font size and weight to choose the contrast threshold", async () => {
    computedStyles((element) => ({
      color: element.hasAttribute("data-text-style-sample") ? "rgb(150, 150, 150)" : "rgb(0, 0, 0)",
      backgroundColor: element.hasAttribute("data-preview") ? "rgb(255, 255, 255)" : "rgba(0, 0, 0, 0)",
      fontSize: "16px",
      fontWeight: "400",
    }));
    render(<Harness initial={{ ...defaultTextStyle, size: "2xl" }} role="title" />);
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("4.5:1 is needed"));
  });

  it("re-measures when a theme class changes on a local preview ancestor", async () => {
    computedStyles((element) => {
      const dark = element.closest(".theme-dark") !== null;
      return {
        color: element.hasAttribute("data-text-style-sample") ? (dark ? "rgb(150, 150, 150)" : "rgb(0, 0, 0)") : "rgb(0, 0, 0)",
        backgroundColor: element.hasAttribute("data-preview")
          ? "rgba(0, 0, 0, 0)"
          : element.classList.contains("theme-dark")
            ? "rgb(180, 180, 180)"
            : element === document.body
              ? "rgb(255, 255, 255)"
              : "rgba(0, 0, 0, 0)",
      };
    });
    const theme = document.createElement("div");
    theme.className = "theme-light";
    document.body.append(theme);
    const { unmount } = render(<Harness />, { container: theme });
    expect(screen.getByRole("status").textContent).toBe("");
    theme.className = "theme-dark";
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("4.5:1 is needed"));
    unmount();
    theme.remove();
  });

  it("lets segmented controls span the full picker row when embedded", () => {
    render(<Harness />);
    expect(screen.getByRole("radiogroup", { name: "Weight" }).parentElement?.className).toContain("sm:col-span-2");
  });

  it("says nothing when the contrast is enough, or cannot be read", async () => {
    colors("rgb(0, 0, 0)", "rgb(255, 255, 255)");
    const { unmount } = render(<Harness />);
    await waitFor(() => expect(screen.getByRole("status").textContent).toBe(""));
    unmount();
    colors("var(--kz-text-primary)", "rgba(0, 0, 0, 0)");
    render(<Harness />);
    expect(screen.getByRole("status").textContent).toBe("");
  });

  it("measures on the surface passed", async () => {
    colors("rgb(255, 255, 255)", "rgb(255, 255, 255)");
    render(<Harness surface="#ffffff" />);
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("1.0:1"));
  });

  it("warns about a small body text, never clamps it, and not for a title", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { unmount } = render(<Harness initial={{ ...defaultTextStyle, size: "sm" }} onChange={onChange} />);
    screen.getByRole("slider", { name: "Size" }).focus();
    await user.keyboard("{ArrowLeft}");
    expect(onChange).toHaveBeenLastCalledWith({ ...defaultTextStyle, size: "xs" });
    expect(screen.getByRole("status").textContent).toContain("under “sm”");
    unmount();
    render(<Harness initial={{ ...defaultTextStyle, size: "xs" }} role="title" />);
    expect(screen.getByRole("status").textContent).toBe("");
  });
});
