import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { PromoCodeField, type PromoCodeResult } from "./index";

const words = { label: "Promo code", applyLabel: "Apply", removeLabel: "Remove" };

describe("PromoCodeField", () => {
  it("applies on Enter, shows the effect, and removes", async () => {
    const user = userEvent.setup();
    const onApply = vi.fn<(code: string) => Promise<PromoCodeResult>>().mockResolvedValue({ ok: true, effect: "39 $ off" });
    const onRemove = vi.fn();
    const { container } = render(<PromoCodeField {...words} onApply={onApply} onRemove={onRemove} />);
    expect(await axeViolations(container)).toEqual([]);
    await user.type(screen.getByLabelText("Promo code"), "FOUNDER{Enter}");
    expect(onApply).toHaveBeenCalledWith("FOUNDER");
    expect((await screen.findAllByText(/39 \$ off/)).length).toBeGreaterThan(0);
    expect(container.firstElementChild?.getAttribute("data-state")).toBe("applied");
    await user.click(screen.getByRole("button", { name: "Remove FOUNDER" }));
    expect(onRemove).toHaveBeenCalledOnce();
    expect(container.firstElementChild?.getAttribute("data-state")).toBe("idle");
  });

  it("keeps the input and links the refusal by aria-describedby", async () => {
    const user = userEvent.setup();
    render(<PromoCodeField {...words} onApply={async () => ({ ok: false, message: "Unknown code." })} />);
    const input = screen.getByLabelText("Promo code") as HTMLInputElement;
    await user.type(input, "NOPE");
    await user.click(screen.getByRole("button", { name: "Apply" }));
    const message = await screen.findByText("Unknown code.");
    expect(input.value).toBe("NOPE");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe(message.id);
  });

  it("marks an expired code and disables Apply while empty", async () => {
    const user = userEvent.setup();
    const { container } = render(<PromoCodeField {...words} onApply={async () => ({ ok: false, message: "Expired.", expired: true })} />);
    expect((screen.getByRole("button", { name: "Apply" }) as HTMLButtonElement).disabled).toBe(true);
    await user.type(screen.getByLabelText("Promo code"), "OLD{Enter}");
    await screen.findByText("Expired.");
    expect(container.firstElementChild?.getAttribute("data-state")).toBe("expired");
  });

  it("starts applied when given a code", () => {
    render(<PromoCodeField {...words} applied={{ code: "X", effect: "10 %" }} onApply={async () => ({ ok: true, effect: "" })} />);
    expect(screen.getByRole("button", { name: "Remove X" })).toBeTruthy();
  });
});
