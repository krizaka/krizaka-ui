import { a11y, type MarkProps, neutral } from "./shared";
import { WU_SAMA as G } from "./wu-sama-geometry";

/**
 * The Wu-sama mark — the founder's byline mark, for the person and not the company (the company keeps
 * `KrizakaLogo`). Oussama's nickname is Wu-sama: a W of five straight legs in gold inside the Krizaka hexagon, split
 * at its top and bottom vertices, a small lit node at the middle summit. Still: no orbit, no pulse. The hexagon and the
 * node read the host's text role, so they are ink in both themes; the gold is one mid-tone amber that reads on both.
 *
 * **Original mark, inspired by, not derived from**: it nods to the culture its name comes from but is built from the
 * Krizaka hexagon's own measures (see `wu-sama-geometry.ts` and its tests), never from the Wu-Tang Clan's registered
 * logo — no bat-wing W, no curve, no yellow-on-black copy. Below 48 px it crops to the emblem.
 */
export function WuSamaMark({ size = 32, title, className }: Omit<MarkProps, "animated"> & { animated?: boolean }) {
  const ink = neutral("--kz-text-primary", 92);
  return (
    <svg width={size} height={size} viewBox={size < 48 ? G.croppedViewBox : G.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...a11y(title)}>
      <path d={G.shell.left} stroke={ink} strokeWidth={G.shell.stroke} strokeLinejoin="miter" strokeLinecap="butt" />
      <path d={G.shell.right} stroke={ink} strokeWidth={G.shell.stroke} strokeLinejoin="miter" strokeLinecap="butt" />
      <path d={G.w} stroke={G.gold} strokeWidth={G.wStroke} strokeLinejoin="miter" strokeMiterlimit={4} strokeLinecap="butt" />
      <path d={G.node} fill={ink} />
    </svg>
  );
}
