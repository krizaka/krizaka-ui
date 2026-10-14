import type { Meta, StoryObj } from "@storybook/react-vite";

import AppBarExample from "../../registry/examples/nav-bar/app-bar";
import FamilyAdminExample from "../../registry/examples/nav-bar/family-admin";
import FamilyJavaExample from "../../registry/examples/nav-bar/family-java";
import FamilyProductExample from "../../registry/examples/nav-bar/family-product";
import FamilyUiExample from "../../registry/examples/nav-bar/family-ui";
import FamilyWwwExample from "../../registry/examples/nav-bar/family-www";
import MenuOpenExample from "../../registry/examples/nav-bar/menu-open";
import SiteExample from "../../registry/examples/nav-bar/site";
import { NavBarRoot } from "./nav-bar";

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
