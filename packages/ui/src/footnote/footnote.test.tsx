import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Caption, FootnoteRef, Footnotes } from "./index";

describe("Footnote & caption", () => {
  it("links each reference to its note and each note back, captions a figure, with no axe violation", async () => {
    const { container } = render(
      <article>
        <figure>
          <div>figure</div>
          <Caption figure="fig. 2">The owl reads every line.</Caption>
        </figure>
        <p>
          First month only
          <FootnoteRef n={1} />.
        </p>
        <Footnotes notes={["Civil Code of Québec, art. 1904."]} />
      </article>,
    );
    expect(container.querySelector("figcaption")?.textContent).toBe("fig. 2 — The owl reads every line.");
    const ref = screen.getByRole("link", { name: "Note 1" });
    expect(ref.getAttribute("href")).toBe("#fn-1");
    expect(ref.closest("sup")?.id).toBe("fn-ref-1");
    const notes = screen.getByRole("region", { name: "Notes" });
    expect(notes.querySelector("li")?.id).toBe("fn-1");
    expect(screen.getByRole("link", { name: "Back to the text (1)" }).getAttribute("href")).toBe("#fn-ref-1");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("captions outside a figure as a paragraph, and keeps several sets of notes apart", () => {
    render(
      <>
        <Caption as="p">A plain caption.</Caption>
        <FootnoteRef n={1} prefix="law" />
      </>,
    );
    expect(screen.getByText("A plain caption.").tagName).toBe("P");
    expect(screen.getByRole("link", { name: "Note 1" }).getAttribute("href")).toBe("#law-1");
  });
});
