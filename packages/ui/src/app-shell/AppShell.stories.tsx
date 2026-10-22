import type { Meta, StoryObj } from "@storybook/react-vite";

import AdminConsoleExample from "../../registry/examples/app-shell/admin-console";
import CollapseOverflowExample from "../../registry/examples/app-shell/collapse-overflow";
import BasicExample from "../../registry/examples/app-shell/basic";
import ConsoleExample from "../../registry/examples/app-shell/console";
import DesktopExample from "../../registry/examples/app-shell/desktop";
import OrochiaStudioExample from "../../registry/examples/app-shell/orochia-studio";
import { AppShellRoot } from "./app-shell";

/** App shell — a layout. Each story renders a named example; a template has its phone story too. */
const meta = {
  title: "Layouts/AppShell",
  component: AppShellRoot,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppShellRoot>;
export default meta;

type Story = StoryObj;

export const OrochiaStudio: Story = { render: () => <OrochiaStudioExample /> };
/** The same template on a phone (390 × 844): the screenshot is taken at that width. */
export const OrochiaStudioPhone: Story = { render: () => <OrochiaStudioExample />, parameters: { phone: true } };
export const AdminConsole: Story = { render: () => <AdminConsoleExample /> };
/** The same template on a phone (390 × 844): the screenshot is taken at that width. */
export const AdminConsolePhone: Story = { render: () => <AdminConsoleExample />, parameters: { phone: true } };
export const Console: Story = { render: () => <ConsoleExample /> };
/** The console on a phone (390 × 844): the sidebar is a drawer, the table shows cards, the search is an icon. */
export const ConsolePhone: Story = { render: () => <ConsoleExample />, parameters: { phone: true } };
export const Basic: Story = { render: () => <BasicExample /> };
/** The window of the Orazaka Mac app (Tauri 2): the desktop form of the shell (ADR-002). */
export const Desktop: Story = { render: () => <DesktopExample /> };

/** Collapsing never lets a word out of the sidebar: sampled at 40, 120, 250 ms and at rest, no visible text ends right of the sidebar's edge (krizaka-ui#482). */
const noSpill: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const nav = canvasElement.querySelector<HTMLElement>("nav[aria-label=Yomizaka]");
  const toggle = [...canvasElement.querySelectorAll<HTMLButtonElement>("button[aria-expanded]")].find((b) => b.getClientRects().length > 0);
  if (!nav || !toggle) throw new Error("no sidebar or collapse button");
  const spill = () => {
    const edge = nav.getBoundingClientRect().right + 0.5;
    const out: string[] = [];
    const walker = document.createTreeWalker(nav, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent?.trim();
      const el = node.parentElement;
      if (!text || !el) continue;
      const style = getComputedStyle(el);
      if (style.visibility === "hidden" || Number.parseFloat(style.opacity) < 0.05 || Number.parseFloat(style.fontSize) < 1) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const box = range.getBoundingClientRect();
      // What the eye sees: the text's box cut by every clipping ancestor (overflow hidden/clip), nothing at all for visually-hidden text.
      let right = box.right;
      let hidden = false;
      for (let a: HTMLElement | null = el; a && a !== nav.parentElement; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (cs.clip !== "auto" && cs.clip !== "") hidden = true;
        if (cs.overflowX !== "visible") right = Math.min(right, a.getBoundingClientRect().right);
      }
      if (!hidden && box.width > 0 && right > edge) out.push(`« ${text} » ends at ${Math.round(right)} past ${Math.round(edge)}`);
    }
    return out;
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  toggle.click();
  const problems: string[] = [];
  for (const wait of reduce ? [0, 50] : [40, 80, 130, 400]) {
    await new Promise((resolve) => setTimeout(resolve, wait));
    problems.push(...spill());
  }
  if (problems.length) throw new Error(`text spills out of the collapsing sidebar: ${problems.join("; ")}`);
  const brand = nav.querySelector("a");
  if (brand && brand.getBoundingClientRect().width > 40) throw new Error("the brand name still shows beside the mark once collapsed");
};
export const CollapseNoSpill: Story = { render: () => <CollapseOverflowExample />, play: noSpill };
