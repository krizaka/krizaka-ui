import type { Meta, StoryObj } from "@storybook/react-vite";

import { AkinazaLogo } from "./AkinazaLogo";
import { KrizakaLogo } from "./KrizakaLogo";
import { OrazakaLogo } from "./OrazakaLogo";
import { YomizakaLogo } from "./YomizakaLogo";

/**
 * The brand family side by side — Krizaka and its three products, Orazaka, Yomizaka and Akinaza: the same orbit, ring,
 * weight and core, one colour per brand. Rendered (and screenshot-tested) in dark and light.
 */
const meta = {
  title: "Brand/Brand family",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

const FAMILY = [
  ["Krizaka", KrizakaLogo],
  ["Orazaka", OrazakaLogo],
  ["Yomizaka", YomizakaLogo],
  ["Akinaza", AkinazaLogo],
] as const;

/** The four marks at 128 px, then cropped to their emblems at 32 px (navigation). Still. */
export const Family: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-8">
        {FAMILY.map(([name, Mark]) => (
          <figure key={name} className="flex flex-col items-center gap-2">
            <Mark size={128} animated={false} title={name} />
            <figcaption className="text-xs text-fg-secondary">{name}</figcaption>
          </figure>
        ))}
      </div>
      <div className="flex items-center gap-8">
        {FAMILY.map(([name, Mark]) => (
          <span key={name} className="flex w-32 justify-center">
            <Mark size={32} animated={false} />
          </span>
        ))}
      </div>
    </div>
  ),
};
