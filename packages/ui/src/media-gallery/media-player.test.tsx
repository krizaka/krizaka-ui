import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { MediaPlayer } from "./player-index";

describe("MediaPlayer", () => {
  it("is the player itself inline, 16:9 or vertical", () => {
    const { rerender } = render(<MediaPlayer src="/f.mp4" title="Film" />);
    expect(screen.getByRole("region", { name: "Film" })).toBeTruthy();
    rerender(<MediaPlayer src="/f.mp4" title="Film" vertical />);
    expect((screen.getByRole("region", { name: "Film" }) as HTMLElement).style.aspectRatio).toBe("9 / 16");
  });

  it("is one named poster button in a lightbox: nothing is fetched until the press, then the dialog plays with sound", async () => {
    const user = userEvent.setup();
    const play = vi.fn(() => Promise.resolve());
    Object.defineProperty(HTMLMediaElement.prototype, "play", { configurable: true, value: play });
    const { container } = render(<MediaPlayer mode="lightbox" src="/f.mp4" poster="/p.jpg" title="Film" playLabel="Play the film" caption="Fig. 1" closeLabel="Close the film" />);
    expect(document.querySelector("video")).toBeNull();
    expect(await axeViolations(container)).toEqual([]);
    await user.click(screen.getByRole("button", { name: /Play the film/ }));
    expect(await screen.findByRole("dialog", { name: "Film" })).toBeTruthy();
    expect(play).toHaveBeenCalled();
    expect((document.querySelector("video") as HTMLVideoElement).muted).toBe(false);
    await user.click(screen.getByRole("button", { name: "Close the film" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
