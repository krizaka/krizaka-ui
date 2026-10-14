import { render, screen, waitFor } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Avatar } from "./index";

describe("Avatar", () => {
  it("shows the fallback without an image, with its size, and no axe violation", async () => {
    const { container } = render(<Avatar fallback="AB" size="lg" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.size).toBe("lg");
    expect(root.className).toContain("h-14");
    expect(await screen.findByText("AB")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("lets the product's className win", () => {
    const { container } = render(<Avatar fallback="AB" className="rounded-lg" />);
    const classes = (container.firstElementChild as HTMLElement).className.split(" ");
    expect(classes).toContain("rounded-lg");
    expect(classes).not.toContain("rounded-full");
  });

  it("groups avatars and counts the rest past max", async () => {
    const { container } = render(
      <Avatar.Group max={2}>
        <Avatar fallback="A" />
        <Avatar fallback="B" />
        <Avatar fallback="C" />
        <Avatar fallback="D" />
      </Avatar.Group>,
    );
    expect(await screen.findByText("+2")).toBeTruthy();
    expect(screen.queryByText("C")).toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });
});

// jsdom loads no image: Radix probes with `new Image()`, so this stand-in loads every URL but those containing "broken".
class FakeImage extends EventTarget {
  referrerPolicy = "";
  crossOrigin = "";
  complete = false;
  naturalWidth = 0;
  set src(url: string) {
    queueMicrotask(() => {
      const broken = url.includes("broken");
      this.complete = true;
      this.naturalWidth = broken ? 0 : 256;
      this.dispatchEvent(new Event(broken ? "error" : "load"));
    });
  }
}

describe("Avatar default pictures", () => {
  const RealImage = window.Image;
  beforeEach(() => {
    window.Image = FakeImage as never;
  });
  afterEach(() => {
    window.Image = RealImage;
  });

  it("shows the brand's default picture when there is no photo", async () => {
    const { container } = render(<Avatar fallback="AB" defaultAvatar={{ brand: "orochia", tone: 2 }} />);
    await waitFor(() => expect(container.querySelector("img")?.getAttribute("src")).toBe("https://krizaka-assets.b-cdn.net/people/defaults/v1/orochia/person-2-256.webp"));
  });

  it("falls back to the default picture when the photo fails, and fallbackSrc wins over it", async () => {
    const { container, rerender } = render(<Avatar src="https://example.test/broken.jpg" defaultAvatar={{ brand: "yasakia", tone: 5 }} size="xl" />);
    await waitFor(() => expect(container.querySelector("img")?.getAttribute("src")).toBe("https://krizaka-assets.b-cdn.net/people/defaults/v1/yasakia/person-5-512.webp"));
    rerender(<Avatar src="https://example.test/broken.jpg" fallbackSrc="https://example.test/mine.webp" defaultAvatar={{ brand: "yasakia", tone: 5 }} />);
    await waitFor(() => expect(container.querySelector("img")?.getAttribute("src")).toBe("https://example.test/mine.webp"));
  });

  it("keeps the photo when it loads", async () => {
    const { container } = render(<Avatar src="https://example.test/me.jpg" defaultAvatar={{ brand: "orazaka" }} />);
    await waitFor(() => expect(container.querySelector("img")?.getAttribute("src")).toBe("https://example.test/me.jpg"));
  });
});
