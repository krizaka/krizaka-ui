import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import AppBarExample from "../../registry/examples/nav-bar/app-bar";
import FamilyAdminExample from "../../registry/examples/nav-bar/family-admin";
import FamilyJavaExample from "../../registry/examples/nav-bar/family-java";
import FamilyProductExample from "../../registry/examples/nav-bar/family-product";
import FamilyUiExample from "../../registry/examples/nav-bar/family-ui";
import FamilyWwwExample from "../../registry/examples/nav-bar/family-www";
import MenuOpenExample from "../../registry/examples/nav-bar/menu-open";
import SiteExample from "../../registry/examples/nav-bar/site";
import { NavBar, NavBarRoot } from "./nav-bar";

/** The Krizaka navigation bar. Each story renders a named example of the registry (`registry/examples/nav-bar/*`). */
const meta = {
  title: "Primitives/NavBar",
  component: NavBarRoot,
  args: { label: "Main" },
  decorators: [
    (Story) => (
      <div className="w-[56rem] max-w-full p-2">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavBarRoot>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Site: Story = { render: () => <SiteExample /> };
export const MenuOpen: Story = {
  render: () => <MenuOpenExample defaultOpen />,
  // Radix NavigationMenu keeps a 1 px focus proxy (`aria-hidden`, focusable) after an open trigger: it hands the focus
  // over to the content when tabbing, by design. axe flags it; the menu itself is audited by every other rule.
  parameters: { a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } } },
};
export const AppBar: Story = { render: () => <AppBarExample /> };
export const FamilyWww: Story = { render: () => <FamilyWwwExample /> };
export const FamilyOpen: Story = {
  render: () => <FamilyWwwExample defaultOpen />,
  // The same Radix focus proxy as MenuOpen (see there).
  parameters: { a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } } },
};
export const FamilyUi: Story = { render: () => <FamilyUiExample /> };
export const FamilyJava: Story = { render: () => <FamilyJavaExample /> };
export const FamilyProduct: Story = { render: () => <FamilyProductExample /> };
export const FamilyAdmin: Story = { render: () => <FamilyAdminExample /> };

/** The French descriptions of Yomizaka's menu — the ones that used to be cut mid-sentence. */
const LONG = [
  ["#keep", "Garder, lire, prouver", "Garder, lire, prouver : enregistré sur la vraie application, avec chaque passage retrouvé dans votre document."],
  ["#lease", "Bail québécois", "Un bail québécois vérifié par Orazaka, tel qu'il a été signé, avec les clauses qui méritent votre attention."],
  ["#how", "Comment ça marche", "Du dépôt du PDF au rapport en trois étapes."],
] as const;

/**
 * A menu whose descriptions are long: they wrap on two lines at most (an ellipsis after that), no line is clipped
 * sideways, and the panel stays inside the page between its gutters. Checked in the browser, where the layout exists.
 */
export const MenuLongText: Story = {
  render: () => (
    <NavBar.Root label="Principal" floating={false} className="mb-80">
      <NavBar.Brand href="#home">Yomizaka</NavBar.Brand>
      <NavBar.Items defaultValue="product">
        <NavBar.Menu value="product" label="Produit" inlineUpTo={0}>
          {LONG.map(([href, title, text]) => (
            <NavBar.MenuLink key={href} href={href} title={title} description={text} />
          ))}
        </NavBar.Menu>
      </NavBar.Items>
    </NavBar.Root>
  ),
  parameters: { capture: "viewport", a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } } },
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const panel = await new Promise<HTMLElement>((resolve, reject) => {
      const t0 = Date.now();
      const tick = () => {
        // The panel is the content around the first link (Radix sets no attribute we can rely on for it).
        const el = doc.querySelector<HTMLAnchorElement>('a[href="#keep"]')?.closest<HTMLElement>("[data-state]");
        if (el) return resolve(el);
        if (Date.now() - t0 > 4000) return reject(new Error("the menu did not open"));
        requestAnimationFrame(tick);
      };
      tick();
    });
    // Let the panel's width and placement settle (Radix measures it, then the bar places it).
    await new Promise((r) => setTimeout(r, 500));
    const texts = [...panel.querySelectorAll<HTMLElement>("a span span:last-child")];
    expect(texts.length).toBeGreaterThan(0);
    for (const text of texts) {
      // Nothing is clipped sideways, and no description takes more than two lines.
      expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth + 1);
      const line = Number.parseFloat(getComputedStyle(text).lineHeight);
      expect(text.getBoundingClientRect().height).toBeLessThanOrEqual(line * 2 + 1);
    }
    const box = panel.closest<HTMLElement>("[data-radix-navigation-menu-viewport]")?.getBoundingClientRect() ?? panel.getBoundingClientRect();
    expect(box.left).toBeGreaterThanOrEqual(0);
    expect(box.right).toBeLessThanOrEqual(doc.documentElement.clientWidth);
    expect(panel.getBoundingClientRect().width).toBeLessThanOrEqual(28 * 16 + 1);
  },
};

/** Three links or fewer (Akinaza's Product: Overview · How it works · The demo shop) stand in the bar: no hidden list. */
export const MenuInline: Story = {
  render: () => (
    <NavBar.Root label="Principal" floating={false}>
      <NavBar.Brand href="#home">Akinaza</NavBar.Brand>
      <NavBar.Items>
        <NavBar.Menu label="Produit">
          <NavBar.MenuLink href="#overview" title="Vue d'ensemble" active />
          <NavBar.MenuLink href="#how" title="Comment ça marche" />
          <NavBar.MenuLink href="#shop" title="La boutique de démo" />
        </NavBar.Menu>
        <NavBar.Link href="#docs">Docs</NavBar.Link>
      </NavBar.Items>
    </NavBar.Root>
  ),
};
