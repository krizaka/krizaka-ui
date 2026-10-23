import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { healStreaming, Markdown, parseSource } from "./index";

const SOURCE = `# Release notes

A paragraph with **bold**, *italic*, ~~gone~~, \`code\` and a [link](https://example.com "Title").

- one
- two
  - nested

1. first
2. second

- [x] done
- [ ] to do

> quoted

| Name | Amount |
| :--- | ---: |
| Elena | 12 |

![A chart](https://example.com/chart.png)

---

\`\`\`ts title="loader.ts"
const a: number = 1;
\`\`\`
`;

describe("Markdown", () => {
  it("renders the blocks of a document, with no axe violation", async () => {
    const { container } = render(<Markdown headingIds codeLabels={{ copy: "Copy", copied: "Copied" }}>{SOURCE}</Markdown>);
    expect(screen.getByRole("heading", { level: 1, name: "Release notes" }).id).toBe("release-notes");
    expect(container.querySelector("strong")?.textContent).toBe("bold");
    expect(container.querySelector("em")?.textContent).toBe("italic");
    expect(container.querySelector("del")?.textContent).toBe("gone");
    expect(container.querySelector("p code")?.textContent).toBe("code");
    expect(container.querySelectorAll("ul")).toHaveLength(3);
    expect(container.querySelector("ol")?.querySelectorAll("li")).toHaveLength(2);
    expect(container.querySelector("blockquote")?.textContent).toBe("quoted");
    expect(container.querySelector("hr")).toBeTruthy();
    expect(container.querySelector("img")?.getAttribute("alt")).toBe("A chart");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("renders task lists as disabled, labelled checkboxes", () => {
    render(<Markdown>{"- [x] done\n- [ ] to do"}</Markdown>);
    const boxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    expect(boxes.map((b) => [b.checked, b.disabled])).toEqual([[true, true], [false, true]]);
    expect(screen.getByLabelText("done")).toBe(boxes[0]);
  });

  it("renders a table with headers, alignment and a scrolling wrapper", () => {
    const { container } = render(<Markdown>{"| Name | Amount |\n| :--- | ---: |\n| Elena | 12 |"}</Markdown>);
    expect(screen.getAllByRole("columnheader").map((h) => h.textContent)).toEqual(["Name", "Amount"]);
    expect(screen.getByRole("cell", { name: "12" }).style.textAlign).toBe("right");
    expect(container.querySelector(".kz-md-table table")).toBeTruthy();
  });

  it("names a focusable table region from the document's headers", async () => {
    render(<Markdown>{"| Identifier | Related |\n| --- | --- |\n| `profile-photo-check` | `account-access-review` |"}</Markdown>);
    const region = screen.getByRole("region", { name: "Identifier, Related" });
    expect(region.tabIndex).toBe(0);
    expect(region.contains(screen.getByRole("table"))).toBe(true);
    region.focus();
    expect(document.activeElement).toBe(region);
    expect(await axeViolations(region)).toEqual([]);
  });

  it("keeps identifiers whole in cells and wraps prose only at overflow, not code blocks", () => {
    const css = readFileSync(join(import.meta.dirname, "../blocks.css"), "utf8");
    const { container } = render(
      <>
        <style>{css}</style>
        <Markdown>{"A longword and [a link](https://example.com).\n\n- anotherlongword\n\n| Identifier | Related |\n| --- | --- |\n| `profile-photo-check` | `account-access-review` |\n\n```\nlong-code-line\n```"}</Markdown>
      </>,
    );
    for (const el of container.querySelectorAll("p, li, a, th, td")) {
      expect(getComputedStyle(el).overflowWrap).toBe("break-word");
    }
    for (const code of container.querySelectorAll("td code")) {
      expect(getComputedStyle(code).whiteSpace).toBe("nowrap");
    }
    expect(getComputedStyle(container.querySelector("pre")!).whiteSpace).toBe("pre");
    expect(getComputedStyle(container.querySelector(".kz-md-table")!).overflowX).toBe("auto");
    expect(getComputedStyle(container.querySelector("td")!).whiteSpace).toBe("nowrap");
  });

  it("shows a quiet generated chip before the document only with the host's words", () => {
    const { container, rerender } = render(<Markdown generated generatedLabel="Généré automatiquement">{"A document."}</Markdown>);
    expect(container.querySelector(".kz-md")?.firstElementChild?.textContent).toBe("Généré automatiquement");
    expect(screen.queryByRole("button")).toBeNull();
    rerender(<Markdown generatedLabel="Généré automatiquement">{"A document."}</Markdown>);
    expect(screen.queryByText("Généré automatiquement")).toBeNull();
    rerender(<Markdown generated>{"A document."}</Markdown>);
    expect(container.textContent).toBe("A document.");
    expect(container.querySelector("[generated], [generatedLabel]")).toBeNull();
  });

  it("puts every fenced block in a CodeBlock: highlighted, titled, with a copy button when it has words", () => {
    const { container } = render(<Markdown codeLabels={{ copy: "Copy", copied: "Copied" }}>{SOURCE}</Markdown>);
    const figure = container.querySelector("figure.kz-code");
    expect(figure?.querySelector(".th-keyword")?.textContent).toBe("const");
    expect(figure?.textContent).toContain("loader.ts");
    expect(screen.getByRole("button", { name: "Copy" })).toBeTruthy();
  });

  it("has no copy button, and no bar for an unlabelled plain block, when it has no words", () => {
    const { container } = render(<Markdown>{"```\nplain\n```"}</Markdown>);
    expect(container.querySelector("button")).toBeNull();
    expect(container.querySelector("figcaption")).toBeNull();
    expect(container.querySelector("pre")?.textContent).toBe("plain");
  });

  it("marks highlighted lines of a fence", () => {
    const { container } = render(<Markdown>{"```ts {2}\nconst a = 1;\nconst b = 2;\n```"}</Markdown>);
    expect(container.querySelectorAll(".th-line")[1]?.classList.contains("kz-line-highlight")).toBe(true);
  });

  it("never renders raw HTML: it stays text", () => {
    const { container } = render(<Markdown>{"<script>alert(1)</script>\n\nA <img src=x onerror=alert(1)> here <b>bold</b>"}</Markdown>);
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("b")).toBeNull();
    expect(container.textContent).toContain("<script>alert(1)</script>");
    expect(container.textContent).toContain("<b>bold</b>");
  });

  it("drops executable URLs from links and images", () => {
    const { container } = render(<Markdown>{"[click](javascript:alert(1)) and ![x](data:text/html,boom) and [ok](https://example.com)"}</Markdown>);
    expect([...container.querySelectorAll("a")].map((a) => a.getAttribute("href"))).toEqual(["https://example.com"]);
    expect(container.querySelector("img")?.getAttribute("src") ?? "").toBe("");
    expect(container.innerHTML).not.toContain("javascript:");
  });

  it("opens other sites with rel noopener, and hands the links of the site to the router's link", () => {
    const Router = ({ href, children, ...rest }: React.ComponentProps<"a">) => (
      <a href={href} data-router="" {...rest}>
        {children}
      </a>
    );
    const { container } = render(<Markdown linkAs={Router}>{"[out](https://example.com) [in](/docs) [here](#top) [mail](mailto:a@b.co)"}</Markdown>);
    const links = [...container.querySelectorAll("a")];
    expect(links.map((a) => [a.getAttribute("href"), a.hasAttribute("data-router"), a.getAttribute("rel")])).toEqual([
      ["https://example.com", false, "noopener noreferrer"],
      ["/docs", true, null],
      ["#top", true, null],
      ["mailto:a@b.co", false, null],
    ]);
  });

  it("renders footnotes and ordered lists that do not start at 1", () => {
    const { container } = render(<Markdown>{"A note[^1].\n\n3. three\n4. four\n\n[^1]: The footnote."}</Markdown>);
    expect(container.querySelector("sup a")?.getAttribute("href")).toBe("#kz-fn-1");
    expect(container.querySelector("#kz-fn-1")?.textContent).toContain("The footnote.");
    expect(container.querySelector("ol[start='3']")).toBeTruthy();
  });

  it("merges a className and marks a streaming text busy", () => {
    const { container } = render(
      <Markdown className="custom" streaming>
        {"Hello **wor"}
      </Markdown>,
    );
    expect(container.firstElementChild?.className).toContain("custom");
    expect(container.firstElementChild?.getAttribute("aria-busy")).toBe("true");
    expect(container.querySelector("strong")?.textContent).toBe("wor");
  });

  it("shows hard breaks and headings of every depth", () => {
    const { container } = render(<Markdown>{"a\\\nb\n\n### Three\n\n###### Six"}</Markdown>);
    expect(container.querySelector("br")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 3 })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 6 })).toBeTruthy();
  });
});

describe("a text that arrives in pieces", () => {
  const whole = "Here is **the answer**: use `createQueue` — see [the docs](https://krizaka.com/docs).";

  it("closes an open emphasis, code span or link at every cut, so no marker ever shows", () => {
    for (let n = 1; n <= whole.length; n += 1) {
      const { container, unmount } = render(<Markdown streaming>{whole.slice(0, n)}</Markdown>);
      expect(container.textContent).not.toMatch(/\*\*|`|\]\(|\[/);
      unmount();
    }
  });

  it("heals the end of a text", () => {
    expect(healStreaming("Hello **wor")).toBe("Hello **wor**");
    expect(healStreaming("Hello **")).toBe("Hello ");
    expect(healStreaming("Use `creat")).toBe("Use `creat`");
    expect(healStreaming("Use `")).toBe("Use ");
    expect(healStreaming("~~strike")).toBe("~~strike~~");
    expect(healStreaming("See [the docs](https://kri")).toBe("See the docs");
    expect(healStreaming("See [the docs")).toBe("See the docs");
    expect(healStreaming("A picture ![alt](https://x")).toBe("A picture ");
    expect(healStreaming("Done **bold** and `code`")).toBe("Done **bold** and `code`");
    expect(healStreaming("```ts\nconst a = `x")).toBe("```ts\nconst a = `x");
    expect(healStreaming("```ts\nconst a = 1;\n```\n\nAfter **it")).toBe("```ts\nconst a = 1;\n```\n\nAfter **it**");
    expect(healStreaming("A [b](c) done")).toBe("A [b](c) done");
  });

  it("heals in linear time on hostile input (many brackets)", () => {
    const started = Date.now();
    healStreaming("[\\".repeat(50_000));
    healStreaming("[](".repeat(50_000));
    healStreaming("![".repeat(50_000));
    expect(Date.now() - started).toBeLessThan(500);
  });

  it("shows an open code fence as code as it comes, and drops an empty heading at the end", () => {
    expect(parseSource("```ts\nconst a =", { streaming: true })).toEqual([{ type: "code", lang: "ts", value: "const a =" }]);
    expect(parseSource("Text\n\n# ", { streaming: true })).toHaveLength(1);
  });

  it("reads the source as it is when it is not streaming", () => {
    expect(parseSource("Hello **wor")[0]).toMatchObject({ type: "paragraph", children: [{ type: "text", value: "Hello **wor" }] });
  });
});
