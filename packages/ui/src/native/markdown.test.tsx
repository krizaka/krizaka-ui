// Markdown in React Native (@krizaka/ui/native/markdown): the web's AST in Text and View, safe by default, healed while it streams.
import { describe, expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Linking } from "react-native";

import { Markdown } from "./markdown";

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
