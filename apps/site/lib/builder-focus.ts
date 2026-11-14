/* The shortcut of the builder demo: from the top of the page to the first text field of the selected block, in one move.
   The canvas, the panels and the blocks come first in the tab order; this lands on the field instead. On a phone the fields
   are a tab of the rail (its button is named `fieldsTab`, by its label or its text): it is opened first. A function of the DOM, no state. */

const FIELD = "input[type=text], textarea";

const shown = (el: Element) => el.getClientRects().length > 0;

/** The first visible text field of the editor, or `undefined`. */
export function firstField(root: ParentNode): HTMLElement | undefined {
  return [...root.querySelectorAll<HTMLElement>(FIELD)].find(shown);
}

/** Moves focus to the first text field of the selected block. Returns false when the editor is not there (yet). */
export function focusFirstField(root: ParentNode | null, fieldsTab: string): boolean {
  if (!root) return false;
  const field = firstField(root);
  if (field) {
    field.focus();
    return true;
  }
  const tab = [...root.querySelectorAll("button")].find((button) => (button.getAttribute("aria-label") ?? button.textContent?.trim()) === fieldsTab);
  if (!tab) return false;
  tab.click();
  requestAnimationFrame(() => firstField(root)?.focus());
  return true;
}
