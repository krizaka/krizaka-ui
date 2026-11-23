// Server-safe. A product's public page assembled from data only (krizaka-internal#4693): the hero in depth with the product
// moment, the one journey told while scrolling, the document the visitor touches, the scenes, the limits, the closing call
// and the footer. No word, no product name and no colour is typed here: the words, the media and the verdicts are the
// product's data, the colour is its brand scope (`brand`). Five seconds: the title and the moment; then the story.
import { ClauseDemo, type ClauseLine } from "@krizaka/ui/clause-demo";
import type { MascotBird } from "@krizaka/ui/mascots";
import type { LoopLabels } from "@krizaka/ui/pausable-loop";
import { StoryScroll, type StoryStep } from "@krizaka/ui/story-scroll";
import type * as React from "react";

import { cn } from "../cn";
import {
  ClosingBand,
  DocumentScene,
  type DocumentSceneProps,
  FindingCard,
  LimitsBand,
  ProductActions,
  type ProductFinding,
  ProductHero,
  type ProductLink,
  ProductMoment,
  type ProductScene,
  PublicFooter,
  type PublicFooterProps,
  SceneList,
} from "./blocks";
import type { SheetLine } from "./cahier-sheet";

/** Everything a product page shows, as data: the words in the reader's language, the media, the verdicts. */
export type ProductPageData = {
  /** The product's brand theme (`.brand-<id>` of `@krizaka/tokens`): its colours. */
  brand?: string;
  hero: { title: string; lead?: string; primary: ProductLink; secondary?: ProductLink; backdrop?: string };
  /** The proof beside the hero's words: a document read, the finding that leaves it. */
  moment?: { label: string; tag?: string; lines: readonly SheetLine[]; finding: ProductFinding; id?: string };
  /** The one journey, told while scrolling, over a document scene. */
  story?: { label: string; steps: readonly StoryStep[]; guide?: MascotBird; scene: DocumentSceneProps };
  /** The document the visitor touches. */
  demo?: { title: string; tag?: string; lines: readonly ClauseLine[] };
  scenes?: { items: readonly ProductScene[]; labels?: LoopLabels; id?: string };
  limits?: { title: string; items: readonly string[]; bird?: MascotBird; caption?: string };
  closing: { title: string; inked?: string; action: ProductLink };
  footer?: PublicFooterProps;
};

export type ProductPageProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Everything the page shows: the words, the media and the verdicts of the product, in the reader's language. */
  data: ProductPageData;
};

function Moment({ moment }: Readonly<{ moment: NonNullable<ProductPageData["moment"]> }>) {
  return <ProductMoment id={moment.id} label={moment.label} tag={moment.tag} lines={moment.lines} answer={<FindingCard finding={moment.finding} />} />;
}

/** A product's public page from its data: hero, story, demo, scenes, limits, closing, footer — each part only when given. */
export function ProductPage({ data, className, ...props }: Readonly<ProductPageProps>) {
  const { hero, moment, story, demo, scenes, limits, closing, footer } = data;
  return (
    <div className={cn("kz-pp", data.brand && "brand-" + data.brand, className)} {...props}>
      <ProductHero
        title={hero.title}
        lead={hero.lead}
        backdrop={hero.backdrop}
        actions={<ProductActions primary={hero.primary} secondary={hero.secondary} />}
        visual={moment && <Moment moment={moment} />}
      />
      <div className="kz-pp-body">
        {story && <StoryScroll label={story.label} steps={story.steps} guide={story.guide} scene={<DocumentScene {...story.scene} />} />}
        {demo && <ClauseDemo title={demo.title} tag={demo.tag} lines={demo.lines} />}
        {scenes && scenes.items.length > 0 && <SceneList id={scenes.id} scenes={scenes.items} labels={scenes.labels} />}
        {limits && <LimitsBand title={limits.title} items={limits.items} bird={limits.bird} caption={limits.caption} />}
        <ClosingBand title={closing.title} inked={closing.inked} action={<ProductActions primary={closing.action} />} />
      </div>
      {footer && <PublicFooter {...footer} />}
    </div>
  );
}
