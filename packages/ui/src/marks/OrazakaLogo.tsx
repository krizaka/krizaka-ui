import { a11y, type MarkProps, neutral, useIds } from "./shared";

const CSS = `
.ozm-orbit { transform-box: view-box; transform-origin: 0 0; animation: ozm-orbit 35s linear infinite; }
.ozm-core { transform-box: fill-box; transform-origin: center; animation: ozm-core 2.5s ease-in-out infinite; }
@keyframes ozm-orbit { to { transform: rotate(360deg); } }
@keyframes ozm-core {
  0%, 100% { transform: scale(1); opacity: .9; filter: drop-shadow(0 0 3px #f59e0b); }
  50% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 10px #f59e0b); }
}
@media (prefers-reduced-motion: reduce) { .ozm-orbit, .ozm-core { animation: none; } }
`;

/** The Orazaka mark: three shards orbiting slowly around an amber core that breathes. */
export function OrazakaLogo({ size = 28, animated = true, title, className }: MarkProps) {
  const id = useIds("ozm", ["amber"] as const);
  return (
    <svg width={size} height={size} viewBox="-66 -66 132 132" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...a11y(title)}>
      <style>{CSS}</style>
      <defs>
        <linearGradient id={id.amber} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <circle r="62" stroke={neutral("--kz-border-strong", 16)} strokeWidth="1.5" strokeDasharray="6 6" opacity="0.5" />
      <circle r="48" stroke={neutral("--kz-border-default", 10)} strokeWidth="1" opacity="0.3" />
      <g className={animated ? "ozm-orbit" : undefined}>
        <path d="M -24 -41.5 L 0 -55.4 L 24 -41.5 L 24 -24 L 14 -18.2 L 14 -35.7 L 0 -43.8 L -14 -35.7 L -14 -18.2" stroke={neutral("--kz-text-muted", 45)} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M -48 0 L -38 17.3 L -14 31.2 L 0 23.1 L -10 17.3 L -24 9.2 L -24 -9.2" stroke={neutral("--kz-text-secondary", 70)} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 48 0 L 38 17.3 L 14 31.2 L 0 23.1 L 10 17.3 L 24 9.2 L 24 -9.2" stroke={`url(#${id.amber})`} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <circle r="10" fill={`url(#${id.amber})`} className={animated ? "ozm-core" : undefined} />
    </svg>
  );
}
