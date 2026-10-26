"use client";

import * as React from "react";

import { useInView, usePrefersReducedMotion } from "../media";
import { VideoPlayer, type VideoPlayerProps } from "../video-player/video-player";

const styles = `
.kz-rtv{position:relative;isolation:isolate;width:100%;aspect-ratio:4/5;max-width:100%;color:var(--kz-text-primary)}
.kz-rtv-cabinet{position:absolute;inset:0;overflow:hidden}
.kz-rtv-body{position:absolute;inset:4% 4% 16%;border:1px solid var(--kz-border-strong);border-radius:8% / 6%;background:linear-gradient(145deg,var(--kz-surface-sheen),transparent 35%),linear-gradient(145deg,color-mix(in srgb,var(--kz-warning) 18%,var(--kz-surface-3)),color-mix(in srgb,var(--kz-warning-text) 10%,var(--kz-surface-2)) 48%,var(--kz-surface-1));box-shadow:inset 0 1px 0 var(--kz-surface-sheen),inset 0 -3px 6px color-mix(in srgb,var(--kz-scrim-strong) 30%,transparent),0 1.2rem 2rem color-mix(in srgb,var(--kz-scrim-strong) 24%,transparent)}
.kz-rtv[data-variant=portable] .kz-rtv-body{border-radius:12% / 8%;background:linear-gradient(145deg,var(--kz-surface-1),var(--kz-surface-2) 55%,var(--kz-surface-3))}
.kz-rtv-body:after{position:absolute;inset:0;border-radius:inherit;background:repeating-linear-gradient(115deg,transparent 0 7px,color-mix(in srgb,var(--kz-border-subtle) 35%,transparent) 8px 9px);content:"";opacity:.4;pointer-events:none}
.kz-rtv-bezel{position:absolute;top:0;bottom:0;left:6%;width:61%;border:1px solid var(--kz-border-strong);border-radius:14% / 7%;background:linear-gradient(145deg,var(--kz-surface-1),var(--kz-surface-3));box-shadow:inset 0 2px 5px color-mix(in srgb,var(--kz-scrim-strong) 35%,transparent),0 1px 2px color-mix(in srgb,var(--kz-surface-sheen) 60%,transparent)}
.kz-rtv[data-variant=portable] .kz-rtv-bezel{border-radius:19% / 9%;background:linear-gradient(145deg,var(--kz-surface-0),var(--kz-surface-2))}
.kz-rtv-controls{position:absolute;top:16%;right:7%;display:flex;width:23%;flex-direction:column;align-items:center;gap:1.1rem}
.kz-rtv-knob{position:relative;display:block;width:2.3rem;max-width:70%;aspect-ratio:1;border:2px solid var(--kz-border-strong);border-radius:50%;background:radial-gradient(circle at 35% 28%,var(--kz-surface-sheen),transparent 30%),linear-gradient(145deg,var(--kz-surface-1),var(--kz-surface-3));box-shadow:inset 0 -2px 3px color-mix(in srgb,var(--kz-scrim-strong) 35%,transparent),0 2px 4px color-mix(in srgb,var(--kz-scrim-strong) 25%,transparent);color:var(--kz-accent)}
.kz-rtv-knob[data-hue=accent]{background:radial-gradient(circle at 35% 28%,var(--kz-surface-sheen),transparent 30%),linear-gradient(145deg,var(--kz-accent-text),var(--kz-accent))}
.kz-rtv-knob:after{position:absolute;top:14%;left:calc(50% - 1px);width:2px;height:27%;border-radius:2px;background:var(--kz-on-accent);content:""}
.kz-rtv[data-variant=portable] .kz-rtv-knob{width:1.9rem}
.kz-rtv-speaker{position:absolute;right:7%;bottom:9%;display:flex;width:23%;flex-direction:column;gap:3px}
.kz-rtv-speaker i{height:2px;border-radius:2px;background:var(--kz-border-strong);box-shadow:0 1px 0 var(--kz-surface-sheen)}
.kz-rtv[data-variant=portable] .kz-rtv-speaker{display:none}
.kz-rtv-stand{position:absolute;bottom:4%;left:36%;width:28%;height:12%;border-bottom:1px solid var(--kz-border-strong);border-radius:0 0 30% 30%;background:linear-gradient(180deg,var(--kz-surface-2),var(--kz-surface-3));clip-path:polygon(25% 0,75% 0,88% 78%,100% 100%,0 100%,12% 78%)}
.kz-rtv[data-variant=portable] .kz-rtv-stand{left:40%;width:20%;height:8%;border-radius:50%;clip-path:ellipse(50% 50% at 50% 50%)}
.kz-rtv-screen{position:absolute;top:4%;left:9.5%;width:56%;height:80%;overflow:hidden;border:2px solid color-mix(in srgb,var(--kz-border-strong) 72%,var(--kz-accent));border-radius:13% / 7%;background:var(--kz-scrim-strong);box-shadow:0 0 1.1rem color-mix(in srgb,var(--kz-accent) 30%,transparent),inset 0 0 1.2rem var(--kz-scrim-strong)}
.kz-rtv[data-variant=portable] .kz-rtv-screen{border-radius:18% / 9%}
.kz-rtv-screen .kz-rtv-player{height:100%;width:100%;border-radius:inherit}
.kz-rtv-screen .kz-embed{height:100%;width:100%;aspect-ratio:auto;border-radius:inherit}
.kz-rtv-player video,.kz-rtv-player img{object-fit:cover}
.kz-rtv-effects{position:absolute;z-index:5;inset:0;overflow:hidden;border-radius:inherit;pointer-events:none}
.kz-rtv-effects:before{position:absolute;inset:0;background:repeating-linear-gradient(to bottom,transparent 0 3px,color-mix(in srgb,var(--kz-scrim-strong) 25%,transparent) 4px 5px);content:"";opacity:.46}
.kz-rtv-effects:after{position:absolute;inset:-1px;background:radial-gradient(ellipse at center,transparent 55%,var(--kz-scrim-strong) 100%);content:"";opacity:.52}
.kz-rtv-glow{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,color-mix(in srgb,var(--kz-accent) 14%,transparent),transparent 68%);opacity:.7}
.kz-rtv-noise{position:absolute;inset:0;height:100%;width:100%;opacity:.55;filter:contrast(1.3) brightness(.85)}
.kz-rtv-glass{position:absolute;inset:0;height:100%;width:100%;opacity:.28}
.kz-rtv-power{position:absolute;inset:0;background:var(--kz-text-on-media);opacity:0;transform:scaleY(.01);transform-origin:center;pointer-events:none}
.kz-rtv[data-powered=true] .kz-rtv-power{animation:kz-rtv-power .65s ease-out both}
.kz-rtv-channel{position:absolute;z-index:7;top:9%;right:5%;width:28%;overflow:hidden;color:var(--kz-text-primary);font:600 clamp(.42rem,1.2vw,.55rem)/1.2 var(--kz-font-mono,monospace);text-align:center;text-overflow:ellipsis;white-space:nowrap}
.kz-rtv[data-variant=portable] .kz-rtv-channel{top:7%}
.kz-rtv:focus-within .kz-rtv-screen{outline:2px solid var(--kz-ring);outline-offset:3px}
@keyframes kz-rtv-power{0%{opacity:1;transform:scaleY(.01)}45%{opacity:.9;transform:scaleY(1)}100%{opacity:0;transform:scaleY(1)}}
@keyframes kz-rtv-noise{0%,100%{opacity:.38}50%{opacity:.62}}
@media (prefers-reduced-motion:no-preference){.kz-rtv[data-off=true] .kz-rtv-noise{animation:kz-rtv-noise .18s steps(2,end) infinite}}
@media (prefers-reduced-motion:reduce){.kz-rtv-power{display:none!important}.kz-rtv-noise{animation:none!important}}
`;

/** A vertical video in a CSS-and-SVG television cabinet. */
export interface RetroTvProps extends Omit<VideoPlayerProps, "aspectRatio" | "autoPlay" | "className" | "loop" | "muted" | "preload" | "src"> {
  /** The video's address. Optional when the screen shows `children`. */
  src?: VideoPlayerProps["src"];
  /** What the screen shows instead of the video player: an `EmbedFacade` for a platform's short video. */
  children?: React.ReactNode;
  /** The cabinet style. */
  variant?: "cabinet" | "portable";
  /** A short channel label shown on the cabinet, for example `"CH 3 · Plateau"`. */
  channel?: string;
  /** Shows animated static instead of loading or playing the video. */
  off?: boolean;
  /** Starts muted and plays only while on screen; reduced motion waits for a gesture. Default `true`. */
  autoPlay?: boolean;
  /** Starts the player muted. Default `true`. */
  muted?: boolean;
  /** Plays the video again from the start when it ends. Default `true`. */
  loop?: boolean;
  /** How much to fetch before playback. Default `none` for lazy loading. */
  preload?: VideoPlayerProps["preload"];
  /** Additional classes on the television frame. */
  className?: string;
}

/**
 * A vertical video presented in an old-school television; the existing player remains fully accessible.
 */
export function RetroTv({
  variant = "cabinet",
  channel,
  off = false,
  autoPlay = true,
  muted = true,
  loop = true,
  preload = "none",
  className,
  children,
  src,
  ...playerProps
}: RetroTvProps) {
  const root = React.useRef<HTMLDivElement>(null);
  const [powered, setPowered] = React.useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const noiseId = `${uid}-noise`;
  const glassId = `${uid}-glass`;
  const shineId = `${uid}-shine`;

  useInView(root, setPowered);
  const player = src ? <VideoPlayer {...playerProps} src={src} className="kz-rtv-player" aspectRatio="9 / 16" autoPlay={autoPlay} muted={muted} loop={loop} preload={preload} /> : null;
  const screen = children ?? player;

  return (
    <div ref={root} className={["kz-rtv", className].filter(Boolean).join(" ")} data-variant={variant} data-powered={powered && !reducedMotion ? "true" : undefined} data-off={off ? "true" : undefined}>
      <style>{styles}</style>
      <div className="kz-rtv-cabinet" aria-hidden="true">
        <div className="kz-rtv-body">
          <div className="kz-rtv-bezel" />
          <div className="kz-rtv-controls">
            <span className="kz-rtv-knob" data-hue="accent" />
            <span className="kz-rtv-knob" data-hue="accent" />
          </div>
          <div className="kz-rtv-speaker">{Array.from({ length: 7 }, (_, index) => <i key={index} />)}</div>
        </div>
        <div className="kz-rtv-stand" />
      </div>
      {channel && <span className="kz-rtv-channel">{channel}</span>}
      <div className="kz-rtv-screen">
        {off ? (
          <svg className="kz-rtv-noise" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <filter id={noiseId}><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
            <rect width="100%" height="100%" filter={`url(#${noiseId})`} />
          </svg>
        ) : (
          screen
        )}
        <div className="kz-rtv-effects" aria-hidden="true">
          <svg className="kz-rtv-glass" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <radialGradient id={shineId} cx="50%" cy="42%" r="68%">
                <stop offset="0" stopColor="var(--kz-surface-sheen)" stopOpacity=".12" />
                <stop offset="1" stopColor="var(--kz-scrim-strong)" stopOpacity=".2" />
              </radialGradient>
              <filter id={glassId}>
                <feTurbulence baseFrequency=".01 .04" numOctaves="1" seed="2" result="curve" />
                <feDisplacementMap in="SourceGraphic" in2="curve" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
            <rect width="100" height="100" fill={`url(#${shineId})`} filter={`url(#${glassId})`} />
          </svg>
          <span className="kz-rtv-glow" />
          <span className="kz-rtv-power" />
        </div>
      </div>
      {off && <span className="sr-only">{playerProps.title}</span>}
    </div>
  );
}
