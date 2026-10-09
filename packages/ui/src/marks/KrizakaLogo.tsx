import { a11y, type MarkProps, neutral, useIds } from "./shared";

const CSS = `
.kzm-spin { transform-origin: 180px 180px; animation: kzm-spin 30s linear infinite; }
.kzm-pulse { animation: kzm-pulse 4s ease-in-out infinite; }
@keyframes kzm-spin { to { transform: rotate(360deg); } }
@keyframes kzm-pulse {
  0%, 100% { filter: drop-shadow(0 0 8px hsla(217, 92%, 60%, .2)) drop-shadow(0 0 24px hsla(217, 92%, 60%, .06)); }
  50% { filter: drop-shadow(0 0 12px hsla(217, 92%, 60%, .35)) drop-shadow(0 0 36px hsla(217, 92%, 60%, .12)); }
}
@media (prefers-reduced-motion: reduce) { .kzm-spin, .kzm-pulse { animation: none; } }
`;

/** The Krizaka mark: a hexagonal shield with a neural core, inside slow orbits. Blue accent: `--kz-accent`. */
export function KrizakaLogo({ size = 32, animated = true, title, className }: MarkProps) {
  const id = useIds("kzm", ["blue", "steel", "core", "ambient"] as const);
  const accent = "var(--kz-accent, hsl(217, 92%, 60%))";
  const m = (cls: string) => (animated ? cls : undefined);
  const pulse = (x: number, y: number) => ({ className: m("kzm-pulse"), style: { transformOrigin: `${x}px ${y}px` } });
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...a11y(title)}>
      <style>{CSS}</style>
      <defs>
        <linearGradient id={id.blue} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
        <linearGradient id={id.steel} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={neutral("--kz-text-secondary", 64)} />
          <stop offset="100%" stopColor={neutral("--kz-text-muted", 38)} />
        </linearGradient>
        <radialGradient id={id.core} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="1" />
          <stop offset="35%" stopColor={accent} stopOpacity="0.7" />
          <stop offset="65%" stopColor={accent} stopOpacity="0.02" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id.ambient} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.08" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform="translate(20, 20)">
        <circle cx="180" cy="180" r="170" fill={`url(#${id.ambient})`} />
        <circle cx="180" cy="180" r="160" stroke={neutral("--kz-border-strong", 16)} strokeWidth="1.5" strokeDasharray="8 8" opacity="0.6" className={m("kzm-spin")} />
        <circle cx="180" cy="180" r="130" stroke={neutral("--kz-border-default", 10)} strokeWidth="1" opacity="0.35" />
        <circle cx="180" cy="180" r="100" stroke={neutral("--kz-border-subtle", 6)} strokeWidth="1" strokeDasharray="3 6" opacity="0.3" />
        <line x1="180" y1="20" x2="180" y2="80" stroke={neutral("--kz-border-strong", 16)} strokeWidth="0.5" opacity="0.2" />
        <line x1="320" y1="100" x2="260" y2="140" stroke={neutral("--kz-border-strong", 16)} strokeWidth="0.5" opacity="0.2" />
        <line x1="40" y1="100" x2="100" y2="140" stroke={neutral("--kz-border-strong", 16)} strokeWidth="0.5" opacity="0.2" />
        <circle cx="180" cy="180" r="55" fill={`url(#${id.core})`} {...pulse(180, 180)} />
        <path d="M180,80 L255,120 L255,200 L180,240 L105,200 L105,120 Z" stroke={`url(#${id.blue})`} strokeWidth="3" strokeLinejoin="round" opacity="0.9" />
        <path d="M180,105 L235,133 L235,187 L180,215 L125,187 L125,133 Z" stroke={`url(#${id.steel})`} strokeWidth="2" strokeLinejoin="round" opacity="0.5" />
        <path d="M255,120 L290,85 L310,100" stroke={`url(#${id.blue})`} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M105,120 L70,85 L50,100" stroke={`url(#${id.steel})`} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M180,240 L180,280 L200,295" stroke={`url(#${id.steel})`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
        <path d="M180,280 L160,295" stroke={`url(#${id.steel})`} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        <line x1="180" y1="130" x2="180" y2="195" stroke="#60A5FA" strokeWidth="1.5" opacity="0.3" />
        <line x1="145" y1="160" x2="215" y2="160" stroke="#60A5FA" strokeWidth="1.5" opacity="0.3" />
        {[[180, 130], [180, 195], [145, 160], [215, 160]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#60A5FA" opacity="0.5" {...pulse(x, y)} />
        ))}
        <circle cx="180" cy="160" r="18" fill="#1E40AF" {...pulse(180, 160)} />
        <circle cx="180" cy="160" r="12" fill="#3B82F6" {...pulse(180, 160)} />
        <circle cx="180" cy="160" r="5" fill="#BFDBFE" {...pulse(180, 160)} />
        <circle cx="310" cy="50" r="2.5" fill="#60A5FA" opacity="0.6" />
        <circle cx="50" cy="260" r="2" fill={neutral("--kz-border-strong", 16)} opacity="0.4" />
      </g>
    </svg>
  );
}
