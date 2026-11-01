import { InkMark } from "./InkMark";
import { KRIZAKA as G } from "./krizaka-geometry";
import type { MarkProps } from "./shared";

const CSS = `
.kzm-spin { transform-origin: 200px 200px; animation: kzm-spin 30s linear infinite; }
.kzm-pulse { transform-box: fill-box; transform-origin: center; animation: kzm-pulse 3.2s ease-in-out infinite; }
@keyframes kzm-spin { to { transform: rotate(360deg); } }
@keyframes kzm-pulse {
  0%, 100% { filter: drop-shadow(0 0 6px hsla(217, 92%, 53%, .25)); opacity: .9; }
  50% { filter: drop-shadow(0 0 14px hsla(217, 92%, 53%, .55)); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) { .kzm-spin, .kzm-pulse { animation: none; } }
`;

/**
 * The Krizaka mark: an ink hexagonal shield, open at one vertex where a blue node breaks out, around a blue core —
 * the parent of the family (Orazaka's shards). The orbit turns, the node and the core
 * breathe. The shield reads the host's text roles, so it is ink in both themes. Below 48 px it crops to the emblem.
 */
export function KrizakaLogo(props: Readonly<MarkProps>) {
  return (
    <InkMark
      {...props}
      prefix="kzm"
      css={CSS}
      geometry={G}
      figure={(ink) => <path d={G.shield} stroke={ink} strokeWidth={G.stroke} strokeLinecap="round" strokeLinejoin="round" />}
    />
  );
}
