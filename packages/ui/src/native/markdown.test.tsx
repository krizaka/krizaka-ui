// Markdown in React Native (@krizaka/ui/native/markdown): the web's AST in Text and View, safe by default, healed while it streams.
import { describe, expect, jest, test } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Dimensions, Linking, StyleSheet } from "react-native";

import { Markdown } from "./markdown";
import { ThemeProvider } from "./theme";

const SOURCE = `# Notes

A paragraph with **bold**, *italic* and a [link](https://example.com).

- one
- two

3. three

- [x] done
- [ ] todo

> quoted

| Name | Amount |
| --- | ---: |
| Elena | 12 |

---

\`\`\`ts title="loader.ts"
const a = 1;
\`\`\`
`;

describe("Markdown (native)", () => {
  test("lets table columns fit long identifiers inside a horizontal scroller", async () => {
    await render(<Markdown>{"| Identifier | Related |\n| --- | --- |\n| `profile-photo-check` | `account-access-review` |"}</Markdown>);
    const region = screen.getByLabelText("Identifier, Related");
    expect(region.props.horizontal).toBe(true);
    expect(region.props.showsHorizontalScrollIndicator).toBe(true);
    expect(region.props.tabIndex).toBe(0);
    expect(StyleSheet.flatten(screen.getByText("Identifier").props.style).width).toBeUndefined();
    expect(screen.getByText(/profile-photo-check/)).toBeTruthy();
  });

  test("shares measured column widths without changing row order, including empty cells", async () => {
    const { rerender, toJSON } = await render(
      <ThemeProvider fonts={{ sans: "InitialSans", mono: "InitialMono" }}>
        <Markdown>{"| Identifier | Related |\n| --- | --- |\n| profile-photo-check | |\n| account-access-review | second-row |"}</Markdown>
      </ThemeProvider>,
    );
    const region = screen.getByLabelText("Identifier, Related");
    const regionInstance = (region as unknown as { instance: unknown }).instance;
    await fireEvent(screen.getByText("Identifier"), "layout", { nativeEvent: { layout: { width: 80 } } });
    await fireEvent(screen.getByText("profile-photo-check"), "layout", { nativeEvent: { layout: { width: 220 } } });
    await fireEvent(screen.getByText("Identifier"), "layout", { nativeEvent: { layout: { width: 80 } } });
    for (const text of ["Identifier", "profile-photo-check", "account-access-review"]) {
      expect(StyleSheet.flatten(screen.getByText(text).props.style).width).toBe(220);
    }
    const tree = JSON.stringify(toJSON());
    expect(tree.indexOf("Related")).toBeLessThan(tree.indexOf("profile-photo-check"));
    expect(tree.indexOf("profile-photo-check")).toBeLessThan(tree.indexOf("account-access-review"));
    expect(tree.indexOf("account-access-review")).toBeLessThan(tree.indexOf("second-row"));
    await rerender(
      <ThemeProvider fonts={{ sans: "InitialSans", mono: "InitialMono" }}>
        <Markdown>{"| Identifier | Related |\n| --- | --- |\n| short | next |"}</Markdown>
      </ThemeProvider>,
    );
    expect((screen.getByLabelText("Identifier, Related") as unknown as { instance: unknown }).instance === regionInstance).toBe(true);
    expect(StyleSheet.flatten(screen.getByText("Identifier").props.style).width).toBeUndefined();
    await fireEvent(screen.getByText("short"), "layout", { nativeEvent: { layout: { width: 140 } } });
    expect(StyleSheet.flatten(screen.getByText("Identifier").props.style).width).toBe(140);
    await rerender(
      <ThemeProvider fonts={{ sans: "UpdatedSans", mono: "UpdatedMono" }}>
        <Markdown>{"| Identifier | Related |\n| --- | --- |\n| short | next |"}</Markdown>
      </ThemeProvider>,
    );
    expect((screen.getByLabelText("Identifier, Related") as unknown as { instance: unknown }).instance === regionInstance).toBe(true);
    expect(StyleSheet.flatten(screen.getByText("Identifier").props.style).width).toBeUndefined();
    await fireEvent(screen.getByText("short"), "layout", { nativeEvent: { layout: { width: 140 } } });
    const originalWindow = Dimensions.get("window");
    await act(async () => {
      Dimensions.set({
        window: { ...originalWindow, fontScale: originalWindow.fontScale + 1 },
        screen: Dimensions.get("screen"),
      });
    });
    expect((screen.getByLabelText("Identifier, Related") as unknown as { instance: unknown }).instance === regionInstance).toBe(true);
    expect(StyleSheet.flatten(screen.getByText("Identifier").props.style).width).toBeUndefined();
    await act(async () => {
      Dimensions.set({ window: originalWindow, screen: Dimensions.get("screen") });
    });
  });

  test("shows the host-labelled generated chip only when requested and labelled", async () => {
    const { rerender } = await render(<Markdown generated generatedLabel="Généré automatiquement">{"A document."}</Markdown>);
    expect(screen.getByText("Généré automatiquement")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
    await rerender(<Markdown generatedLabel="Généré automatiquement">{"A document."}</Markdown>);
    expect(screen.queryByText("Généré automatiquement")).toBeNull();
    await rerender(<Markdown generated>{"A document."}</Markdown>);
    expect(screen.queryByText("Generated")).toBeNull();
  });

  test("draws the blocks: headings, lists, tasks, a quote, a table, a titled code block", async () => {
    await render(<Markdown>{SOURCE}</Markdown>);
    expect(screen.getByRole("heading", { name: "Notes" })).toBeTruthy();
    expect(screen.getByText("bold")).toBeTruthy();
    expect(screen.getAllByText("•")).toHaveLength(2);
    expect(screen.getByText("3.")).toBeTruthy();
    expect(screen.getByText("☑")).toBeTruthy();
    expect(screen.getByText("☐")).toBeTruthy();
    expect(screen.getByText("quoted")).toBeTruthy();
    expect(screen.getByText("Amount")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
    expect(screen.getByText("loader.ts")).toBeTruthy();
    expect(screen.getByText("const")).toBeTruthy();
  });

  test("hands a pressed link's address to onLinkPress", async () => {
    const onLinkPress = jest.fn();
    await render(<Markdown onLinkPress={onLinkPress}>{"[go](https://example.com)"}</Markdown>);
    await fireEvent.press(screen.getByRole("link"));
    expect(onLinkPress).toHaveBeenCalledWith("https://example.com");
  });

  test("opens a web link with the system, and leaves a link of the app alone", async () => {
    const open = jest.spyOn(Linking, "openURL").mockResolvedValue(true);
    await render(<Markdown>{"[go](https://example.com) and [app](/docs)"}</Markdown>);
    await fireEvent.press(screen.getAllByRole("link")[0]!);
    expect(open).toHaveBeenCalledWith("https://example.com");
    await fireEvent.press(screen.getAllByRole("link")[1]!);
    expect(open).toHaveBeenCalledTimes(1);
    open.mockRestore();
  });

  test("never renders raw HTML or an executable link", async () => {
    await render(<Markdown>{"<script>alert(1)</script>\n\n[x](javascript:alert(1)) <b>bold</b>"}</Markdown>);
    expect(screen.getByText("<script>alert(1)</script>")).toBeTruthy();
    expect(screen.queryByRole("link")).toBeNull();
  });

  test("heals a text that is arriving: no marker, no half link", async () => {
    await render(<Markdown streaming>{"Use **a queue** and [the docs](https://krizaka.com/do"}</Markdown>);
    expect(screen.getByText("a queue")).toBeTruthy();
    expect(screen.queryByText(/\*\*|\]\(/)).toBeNull();
  });

  test("draws a picture alone as an image, and an inline one as its description", async () => {
    await render(<Markdown>{"![A chart](https://example.com/c.png)\n\nSee ![the logo](https://example.com/l.png) here"}</Markdown>);
    expect(screen.getByLabelText("A chart")).toBeTruthy();
    expect(screen.getByText(/the logo/)).toBeTruthy();
  });

  test("numbers footnotes, breaks lines and strikes through", async () => {
    await render(<Markdown>{"A note[^1] ~~gone~~\\\nnext.\n\n[^1]: The footnote."}</Markdown>);
    expect(screen.getByText("The footnote.")).toBeTruthy();
    expect(screen.getAllByText(/1/).length).toBeGreaterThan(0);
  });
});
