import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { SkipLink } from "./index";

function Page({ href }: { href?: `#${string}` }) {
  return (
    <>
      <SkipLink href={href}>Skip to content</SkipLink>
      <nav aria-label="Main">
        <a href="#a">One</a>
        <a href="#b">Two</a>
      </nav>
      <main id="content">Content</main>
      <div id="other">Other</div>
    </>
  );
}

describe("SkipLink", () => {
  it("is the first tab stop and Enter moves focus to the content", async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.tab();
    const link = screen.getByRole("link", { name: "Skip to content" });
    expect(document.activeElement).toBe(link);
    await user.keyboard("{Enter}");
    expect(document.activeElement).toBe(screen.getByRole("main"));
    expect(screen.getByRole("main").getAttribute("tabindex")).toBe("-1");
  });

  it("lands on another target through `href`, hidden until focused, with no axe violation", async () => {
    const user = userEvent.setup();
    const { container } = render(<Page href="#other" />);
    const link = screen.getByRole("link", { name: "Skip to content" });
    expect(link.getAttribute("href")).toBe("#other");
    expect(link.className).toContain("sr-only");
    expect(link.className).toContain("focus:not-sr-only");
    await user.tab();
    await user.keyboard("{Enter}");
    expect(document.activeElement).toBe(document.getElementById("other"));
    expect(await axeViolations(container)).toEqual([]);
  });

  it("keeps a target that is already focusable as it is and ignores a missing one", async () => {
    const user = userEvent.setup();
    render(
      <>
        <SkipLink href="#nope">Skip</SkipLink>
        <button type="button">After</button>
      </>,
    );
    await user.tab();
    await user.keyboard("{Enter}");
    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Skip" }));
  });
});
