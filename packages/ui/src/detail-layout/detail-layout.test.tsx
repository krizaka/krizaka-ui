import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { DetailLayout, DetailNotes, DetailSection, FormSteps, FormTotals } from "./index";

describe("DetailLayout", () => {
  it("renders the back link, the h1 with its status, the content and the side panel, with no axe violation", async () => {
    const { container } = render(
      <DetailLayout back={<a href="#list">Videos</a>} title="Night shoot" status={<span>Published</span>} meta="12:48" actions={<button type="button">Edit</button>} aside={<p>Stats</p>}>
        <p>Body</p>
      </DetailLayout>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Night shoot" })).toBeTruthy();
    expect(screen.getByRole("complementary").textContent).toBe("Stats");
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("DetailLayout (Show and Act additions)", () => {
  it("puts the notes column before the side panel, numbered, in an aside, with binder sections", async () => {
    const { container } = render(
      <DetailLayout title="Gagnon" notes={<DetailNotes title="Notes" emptyLabel="None" notes={[{ id: "a", body: "Call first", meta: "Eric" }, { id: "b", body: "Quote sent" }]} add={<button type="button">Add</button>} />} aside={<p>Details</p>}>
        <DetailSection title="Invoices" action={<a href="#all">All</a>}>x</DetailSection>
      </DetailLayout>,
    );
    expect(screen.getByRole("region", { name: "Invoices" })).toBeTruthy();
    const aside = screen.getByRole("complementary");
    expect(aside.querySelectorAll("ol > li")).toHaveLength(2);
    expect(aside.textContent?.indexOf("Notes")).toBeLessThan(aside.textContent?.indexOf("Details") ?? 0);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("says plainly when there are no notes", () => {
    render(<DetailNotes title="Notes" emptyLabel="No notes yet." notes={[]} />);
    expect(screen.getByText("No notes yet.")).toBeTruthy();
  });

  it("numbers the form's steps in an ordered list, each a named group, with the totals card", async () => {
    const { container } = render(
      <>
        <FormSteps steps={[{ id: "a", title: "Client", children: <p>one</p> }, { id: "b", title: "Terms", children: <p>two</p> }]} />
        <FormTotals>Total</FormTotals>
      </>,
    );
    expect(container.querySelectorAll("ol > li")).toHaveLength(2);
    expect(screen.getByRole("group", { name: /Client/ })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});
