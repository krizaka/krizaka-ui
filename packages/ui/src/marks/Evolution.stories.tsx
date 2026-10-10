import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import { KrizakaLogo } from "./KrizakaLogo";
import { KrizakaLogoV1 } from "./legacy/KrizakaLogoV1";
import { OrazakaLogoV1 } from "./legacy/OrazakaLogoV1";
import { OrazakaLogo } from "./OrazakaLogo";
import { OrochiaLogo } from "./OrochiaLogo";

/**
 * The brand family, before and after 2.0.0-beta.5. Orochia's mark is the reference and does not change; Krizaka and
 * Orazaka take its grammar — one bold emblem in an orbit, a bright core, a crop below 48 px — and their brand colour
 * (Krizaka: ink + blue; Orazaka: the orange of its own gradient). The previous marks live only in this story.
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
      <Row label="Orazaka · before">{(size) => <OrazakaLogoV1 size={size} animated={false} />}</Row>
      <Row label="Orazaka · after">{(size) => <OrazakaLogo size={size} animated={false} />}</Row>
      <Row label="Orochia · kept">{(size) => <OrochiaLogo size={size} animated={false} />}</Row>
    </div>
  ),
};

/** The family side by side: the same orbit, ring, weight and core. */
export const Family: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <KrizakaLogo size={128} animated={false} title="Krizaka" />
      <OrazakaLogo size={128} animated={false} title="Orazaka" />
      <OrochiaLogo size={128} animated={false} title="Orochia" />
    </div>
  ),
};
