import type { Meta, StoryObj } from "@storybook/react-vite";

import { glyphIndex } from "./glyphs";
import * as icons from "./index";

type IconComponent = typeof icons.ChatIcon;
const all = Object.entries(glyphIndex).map(([name, entry]) => ({ name, ...entry, Icon: icons[entry.component as keyof typeof icons] as IconComponent }));
const GROUPS = ["product", "system", "interface"] as const;

/**
 * The Krizaka signature icons: a 24 grid, a 1.75 stroke, cut corners (the angle of the Krizaka hexagon) and, on every
 * product icon, a node — the core of the marks — that can carry the brand accent (`nodeColor`).
 */
const meta = {
  title: "Icons/Catalogue",
  component: icons.ChatIcon,
  parameters: { layout: "padded" },
  args: { size: 24 },
} satisfies Meta<typeof icons.ChatIcon>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Every icon, by group, with its export name. */
export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {GROUPS.map((group) => (
        <section key={group} aria-label={group} className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-fg-secondary">{group}</h2>
          <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
            {all
              .filter((i) => i.group === group)
              .map(({ name, component, Icon }) => (
                <li key={name} className="flex flex-col items-center gap-2 rounded-md border border-border-subtle bg-surface-1 px-2 py-3 text-fg">
                  <Icon {...args} />
                  <span className="text-[10px] text-fg-secondary">{component}</span>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  ),
};

/** The node lit with the brand accent: `nodeColor="var(--kz-accent)"` (switch the toolbar's Brand). */
export const AccentNode: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 text-fg">
      {all
        .filter((i) => i.group === "product")
        .map(({ name, Icon }) => (
          <Icon key={name} size={32} nodeColor="var(--kz-accent)" />
        ))}
    </div>
  ),
};

/** 16 · 20 · 24 · 32 · 48 px: the grid holds from the tab bar to the empty state. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 text-fg">
      {[16, 20, 24, 32, 48].map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="w-10 text-xs text-fg-secondary">{size}</span>
          <icons.ChatIcon size={size} />
          <icons.AuctionIcon size={size} />
          <icons.Story24hIcon size={size} />
          <icons.ShieldIcon size={size} />
          <icons.SettingsIcon size={size} />
        </div>
      ))}
    </div>
  ),
};

/** The stroke follows `strokeWidth` (1.25 · 1.75 default · 2.25). */
export const Strokes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-fg">
      {[1.25, 1.75, 2.25].map((w) => (
        <icons.WalletIcon key={w} size={40} strokeWidth={w} />
      ))}
    </div>
  ),
};

/** Named: an image for assistive technology (`title`). */
export const WithTitle: Story = { args: { title: "Sovereign chat", size: 32 }, render: (args) => <span className="text-fg"><icons.ChatIcon {...args} /></span> };
