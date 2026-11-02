import { InkMark } from "./InkMark";
import { KRIDOC as G } from "./kridoc-geometry";
import type { MarkProps } from "./shared";

const CSS = `
.kdm-spin { transform-origin: 200px 200px; animation: kdm-spin 30s linear infinite; }
.kdm-pulse { transform-box: fill-box; transform-origin: center; animation: kdm-pulse 3.2s ease-in-out infinite; }
@keyframes kdm-spin { to { transform: rotate(360deg); } }
@keyframes kdm-pulse { 0%, 100% { opacity: .9; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .kdm-spin, .kdm-pulse { animation: none; } }
`;

function figure(ink: string) {
  return (
    <>
      <path d={G.page} stroke={ink} strokeWidth={G.stroke} strokeLinecap="round" strokeLinejoin="round" />
      <path d={G.fold} stroke={ink} strokeWidth={G.stroke} strokeLinecap="round" strokeLinejoin="round" />
      {G.lines.map((d) => (
        <path key={d} d={d} stroke={ink} strokeWidth={G.stroke * 0.6} strokeLinecap="round" />
      ))}
    </>
  );
}

/**
 * The Kridoc mark (the managed storage, sold as « Kridoc by Krizaka »): an ink page with its corner folded, open at the
 * fold where a blue node — the share link — breaks out, and a blue seal on the page. Krizaka's colours: a service of the
 * company. The orbit turns, the node and the seal breathe. Below 48 px it crops to the emblem.
 */
export function KridocLogo(props: Readonly<MarkProps>) {
  return (
    <InkMark
      {...props}
      prefix="kdm"
      css={CSS}
      geometry={G}
      figure={figure}
    />
  );
}
