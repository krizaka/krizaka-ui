import axe from "axe-core";

/**
 * The axe violations of a rendered tree. Colour contrast needs layout and computed colours, which happy-dom does not
 * have: it is audited in a real browser, in dark and light, by the Storybook tests. happy-dom never loads an iframe's page, so
 * axe does not enter frames (`iframes: false`): entering one, it logged « Frame does not have a content window » with the
 * element and its whole window, thousands of lines in CI (krizaka-internal#3904). The <iframe> itself is still audited (frame-title).
 */
export async function axeViolations(container: Element): Promise<string[]> {
  const results = await axe.run(container, { iframes: false, rules: { "color-contrast": { enabled: false } } });
  return results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.html).join(", ")})`);
}
