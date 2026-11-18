import { expect } from "storybook/test";

/** The play of a « HoverQuiet » story (krizaka-ui#393): three cards, no hover class, no light layer, nothing follows the pointer. */
export async function expectQuietHover(canvasElement: HTMLElement, selector: string): Promise<void> {
  const cards = [...canvasElement.querySelectorAll<HTMLElement>(selector)];
  await expect(cards).toHaveLength(3);
  for (const card of cards) {
    await expect(card.className).not.toMatch(/kz-hover-/);
    await expect("kzLight" in card.dataset).toBe(false);
    await expect(getComputedStyle(card, "::after").content).toBe("none");
  }
}
