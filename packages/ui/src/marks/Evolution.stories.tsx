import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import { KrizakaLogo } from "./KrizakaLogo";
import { KrizakaLogoV1 } from "./legacy/KrizakaLogoV1";
import { SovkoraLogoV1 } from "./legacy/SovkoraLogoV1";
import { SovkoraLogoV2 } from "./legacy/SovkoraLogoV2";
import { SovkoraLogo } from "./SovkoraLogo";

/**
 * The brand family, before and after 2.0.0-beta.5. Krizaka and
 * Sovkora share one grammar — one bold emblem in an orbit, a bright core, a crop below 48 px — and their brand colour
 * (Krizaka: ink + blue). In 2.1.0 the Sovkora mark leaves amber (#b45309 → #f59e0b, whose light stop is the hue of
 * --kz-warning and read at 2:1 on a light page) for the brand's orange: deep orange → orange on hue 26, from the brand
 * tokens (`marks.sovkora`), ≥ 3:1 on dark and light. The previous marks live only in this story.
 */
const meta = {
  title: "Brand/Evolution",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

const SIZES = [96, 32, 20] as const;

function Row({ label, children }: { label: string; children: (size: number) => ReactNode }) {
  return (
    <div className="flex items-center gap-6">
      <span className="w-24 text-xs text-fg-secondary">{label}</span>
      {SIZES.map((size) => (
        <span key={size} className="flex w-24 items-center justify-center">
          {children(size)}
        </span>
      ))}
    </div>
  );
}

/** Before → after, still, at 96, 32 and 20 px (navigation size). */
export const BeforeAfter: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Row label="Krizaka · before">{(size) => <KrizakaLogoV1 size={size} animated={false} />}</Row>
      <Row label="Krizaka · after">{(size) => <KrizakaLogo size={size} animated={false} />}</Row>
      <Row label="Sovkora · 1.x">{(size) => <SovkoraLogoV1 size={size} animated={false} />}</Row>
      <Row label="Sovkora · 2.0 amber">{(size) => <SovkoraLogoV2 size={size} animated={false} />}</Row>
      <Row label="Sovkora · 2.1 orange">{(size) => <SovkoraLogo size={size} animated={false} />}</Row>
    </div>
  ),
};

/** The family side by side: the same orbit, ring, weight and core. */
export const Family: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <KrizakaLogo size={128} animated={false} title="Krizaka" />
      <SovkoraLogo size={128} animated={false} title="Sovkora" />
    </div>
  ),
};
