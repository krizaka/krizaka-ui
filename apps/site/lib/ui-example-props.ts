/* Props the site gives to some live examples. The registry's examples hold no media of their own (a clip is the
   product's): the site passes Krizaka's own AI-generated clip from the Krizaka CDN (fictional, owned by Krizaka), so the
   demo plays what a product would. Keyed like the import map (`lib/ui-examples.ts`). The files live under ui/landing/ on the CDN (this
   site's prefix: krizaka-com prunes only site/) and carry their content hash: a URL never changes content. */

const CDN = "https://krizaka-assets.b-cdn.net/ui/landing/kit";
const clip = () => ({ src: `${CDN}/challenge-v.22cb2a30f8.mp4`, poster: `${CDN}/challenge-v.7f6f208377.jpg` });

export const EXAMPLE_PROPS: Record<string, () => Record<string, unknown>> = {
  "vertical-video/rail": clip,
  "vertical-video/feed": () => ({ src: clip().src }),
};

/** The props of an example, or none. */
export const examplePropsOf = (key: string): Record<string, unknown> => EXAMPLE_PROPS[key]?.() ?? {};
