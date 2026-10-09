import axe from "axe-core";

/**
 * The axe violations of a rendered tree. Colour contrast needs layout and computed colours, which happy-dom does not
 * have: it is audited in a real browser, in dark and light, by the Storybook tests.
 */
export async function axeViolations(container: Element): Promise<string[]> {
  const results = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  return results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.html).join(", ")})`);
}
