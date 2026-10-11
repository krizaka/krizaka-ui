import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { DetailLayout } from "./index";

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
