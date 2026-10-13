import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { Slider } from "./index";

describe("Slider", () => {
  it("names its thumb and speaks its value, with no axe violation", async () => {
    const { container } = render(<Slider label="Speed" defaultValue={1} min={0.5} max={2} step={0.25} formatValue={(v) => `${v}×`} />);
    const thumb = screen.getByRole("slider", { name: "Speed" });
    expect(thumb.getAttribute("aria-valuenow")).toBe("1");
    expect(thumb.getAttribute("aria-valuetext")).toBe("1×");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("moves with the arrows, Home and End, and reports a number", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Slider label="Volume" defaultValue={50} step={10} onValueChange={onValueChange} />);
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith(60);
    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(onValueChange).toHaveBeenLastCalledWith(40);
    await user.keyboard("{End}");
    expect(onValueChange).toHaveBeenLastCalledWith(100);
    await user.keyboard("{Home}");
    expect(screen.getByRole("slider").getAttribute("aria-valuenow")).toBe("0");
  });

  it("shows a visible label and value, which name the thumb", () => {
    render(<Slider label="Brightness" showLabel value={-20} min={-100} max={100} origin={0} formatValue={(v) => `${v} %`} />);
    const thumb = screen.getByRole("slider", { name: "Brightness" });
    expect(thumb.getAttribute("aria-valuetext")).toBe("-20 %");
    expect(screen.getByText("-20 %")).toBeTruthy();
    const fill = document.querySelector("[data-origin]") as HTMLElement;
    expect(fill.style.left).toBe("40%");
    expect(fill.style.right).toBe("50%");
  });

  it("holds a range with two named thumbs and reports a pair", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Slider label="Price" thumbLabels={["Minimum", "Maximum"]} defaultValue={[20, 80]} step={5} onValueChange={onValueChange} />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
    screen.getByRole("slider", { name: "Maximum" }).focus();
    await user.keyboard("{ArrowLeft}");
    expect(onValueChange).toHaveBeenLastCalledWith([20, 75]);
  });
});

describe("Slider looks", () => {
  it("draws a graduation per step, its words under the track, the value floating over the thumb", () => {
    const { container } = render(
      <Slider
        label="Speed"
        defaultValue={1}
        min={0.5}
        max={2}
        step={0.25}
        ticks
        floatingValue="always"
        marks={[
          { value: 0.5, label: "0.5×" },
          { value: 2, label: "2×" },
        ]}
        formatValue={(v) => `${v}×`}
      />,
    );
    expect(container.querySelectorAll("[data-orientation=horizontal][style*='left']").length).toBeGreaterThanOrEqual(7);
    expect(screen.getByText("2×")).toBeTruthy();
    const bubble = screen.getByRole("slider", { name: "Speed" }).querySelector("[aria-hidden]");
    expect(bubble?.textContent).toBe("1×");
  });

  it("vertical: a vertical slider, Up raises it", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Slider label="Voice" orientation="vertical" defaultValue={50} step={10} onValueChange={onValueChange} />);
    const thumb = screen.getByRole("slider", { name: "Voice" });
    expect(thumb.getAttribute("aria-orientation")).toBe("vertical");
    thumb.focus();
    await user.keyboard("{ArrowUp}");
    expect(onValueChange).toHaveBeenLastCalledWith(60);
  });
});
