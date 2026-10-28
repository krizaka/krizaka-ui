import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { prices, words } from "../../registry/examples/price-catalogue-editor/default";
import { axeViolations } from "../test/axe";
import { PriceCatalogueEditor } from "./index";

const setup = (extra: Partial<React.ComponentProps<typeof PriceCatalogueEditor>> = {}) =>
  render(<PriceCatalogueEditor prices={prices} words={words} locale="en-CA" today="2026-10-28" onSchedule={async () => ({ ok: true })} {...extra} />);

describe("PriceCatalogueEditor", () => {
  it("shows one entry per row: amount, unit, taxes, availability as a word, on quote", async () => {
    const { container } = setup();
    expect(await axeViolations(container)).toEqual([]);
    const rows = screen.getAllByRole("listitem").filter((li) => li.hasAttribute("data-availability"));
    expect(rows).toHaveLength(3);
    expect(within(rows[0]!).getByText("$9.99")).toBeTruthy();
    expect(within(rows[0]!).getByText(/per month · plus taxes/)).toBeTruthy();
    expect(within(rows[0]!).getByText("Public")).toBeTruthy();
    expect(within(rows[1]!).getByText("First customers", { selector: "dt" })).toBeTruthy();
    expect(within(rows[2]!).getByText("On quote")).toBeTruthy();
  });

  it("writes the amount the way the locale does", () => {
    setup({ locale: "fr-CA" });
    expect(screen.getAllByText(/9,99/).length).toBeGreaterThan(0);
  });

  it("schedules a change from today by default, in cents, and says subscriptions keep their price", async () => {
    const user = userEvent.setup();
    const onSchedule = vi.fn().mockResolvedValue({ ok: true });
    setup({ onSchedule });
    await user.click(screen.getByRole("button", { name: "Change — Demo · Pro" }));
    expect(screen.getByText("Current subscriptions keep their price.")).toBeTruthy();
    const date = screen.getByLabelText("From") as HTMLInputElement;
    expect(date.value).toBe("2026-10-28");
    expect(date.min).toBe("2026-10-28");
    const amount = screen.getByLabelText("Amount");
    await user.clear(amount);
    await user.type(amount, "12.50");
    await user.click(screen.getByRole("button", { name: "Schedule the change" }));
    expect(onSchedule).toHaveBeenCalledWith("demo.pro", { amountCents: 1250, unit: "month", availability: "public", limits: {} }, "2026-10-28");
    expect(screen.queryByRole("form")).toBeNull();
    expect(screen.getByRole("status").textContent).toBe("Change scheduled.");
  });

  it("refuses a past date and keeps the form open with the host's refusal", async () => {
    const user = userEvent.setup();
    const onSchedule = vi.fn().mockResolvedValue({ ok: false, message: "Not a valid price." });
    setup({ onSchedule });
    await user.click(screen.getByRole("button", { name: "Change — Demo · Founder" }));
    const date = screen.getByLabelText("From") as HTMLInputElement;
    await user.clear(date);
    await user.type(date, "2026-01-01");
    expect((screen.getByRole("button", { name: "Schedule the change" }) as HTMLButtonElement).disabled).toBe(true);
    await user.clear(date);
    await user.type(date, "2026-12-01");
    await user.clear(screen.getByLabelText("First customers", { selector: "input" }));
    await user.type(screen.getByLabelText("First customers", { selector: "input" }), "40");
    await user.click(screen.getByRole("button", { name: "Schedule the change" }));
    expect(onSchedule).toHaveBeenCalledWith("demo.founder", expect.objectContaining({ limits: { founderCap: 40 } }), "2026-12-01");
    expect((await screen.findByRole("alert")).textContent).toBe("Not a valid price.");
  });

  it("lists the scheduled changes and loads the history only when its fold opens", async () => {
    const user = userEvent.setup();
    const loadHistory = vi.fn().mockResolvedValue([
      { versionId: "1", at: "2026-10-01T12:00:00.000Z", actorLabel: "Mira", effectiveFrom: "2026-10-01T12:00:00.000Z", before: null, after: { amountCents: 999, unit: "month", availability: "public", limits: {} } },
    ]);
    setup({ loadHistory });
    expect(loadHistory).not.toHaveBeenCalled();
    expect(screen.getByText("Scheduled changes (1)")).toBeTruthy();
    expect(screen.getByText(/\$11\.99 per month · from/)).toBeTruthy();
    await user.click(screen.getAllByText("History")[0]!);
    expect(loadHistory).toHaveBeenCalledWith("demo.pro");
    expect(await screen.findByText(/Mira, .*: — → \$9\.99 per month, from/)).toBeTruthy();
  });

  it("is reachable and operable by keyboard alone", async () => {
    const user = userEvent.setup();
    setup();
    await user.tab();
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Change — Demo · Pro");
    await user.keyboard("{Enter}");
    expect(screen.getByLabelText("Amount")).toBeTruthy();
  });
});
