import { act, fireEvent, render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { CodeBlock, CodeTabs, highlight } from "./index";

describe("CodeBlock", () => {
  it("shows the file and the highlighted code, and says it copied, with no axe violation", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const { container } = render(<CodeBlock code={'name: "x" # one'} language="yaml" file="application.yml" copyLabel="Copy" copiedLabel="Copied" />);
    expect(container.querySelector("figcaption")?.textContent).toContain("application.yml");
    expect(container.querySelector(".kz-tk-string")?.textContent).toBe('"x"');
    expect(container.querySelector(".kz-tk-comment")?.textContent).toContain("# one");
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

  it("highlights tags in XML only, and leaves `#` alone in CSS", () => {
    const xml = render(<>{highlight("<parent>x</parent>", "xml")}</>);
    expect(xml.container.querySelector(".kz-tk-tag")).toBeTruthy();
    const css = render(<>{highlight("a { color: #fff }", "css")}</>);
    expect(css.container.querySelector(".kz-tk-comment")).toBeNull();
  });
});
