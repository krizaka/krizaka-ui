import { act, fireEvent, render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { CodeBlock, CodeTabs, highlight, normalizeCodeLanguage } from "./index";

describe("CodeBlock", () => {
  it("shows the file and the highlighted code, and says it copied, with no axe violation", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const { container } = render(<CodeBlock code={'name: "x" # one'} language="yaml" file="application.yml" copyLabel="Copy" copiedLabel="Copied" />);
    expect(container.querySelector("figcaption")?.textContent).toContain("application.yml");
    expect(container.querySelector(".th-string")?.textContent).toBe('"x"');
    expect(container.querySelector(".th-comment")?.textContent).toContain("# one");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    });
    expect(writeText).toHaveBeenCalledWith('name: "x" # one');
    expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("puts samples under tabs", async () => {
    const { container } = render(
      <CodeTabs
        label="Build tool"
        tabs={[
          { id: "maven", label: "Maven", content: <p>pom</p> },
          { id: "gradle", label: "Gradle", content: <p>kts</p> },
        ]}
      />,
    );
    expect(screen.getByRole("tablist", { name: "Build tool" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Maven" }).getAttribute("aria-selected")).toBe("true");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("highlights what TanStack Highlight knows — tags in XML, commands in a shell, annotations in Java — and a `#` is not a comment in CSS", () => {
    const xml = render(<>{highlight("<parent>x</parent>", "xml")}</>);
    expect(xml.container.querySelector(".th-tag")?.textContent).toBe("parent");
    const bash = render(<>{highlight("npm install @krizaka/ui # go", "bash")}</>);
    expect(bash.container.querySelector(".th-command")?.textContent).toBe("npm");
    expect(bash.container.querySelector(".th-comment")?.textContent).toBe("# go");
    const java = render(<>{highlight("@Entity\npublic class A { String s = \"x\"; }", "java")}</>);
    expect(java.container.querySelector(".th-attr")?.textContent).toBe("@Entity");
    expect(java.container.querySelector(".th-keyword")?.textContent).toBe("public");
    const css = render(<>{highlight("a { color: #fff }", "css")}</>);
    expect(css.container.querySelector(".th-comment")).toBeNull();
  });

  it.each([
    ["ts", "const a: number = 1", ".th-keyword"],
    ["tsx", "const a = <Box />", ".th-keyword"],
    ["json", '{ "a": 1 }', ".th-number"],
    ["yaml", "a: yes # c", ".th-comment"],
    ["html", "<p>x</p>", ".th-tag"],
    ["css", "a { color: red }", ".th-selector"],
    ["kotlin", "val a = 1", ".th-keyword"],
    ["properties", "# c\na=b", ".th-comment"],
  ])("has a grammar for %s", (language, code, selector) => {
    const { container } = render(<>{highlight(code, language)}</>);
    expect(container.querySelector(selector)).toBeTruthy();
    expect(normalizeCodeLanguage(language)).not.toBe("plaintext");
  });

  it("shows an unknown language as plain text, and never as markup", () => {
    const { container } = render(<>{highlight("<script>alert(1)</script>", "klingon")}</>);
    expect(normalizeCodeLanguage("klingon")).toBe("plaintext");
    expect(normalizeCodeLanguage()).toBe("plaintext");
    expect(container.querySelector("script")).toBeNull();
    expect(container.textContent).toBe("<script>alert(1)</script>");
  });

  it("numbers the lines and sets some apart, dimming the rest around a focus", async () => {
    const code = "const a = 1;\nconst b = 2;\nconst c = 3;";
    const { container } = render(
      <CodeBlock
        code={code}
        language="ts"
        copyLabel="Copy"
        copiedLabel="Copied"
        lineNumbers
        annotations={[
          { lines: 2, kind: "focus" },
          { lines: [3, 3], kind: "added" },
        ]}
      />,
    );
    const lines = [...container.querySelectorAll(".th-line")];
    expect(lines.map((l) => l.getAttribute("data-line"))).toEqual(["1", "2", "3"]);
    expect(lines[1]?.classList.contains("kz-line-focus")).toBe(true);
    expect(lines[2]?.getAttribute("data-kind")).toBe("added");
    expect(container.querySelector("pre")?.hasAttribute("data-focus")).toBe(true);
    expect(container.querySelector("pre")?.classList.contains("th-code--line-numbers")).toBe(true);
    expect(container.textContent).toContain("const b = 2;");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("does not colour when `highlight` is off", () => {
    const { container } = render(<CodeBlock code="const a = 1" language="ts" copyLabel="Copy" copiedLabel="Copied" highlight={false} />);
    expect(container.querySelector(".th-token")).toBeNull();
  });
});
