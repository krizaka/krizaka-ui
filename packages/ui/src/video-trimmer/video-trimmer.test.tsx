import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { VideoTrimmer } from "./index";

describe("VideoTrimmer", () => {
  it("has two named handles read as times, bounded by each other, with no axe violation", async () => {
    const { container } = render(<VideoTrimmer duration={42} defaultValue={[8, 20]} frames={["/a.jpg", "/b.jpg"]} />);
    const start = screen.getByRole("slider", { name: "Start" });
    const end = screen.getByRole("slider", { name: "End" });
    expect(start.getAttribute("aria-valuetext")).toBe("0:08.0");
    expect(start.getAttribute("aria-valuemax")).toBe("19.5");
    expect(end.getAttribute("aria-valuemin")).toBe("8.5");
    expect(screen.getByText("0:12.0 kept")).toBeTruthy();
    expect(start.style.left).toBe(`${(8 / 42) * 100}%`);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("moves a handle with the arrows (Shift: a second), never past the other, and commits", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onValueCommit = vi.fn();
    render(<VideoTrimmer duration={30} defaultValue={[10, 12]} minLength={1} onValueChange={onValueChange} onValueCommit={onValueCommit} />);
    screen.getByRole("slider", { name: "Start" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith([10.1, 12]);
    await user.keyboard("{Shift>}{ArrowRight}{ArrowRight}{/Shift}");
    expect(onValueChange).toHaveBeenLastCalledWith([11, 12]);
    expect(onValueCommit).toHaveBeenLastCalledWith([11, 12]);
    screen.getByRole("slider", { name: "End" }).focus();
    await user.keyboard("{End}");
    expect(onValueChange).toHaveBeenLastCalledWith([11, 30]);
  });

  it("moves the playhead within the part kept", async () => {
    const user = userEvent.setup();
    const onSeek = vi.fn();
    render(<VideoTrimmer duration={30} defaultValue={[5, 10]} time={6} onSeek={onSeek} />);
    screen.getByRole("slider", { name: "Playhead" }).focus();
    await user.keyboard("{Home}");
    expect(onSeek).toHaveBeenLastCalledWith(5);
  });

  it("takes classes per part and a custom handle", () => {
    render(<VideoTrimmer duration={10} classNames={{ handle: "w-3", track: "h-10" }} renderHandle={(edge) => <span data-testid={`grip-${edge}`} />} />);
    expect(screen.getByRole("slider", { name: "Start" }).className).toContain("w-3");
    expect(screen.getByRole("slider", { name: "Start" }).className).not.toContain("w-6");
    expect(screen.getByTestId("grip-end")).toBeTruthy();
  });
});
