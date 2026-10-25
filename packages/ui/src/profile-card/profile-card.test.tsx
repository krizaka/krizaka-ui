import { render, screen } from "@testing-library/react";

import DetailProfileExample from "../../registry/examples/detail-layout/profile";
import BannerExample from "../../registry/examples/profile-card/banner";
import { DetailLayout } from "../detail-layout";
import { axeViolations } from "../test/axe";
import { ProfileBanner } from "./index";

describe("ProfileBanner (#650)", () => {
  it("is a section headed by the name (h1), its words never on the cover, with no axe violation", async () => {
    const { container } = render(<BannerExample />);
    const heading = screen.getByRole("heading", { level: 1, name: "Eric Tremblay" });
    const cover = container.querySelector("[data-cover]")!;
    // No text over the banner, at any width: the cover holds no words, only the picture or the gradient.
    expect(cover.textContent).toBe("");
    expect(cover.contains(heading)).toBe(false);
    expect(screen.getByText("Client since 2024 · 14 visits")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Book" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("tints the cover with the brand's accent without a picture, and lays a scrim over a picture", () => {
    const { container, rerender } = render(<ProfileBanner brand="akinaza" avatar={<span />} title="Eric" />);
    const cover = container.querySelector("[data-cover]")!;
    expect(cover.className).toContain("from-accent/30");
    expect(cover.querySelector("[aria-hidden]")).toBeNull();
    expect(container.querySelector("section")!.className).toContain("brand-akinaza");
    rerender(<ProfileBanner avatar={<span />} title="Eric" banner={<img src="cover.jpg" alt="" />} />);
    const scrim = container.querySelector("[data-cover] > span[aria-hidden]")!;
    expect(scrim.className).toContain("from-surface-0/70");
  });

  it("overlaps the avatar on the cover at every width (a negative margin from the phone up) with the page's ring", () => {
    const { container } = render(<ProfileBanner avatar={<span />} title="Eric" />);
    const avatar = container.querySelector("[data-avatar]")!.className;
    expect(avatar).toContain("-mt-10");
    expect(avatar).toContain("sm:-mt-14");
    expect(avatar).toContain("ring-surface-0");
  });

  it("follows the page's outline with titleAs", () => {
    render(<ProfileBanner avatar={<span />} title="Eric" titleAs="h2" />);
    expect(screen.getByRole("heading", { level: 2, name: "Eric" })).toBeTruthy();
  });
});

describe("DetailLayout with a cover (#650)", () => {
  it("draws its header as a ProfileBanner: the cover, the avatar, the h1, the actions", async () => {
    const { container } = render(<DetailProfileExample />);
    expect(container.querySelector("[data-cover]")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1, name: "Eric Tremblay" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Open the file" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("keeps the plain header without a cover", () => {
    const { container } = render(
      <DetailLayout title="Night shoot">
        <p>Body</p>
      </DetailLayout>,
    );
    expect(container.querySelector("[data-cover]")).toBeNull();
  });
});
