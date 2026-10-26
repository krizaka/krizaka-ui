import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { axeViolations } from "../test/axe";
import { EmbedFacade } from "./index";

const tiktok = { platform: "tiktok" as const, url: "https://www.tiktok.com/@cedre/video/7301234567890123456", title: "Latest reel", playLabel: "Load TikTok and play" };

describe("EmbedFacade (krizaka-ui#605)", () => {
  it("sends nothing to the platform before the click: no frame, no script, no platform picture", async () => {
    const { container } = render(<EmbedFacade {...tiktok} poster="https://i.ytimg.com/vi/x/hq.jpg" />);
    expect(container.querySelector("iframe")).toBeNull();
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("video, audio, embed, object, link[rel=preload]")).toBeNull();
    // A poster on a platform's own domain would be a request: it is refused, not drawn.
    expect(container.querySelector("img")).toBeNull();
    for (const node of container.querySelectorAll("[src], [href], [srcset], [data]")) {
      expect(node.outerHTML, "no address of a platform").not.toMatch(/tiktok|youtube|ytimg|instagram|fbcdn/i);
    }
    expect(await axeViolations(container)).toEqual([]);
  });

  it("draws the host's own poster with no referrer, lazily, and decoratively", () => {
    const { container } = render(<EmbedFacade {...tiktok} poster="https://krizaka-assets.b-cdn.net/site/reel-poster.webp" />);
    const img = container.querySelector("img") as HTMLImageElement;
    expect(img.getAttribute("src")).toBe("https://krizaka-assets.b-cdn.net/site/reel-poster.webp");
    expect(img.getAttribute("referrerpolicy")).toBe("no-referrer");
    expect(img.getAttribute("loading")).toBe("lazy");
    expect(img.getAttribute("alt")).toBe("");
  });

  it("is one button that says what it loads, reachable by keyboard", () => {
    render(<EmbedFacade {...tiktok} notice="TikTok will see your visit." />);
    const button = screen.getByRole("button", { name: "Load TikTok and play" });
    expect(button.getAttribute("type")).toBe("button");
    expect(screen.getByText("TikTok will see your visit.")).toBeTruthy();
    expect(screen.getByRole("group", { name: "Latest reel" })).toBeTruthy();
  });

  it("loads the frame only after the click, with a minimal sandbox and permissions, and calls onLoad once", () => {
    const onLoad = vi.fn();
    const { container } = render(<EmbedFacade {...tiktok} onLoad={onLoad} />);
    fireEvent.click(screen.getByRole("button", { name: "Load TikTok and play" }));
    const frame = container.querySelector("iframe") as HTMLIFrameElement;
    expect(frame.getAttribute("src")).toBe("https://www.tiktok.com/embed/v2/7301234567890123456");
    expect(frame.getAttribute("title")).toBe("Latest reel");
    const sandbox = frame.getAttribute("sandbox") ?? "";
    expect(sandbox.split(" ")).toEqual(expect.arrayContaining(["allow-scripts", "allow-same-origin"]));
    expect(sandbox).not.toMatch(/allow-top-navigation|allow-forms|allow-modals|allow-downloads/);
    expect(frame.getAttribute("allow")).toBe("fullscreen; encrypted-media");
    expect(frame.getAttribute("referrerpolicy")).toBe("strict-origin-when-cross-origin");
    expect(screen.queryByRole("button", { name: "Load TikTok and play" })).toBeNull();
    expect(onLoad).toHaveBeenCalledTimes(1);
  });

  it("moves focus to the frame when it loads, so the keyboard does not fall off the page", () => {
    const { container } = render(<EmbedFacade {...tiktok} />);
    fireEvent.click(screen.getByRole("button"));
    expect(document.activeElement).toBe(container.querySelector("iframe"));
  });

  it("renders nothing for an address it will not embed", () => {
    const { container } = render(<EmbedFacade {...tiktok} url="https://vm.tiktok.com/ZMabc123/" />);
    expect(container.firstChild).toBeNull();
  });

  it("fills its parent so it fits a television's screen, and takes a ratio", () => {
    const { container } = render(<EmbedFacade {...tiktok} aspectRatio="4 / 5" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("kz-embed");
    expect(root.style.getPropertyValue("--kz-embed-ratio")).toBe("4 / 5");
    expect(root.dataset.platform).toBe("tiktok");
  });
});
