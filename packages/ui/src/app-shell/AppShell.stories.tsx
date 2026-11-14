import type { Meta, StoryObj } from "@storybook/react-vite";

import AdminConsoleExample from "../../registry/examples/app-shell/admin-console";
import BasicExample from "../../registry/examples/app-shell/basic";
import CollapseOverflowExample from "../../registry/examples/app-shell/collapse-overflow";
import ConsoleExample from "../../registry/examples/app-shell/console";
import CreatorStudioExample from "../../registry/examples/app-shell/creator-studio";
import DesktopExample from "../../registry/examples/app-shell/desktop";
import { AppShellRoot } from "./app-shell";

/** App shell — a layout. Each story renders a named example; a template has its phone story too. */
const meta = {
  title: "Layouts/AppShell",
  component: AppShellRoot,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppShellRoot>;
export default meta;

type Story = StoryObj;

export const CreatorStudio: Story = { render: () => <CreatorStudioExample /> };
/** The same template on a phone (390 × 844): the screenshot is taken at that width. */
export const CreatorStudioPhone: Story = { render: () => <CreatorStudioExample />, parameters: { phone: true } };
export const AdminConsole: Story = { render: () => <AdminConsoleExample /> };
/** The same template on a phone (390 × 844): the screenshot is taken at that width. */
export const AdminConsolePhone: Story = { render: () => <AdminConsoleExample />, parameters: { phone: true } };
export const Console: Story = { render: () => <ConsoleExample /> };
/** The console on a phone (390 × 844): the sidebar is a drawer, the table shows cards, the search is an icon. */
export const ConsolePhone: Story = { render: () => <ConsoleExample />, parameters: { phone: true } };
export const Basic: Story = { render: () => <BasicExample /> };
/** The window of the Sovkora Mac app (Tauri 2): the desktop form of the shell (ADR-002). */
export const Desktop: Story = { render: () => <DesktopExample /> };

/** Is this text node visible at all (not visibility-hidden, not transparent, not zero-sized)? */
function isPainted(el: HTMLElement): boolean {
  const style = getComputedStyle(el);
  return style.visibility !== "hidden" && Number.parseFloat(style.opacity) >= 0.05 && Number.parseFloat(style.fontSize) >= 1;
}

/** What the eye sees: the text's right edge cut by every clipping ancestor (overflow hidden/clip); null for visually-hidden text. */
function visibleRight(el: HTMLElement, nav: HTMLElement, right: number): number | null {
  let result = right;
  for (let a: HTMLElement | null = el; a && a !== nav.parentElement; a = a.parentElement) {
    const cs = getComputedStyle(a);
    if (cs.getPropertyValue("clip") !== "auto" && cs.getPropertyValue("clip") !== "") return null;
    if (cs.overflowX !== "visible") result = Math.min(result, a.getBoundingClientRect().right);
  }
  return result;
}

/** One text node's overflow past the sidebar's edge, as a message; undefined when it stays in. */
function spillOf(node: Node, nav: HTMLElement, edge: number): string | undefined {
  const text = node.textContent?.trim();
  const el = node.parentElement;
  if (!text || !el || !isPainted(el)) return undefined;
  const range = document.createRange();
  range.selectNodeContents(node);
  const box = range.getBoundingClientRect();
  const right = visibleRight(el, nav, box.right);
  if (right === null || box.width <= 0 || right <= edge) return undefined;
  return `« ${text} » ends at ${Math.round(right)} past ${Math.round(edge)}`;
}

function spillIn(nav: HTMLElement): string[] {
  const edge = nav.getBoundingClientRect().right + 0.5;
  const out: string[] = [];
  const walker = document.createTreeWalker(nav, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const spill = spillOf(node, nav, edge);
    if (spill) out.push(spill);
  }
  return out;
}

/** Collapsing never lets a word out of the sidebar: sampled at 40, 120, 250 ms and at rest, no visible text ends right of the sidebar's edge (krizaka-ui#482). */
const noSpill: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const nav = canvasElement.querySelector<HTMLElement>("nav[aria-label=Verikora]");
  const toggle = [...canvasElement.querySelectorAll<HTMLButtonElement>("button[aria-expanded]")].find((b) => b.getClientRects().length > 0);
  if (!nav || !toggle) throw new Error("no sidebar or collapse button");
  const reduce = globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
  toggle.click();
  const problems: string[] = [];
  for (const wait of reduce ? [0, 50] : [40, 80, 130, 400]) {
    await new Promise((resolve) => setTimeout(resolve, wait));
    problems.push(...spillIn(nav));
  }
  if (problems.length) throw new Error(`text spills out of the collapsing sidebar: ${problems.join("; ")}`);
  const brand = nav.querySelector("a");
  if (brand && brand.getBoundingClientRect().width > 40) throw new Error("the brand name still shows beside the mark once collapsed");
  // Back to the open sidebar, at rest: the story's screenshot is then taken in a settled state.
  toggle.click();
  await new Promise((resolve) => setTimeout(resolve, 600));
};
export const CollapseNoSpill: Story = { render: () => <CollapseOverflowExample />, play: noSpill };
