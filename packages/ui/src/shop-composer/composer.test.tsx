import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ShopPage } from "../shop/schema";
import { shopStarters } from "../shop/starters";
import { axeViolations } from "../test/axe";
import { AUTOSAVE_MS, ShopComposer, type ShopComposerPreset } from "./composer";

const presets: ShopComposerPreset[] = [
  { id: "salon-vitrine", version: 1, name: "Vitrine", density: "compact", variants: { hero: "poster", services: "menu" } },
  { id: "salon-atelier", version: 1, name: "Atelier", density: "airy", variants: { hero: "split", services: "menu", faq: "list" } },
];
const looks: ShopComposerPreset[] = [
  { id: "look-cahier", version: 1, name: "Cahier", density: "airy", variants: { hero: "split", services: "index" }, accent: "akinaza", accents: ["akinaza", "akinaza:accent-2"] },
  { id: "look-affiche", version: 1, name: "Affiche", density: "compact", variants: { hero: "banner", services: "menu" }, accent: "akinaza", accents: ["akinaza", "yomizaka"] },
];

beforeEach(() => {
  // happy-dom refuses to load an iframe page and reports it: the preview's page is the product's, not under test here.
  const error = console.error.bind(console);
  vi.spyOn(console, "error").mockImplementation((...args) => {
    if (!String(args[0]).includes("Iframe page loading is disabled")) error(...args);
  });
  Object.defineProperty(window, "matchMedia", { configurable: true, value: (q: string) => ({ matches: false, media: q, addEventListener: () => {}, removeEventListener: () => {} }) });
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const doc = (): ShopPage => structuredClone(shopStarters.salonCompact);
const setup = (props: Partial<React.ComponentProps<typeof ShopComposer>> = {}) => {
  const onChange = vi.fn();
  const onPublish = vi.fn();
  const user = userEvent.setup();
  const view = render(<ShopComposer value={doc()} onChange={onChange} onPublish={onPublish} previewUrl="" presets={presets} {...props} />);
  return { user, onChange, onPublish, ...view };
};
const rowButtons = () => within(screen.getByRole("navigation", { name: "Sections" })).getAllByRole("button", { name: /^(Hero|Services|Booking|Photos|Reviews)/ });
const order = () => screen.getByRole("navigation", { name: "Sections" }).querySelectorAll("ol > li").length;
const live = () => document.querySelector("p[role=status].sr-only")!.textContent!.replace(/\u200b/g, "");

describe("the composer — keyboard only", () => {
  it("is labelled and has no axe violation: an outline, a titled preview, an inspector", async () => {
    const { container } = setup();
    expect(screen.getByRole("navigation", { name: "Sections" })).toBeTruthy();
    expect(screen.getByTitle("Live preview of your page").tagName).toBe("IFRAME");
    expect(screen.getByRole("complementary", { name: "Section" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("moves a section with Alt+ArrowDown / Alt+ArrowUp, says where it went, and keeps the focus on its row", async () => {
    const { user } = setup();
    const names = () => rowButtons().map((b) => /^(Hero|Services|Booking|Photos|Reviews)/.exec(b.textContent!)![1]);
    const before = names();
    const services = rowButtons().find((b) => b.textContent!.startsWith("Services"))!;
    services.focus();
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    expect(live()).toBe("Services moved to position 4 of 6");
    const after = names();
    expect(after.indexOf("Services")).toBe(before.indexOf("Services") + 1);
    expect(document.activeElement?.textContent).toMatch(/^Services/);
    await user.keyboard("{Alt>}{ArrowUp}{/Alt}");
    expect(names()).toEqual(before);
    expect(document.activeElement?.textContent).toMatch(/^Services/);
  });

  it("does not take the focus back to the outline when something else changes later (typing in a field)", async () => {
    const { user } = setup();
    rowButtons().find((b) => b.textContent!.startsWith("Services"))!.focus();
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    await user.click(rowButtons()[0]!);
    const photo = screen.getByRole("textbox", { name: "Photo" });
    await user.click(photo);
    await user.keyboard("ab");
    expect(document.activeElement).toBe(photo);
    // emptying an optional field is an absent setting, not an invalid one
    await user.keyboard("{Backspace}{Backspace}");
    await user.click(screen.getByRole("button", { name: "Publish" }));
    expect(within(await screen.findByRole("dialog")).queryByRole("alert")).toBeNull();
  });

  it("never lets a section go above the hero, nor the hero move", async () => {
    const { user } = setup();
    const photos = rowButtons().find((b) => b.textContent!.startsWith("Photos"))!;
    photos.focus();
    for (let i = 0; i < 6; i++) await user.keyboard("{Alt>}{ArrowUp}{/Alt}");
    expect(rowButtons()[0]!.textContent).toMatch(/^Hero/);
    expect(live()).toBe("Photos cannot move further");
    rowButtons()[0]!.focus();
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    expect(live()).toBe("Hero cannot move further");
  });

  it("moves with the row's menu, by keyboard: Move to top, then announced, focus on the row", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Actions for Photos" }));
    await user.click(await screen.findByRole("menuitem", { name: "Move to top" }));
    expect(live()).toBe("Photos moved to position 2 of 6");
    expect(rowButtons()[1]!.textContent).toMatch(/^Photos/);
  });

  it("walks the rows with the arrow keys, and shows the selected section's inspector", async () => {
    const { user } = setup();
    rowButtons()[0]!.focus();
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(rowButtons()[1]);
    await user.keyboard("{Enter}");
    expect(rowButtons()[1]!.getAttribute("aria-current")).toBe("true");
  });

  it("hides and shows a section with its switch (Space), and says so", async () => {
    const { user } = setup();
    const toggle = screen.getByRole("switch", { name: "Show Reviews" });
    toggle.focus();
    await user.keyboard(" ");
    expect(live()).toBe("Reviews is hidden");
    expect(toggle.getAttribute("aria-checked")).toBe("false");
    await user.keyboard(" ");
    expect(live()).toBe("Reviews is shown");
  });

  it("changes how a section is drawn from the keyboard (Space on a variant)", async () => {
    const { user, onChange } = setup();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await user.click(rowButtons().find((b) => b.textContent!.startsWith("Services"))!);
    const picker = screen.getByRole("radiogroup", { name: /Services: How it is drawn/ });
    const radios = within(picker).getAllByRole("radio");
    expect(radios[0]!.getAttribute("aria-checked")).toBe("true");
    radios[1]!.focus();
    await user.keyboard(" ");
    expect(within(picker).getAllByRole("radio")[1]!.getAttribute("aria-checked")).toBe("true");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(AUTOSAVE_MS + 50);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    const saved = onChange.mock.calls[0]![0] as ShopPage;
    expect(saved.sections.find((s) => s.key === "s_services")!.variant).toBe("cards");
    expect(screen.getByText("Saved")).toBeTruthy();
  });

  it("undoes and redoes with Ctrl+Z and Ctrl+Shift+Z, restoring the exact document", async () => {
    const { user, onChange } = setup();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const reviews = screen.getByRole("switch", { name: "Show Reviews" });
    reviews.focus();
    await user.keyboard(" ");
    expect(reviews.getAttribute("aria-checked")).toBe("false");
    await user.keyboard("{Control>}z{/Control}");
    expect(screen.getByRole("switch", { name: "Show Reviews" }).getAttribute("aria-checked")).toBe("true");
    expect(live()).toBe("Undone");
    await user.keyboard("{Control>}{Shift>}z{/Shift}{/Control}");
    expect(screen.getByRole("switch", { name: "Show Reviews" }).getAttribute("aria-checked")).toBe("false");
    // the draft saved while hidden, then undone: what is saved next is the exact initial document
    await act(async () => {
      await vi.advanceTimersByTimeAsync(AUTOSAVE_MS + 50);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect((onChange.mock.calls[0]![0] as ShopPage).sections.find((s) => s.key === "s_reviews")!.disabled).toBe(true);
    await user.keyboard("{Control>}z{/Control}");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(AUTOSAVE_MS + 50);
    });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[1]![0]).toEqual(doc());
  });

  it("adds a section from the catalogue dialog, by keyboard", async () => {
    const { user } = setup();
    expect(order()).toBe(6);
    await user.click(screen.getByRole("button", { name: "Add a section" }));
    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "Questions" }));
    expect(order()).toBe(7);
    expect(live()).toBe("Questions added at position 7");
    // there is one hero: it cannot be added twice
    await user.click(screen.getByRole("button", { name: "Add a section" }));
    expect((within(await screen.findByRole("dialog")).getByRole("button", { name: "Hero" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("shows what changes before publishing, and publishes the draft after the person confirmed", async () => {
    const { user, onPublish } = setup();
    await user.click(screen.getByRole("button", { name: "Publish" }));
    expect(await screen.findByText("Nothing has changed since the last publication.")).toBeTruthy();
    await user.click(screen.getAllByRole("button", { name: "Cancel" }).at(-1)!);
    await user.click(screen.getByRole("switch", { name: "Show Reviews" }));
    await user.click(screen.getByRole("button", { name: "Publish" }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Reviews hidden")).toBeTruthy();
    await user.click(within(dialog).getByRole("button", { name: "Publish" }));
    expect(onPublish).toHaveBeenCalledTimes(1);
    expect((onPublish.mock.calls[0]![0] as ShopPage).sections.find((s) => s.key === "s_reviews")!.disabled).toBe(true);
  });

  it("says an invalid setting next to its field and blocks the publication with a summary", async () => {
    const { user, onPublish } = setup();
    await user.click(rowButtons()[0]!);
    const photo = screen.getByRole("textbox", { name: "Photo" });
    await user.click(photo);
    await user.paste("x".repeat(81));
    await user.tab();
    expect(await screen.findByText(/80|too long|at most/i)).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Publish" }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("alert").textContent).toMatch(/Fix 1 problem before publishing/);
    expect((within(dialog).getByRole("button", { name: "Publish" }) as HTMLButtonElement).disabled).toBe(true);
    expect(onPublish).not.toHaveBeenCalled();
  });

  it("changes the look: the preset and the spacing", async () => {
    const { user, onChange } = setup();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await user.selectOptions(screen.getByRole("combobox", { name: "Style" }), "salon-atelier");
    await user.click(screen.getByRole("radio", { name: "Compact" }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(AUTOSAVE_MS + 50);
    });
    const saved = onChange.mock.calls.at(-1)![0] as ShopPage;
    expect(saved.preset.id).toBe("salon-atelier");
    expect(saved.density).toBe("compact");
  });
});

describe("the look picker (akinaza#478)", () => {
  it("is a radio group of the looks; choosing one rewrites the variants of the draft and says so", async () => {
    const { user, onChange } = setup({ presets: [...presets, ...looks] });
    const group = screen.getByRole("radiogroup", { name: "Look of the page" });
    expect(within(group).getAllByRole("radio").map((r) => r.textContent)).toEqual([expect.stringContaining("Cahier"), expect.stringContaining("Affiche")]);
    await user.click(within(group).getByRole("radio", { name: /Affiche/ }));
    expect(live()).toBe("Look: Affiche");
    await vi.waitFor(() => expect(onChange).toHaveBeenCalled(), { timeout: AUTOSAVE_MS + 1500 });
    const saved = onChange.mock.calls.at(-1)![0] as ShopPage;
    expect(saved.preset.id).toBe("look-affiche");
    expect(saved.sections.find((s) => s.type === "hero")!.variant).toBe("banner");
  });

  it("offers the accents of the chosen look and keeps the trade styles in their select", async () => {
    const { user } = setup({ presets: [...presets, ...looks] });
    expect(screen.queryByRole("radiogroup", { name: "Accent" })).toBeNull();
    await user.click(screen.getByRole("radio", { name: /Cahier/ }));
    const accent = screen.getByRole("radiogroup", { name: "Accent" });
    expect(within(accent).getAllByRole("radio").map((r) => r.textContent)).toEqual(["Akinaza green", "Copper"]);
    expect(screen.getByRole("combobox", { name: "Style" })).toBeTruthy();
  });

  it("has no axe violation", async () => {
    const { container } = setup({ presets: [...presets, ...looks] });
    expect(await axeViolations(container)).toEqual([]);
  });
});
