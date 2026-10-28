"use client";

import * as React from "react";

import { CaptionsGlyph, PauseGlyph, PlayGlyph, VolumeGlyph } from "../glyphs";
import { formatClock, playSafely, useInView } from "../media";
import type { RetroTvLabels, RetroTvSource, RetroTvTransition } from "./retro-tv";

const styles = `.kz-rtv-layer{position:absolute;inset:0;background:var(--kz-scrim-strong)}
.kz-rtv-layer video,.kz-rtv-layer img,.kz-rtv-layer .kz-embed{width:100%;height:100%;object-fit:contain;aspect-ratio:auto}
.kz-rtv-layer[data-role=out]{z-index:1}.kz-rtv-layer[data-role=in]{z-index:2}
.kz-rtv-static{position:absolute;inset:0;z-index:4;overflow:hidden;pointer-events:none}
.kz-rtv-static:after{position:absolute;inset:-20% 0 auto;height:18%;background:linear-gradient(transparent,color-mix(in srgb,var(--kz-text-on-media) 55%,transparent),transparent);content:""}
.kz-rtv-chip,.kz-rtv-bar button{display:inline-flex;min-width:2.25rem;min-height:2.25rem;align-items:center;justify-content:center;gap:.35rem;padding:0 .55rem;border:1px solid color-mix(in srgb,var(--kz-text-on-media) 30%,transparent);border-radius:999px;background:color-mix(in srgb,var(--kz-scrim-strong) 82%,transparent);color:var(--kz-text-on-media);font:600 .72rem/1 var(--kz-font-mono,monospace);cursor:pointer}
.kz-rtv-chip{position:absolute;z-index:8;top:.5rem;left:.5rem}
.kz-rtv-chip:focus-visible,.kz-rtv-bar button:focus-visible,.kz-rtv-seek:focus-visible{outline:2px solid var(--kz-ring);outline-offset:2px}
.kz-rtv-bar{position:absolute;z-index:8;inset:auto 0 0;display:flex;flex-wrap:wrap;align-items:center;gap:.4rem;padding:1.6rem .6rem .6rem;background:linear-gradient(transparent,color-mix(in srgb,var(--kz-scrim-strong) 85%,transparent));opacity:0;transition:opacity .25s}
.kz-rtv-screen[data-active=true] .kz-rtv-bar,.kz-rtv-screen:focus-within .kz-rtv-bar,.kz-rtv-screen:hover .kz-rtv-bar{opacity:1}
.kz-rtv-bar svg{width:1rem;height:1rem}
.kz-rtv-time{padding:.2rem .45rem;border-radius:4px;background:var(--kz-scrim-strong);color:var(--kz-text-on-media);font:600 .75rem/1 var(--kz-font-mono,monospace);font-variant-numeric:tabular-nums}
.kz-rtv-seek{flex:1 1 6rem;min-width:5rem;height:1.5rem;accent-color:var(--kz-accent);cursor:pointer}
.kz-rtv-progress{position:absolute;z-index:7;inset:auto 0 0;height:3px;background:color-mix(in srgb,var(--kz-text-on-media) 25%,transparent)}
.kz-rtv-progress i{display:block;height:100%;background:var(--kz-accent);transform-origin:left;transform:scaleX(var(--kz-rtv-p,0))}
@keyframes kz-rtv-in{from{opacity:0}to{opacity:1}}@keyframes kz-rtv-out{from{opacity:1}to{opacity:0}}
@keyframes kz-rtv-sin{from{transform:translateX(100%)}to{transform:none}}@keyframes kz-rtv-sout{from{transform:none}to{transform:translateX(-100%)}}
@keyframes kz-rtv-tune{0%{transform:translateY(-12%) scaleY(1.15);filter:contrast(2) brightness(1.6)}100%{transform:none;filter:none}}
@keyframes kz-rtv-roll{from{transform:translateY(0)}to{transform:translateY(700%)}}
@media (prefers-reduced-motion:no-preference){
.kz-rtv-layer[data-role=in][data-tr=crossfade]{animation:kz-rtv-in .6s both}.kz-rtv-layer[data-role=out][data-tr=crossfade]{animation:kz-rtv-out .6s both}
.kz-rtv-layer[data-role=in][data-tr=slide]{animation:kz-rtv-sin .5s ease-out both}.kz-rtv-layer[data-role=out][data-tr=slide]{animation:kz-rtv-sout .5s ease-out both}
.kz-rtv-layer[data-role=in][data-tr=channel]{animation:kz-rtv-tune .55s steps(8,end) both}
.kz-rtv-static{animation:kz-rtv-in .55s reverse both}.kz-rtv-static:after{animation:kz-rtv-roll .55s linear both}}
`;

type PlaylistProps = { playlist: readonly RetroTvSource[]; transition: RetroTvTransition; labels: RetroTvLabels; muted: boolean; autoPlay: boolean; renderEmbed?: (source: RetroTvSource) => React.ReactNode; onMutedChange?: (muted: boolean) => void; onIndexChange?: (index: number) => void; title?: string; reduced: boolean; setMutedState: (m: boolean) => void; setIndex: (i: number) => void; index: number };

export function PlaylistScreen({ playlist, transition, labels, muted, autoPlay, renderEmbed, onMutedChange, onIndexChange, title, reduced, setMutedState, setIndex, index }: PlaylistProps) {
  const region = React.useRef<HTMLDivElement>(null);
  const video = React.useRef<HTMLVideoElement>(null);
  const [prev, setPrev] = React.useState<number | null>(null);
  const [seen, setSeen] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [time, setTime] = React.useState({ t: 0, d: 0 });
  const [active, setActive] = React.useState(false);
  const [captionsOn, setCaptionsOn] = React.useState(false);
  const n = playlist.length;
  const current = playlist[index];
  const wake = React.useCallback(() => setActive(true), []);

  useInView(region, (v) => { if (v) setSeen(true); else video.current?.pause(); });
  React.useEffect(() => { if (!active) return; const id = setTimeout(() => setActive(false), 2500); return () => clearTimeout(id); }, [active]);
  React.useEffect(() => { if (prev === null) return; const id = setTimeout(() => setPrev(null), reduced ? 0 : 650); return () => clearTimeout(id); }, [prev, reduced]);
  React.useEffect(() => { if (seen && autoPlay && !reduced && current?.src) playSafely(video.current); }, [seen, autoPlay, reduced, index, current?.src]);
  React.useEffect(() => { const list = video.current?.textTracks; if (list) Array.from(list).forEach((track, i) => { track.mode = captionsOn && i === 0 ? "showing" : "disabled"; }); }, [captionsOn, index]);

  const go = (to: number) => {
    const next = ((to % n) + n) % n;
    if (next === index && n > 1) return;
    if (!reduced && n > 1) setPrev(index);
    setIndex(next);
    setTime({ t: 0, d: 0 });
    onIndexChange?.(next);
  };
  const toggle = () => { const v = video.current; if (!v) return; if (v.paused) playSafely(v); else v.pause(); };
  const setMuted = (m: boolean) => { setMutedState(m); onMutedChange?.(m); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    const v = video.current;
    const act: Record<string, () => void> = { " ": toggle, k: toggle, m: () => setMuted(!muted), n: () => go(index + 1), p: () => go(index - 1), ArrowRight: () => { if (v) v.currentTime += 5; }, ArrowLeft: () => { if (v) v.currentTime -= 5; } };
    const fn = act[e.key.length === 1 ? e.key.toLowerCase() : e.key];
    if (fn) { e.preventDefault(); fn(); wake(); }
  };
  const layer = (i: number, role: "in" | "out") => {
    const src = playlist[i];
    if (!src) return null;
    return (
      <div className="kz-rtv-layer" key={src.id} data-role={role} data-tr={transition}>
        {src.src ? (
          role === "in" ? (
            <video ref={video} src={seen ? src.src : undefined} poster={src.poster} muted={muted} playsInline preload={seen ? "auto" : "none"} loop={n === 1} aria-label={src.title}
              onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { if (n > 1) go(index + 1); }}
              onTimeUpdate={(e) => setTime({ t: e.currentTarget.currentTime, d: e.currentTarget.duration || 0 })} onLoadedMetadata={(e) => setTime({ t: 0, d: e.currentTarget.duration || 0 })}>
              {src.tracks?.map((t) => <track key={t.src} kind="captions" src={t.src} srcLang={t.srcLang} label={t.label} />)}
            </video>
          ) : src.poster ? <img src={src.poster} alt="" /> : null
        ) : role === "in" ? renderEmbed?.(src) : null}
      </div>
    );
  };
  const p = time.d ? Math.min(1, time.t / time.d) : 0;
  const hasCaptions = !!current?.tracks?.length;
  return (
    <>
    <style>{styles}</style>
    <div ref={region} role="region" aria-label={title ?? current?.title} tabIndex={0} className="kz-rtv-playlist" data-active={active ? "true" : undefined} onKeyDown={onKey} onPointerMove={wake} onPointerDown={wake} onFocus={wake} style={{ position: "absolute", inset: 0, "--kz-rtv-p": p } as React.CSSProperties}>
      {prev !== null && layer(prev, "out")}
      {layer(index, "in")}
      {prev !== null && transition === "channel" && <div className="kz-rtv-static" aria-hidden="true"><span className="kz-rtv-noise" style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,var(--kz-text-on-media) 0 1px,var(--kz-scrim-strong) 1px 3px)" }} /></div>}
      <button type="button" className="kz-rtv-chip" aria-pressed={!muted} aria-label={muted ? labels.soundOff : labels.soundOn} onClick={() => setMuted(!muted)}><VolumeGlyph muted={muted} /></button>
      <div className="kz-rtv-progress" aria-hidden="true"><i /></div>
      <div className="kz-rtv-bar">
        <button type="button" aria-label={labels.previous} onClick={() => go(index - 1)} disabled={n < 2}>«</button>
        <button type="button" aria-label={playing ? labels.pause : labels.play} onClick={toggle} disabled={!current?.src}>{playing ? <PauseGlyph /> : <PlayGlyph />}</button>
        <button type="button" aria-label={labels.next} onClick={() => go(index + 1)} disabled={n < 2}>»</button>
        <span className="kz-rtv-time">{formatClock(time.t)} / {formatClock(time.d)}</span>
        <input className="kz-rtv-seek" type="range" aria-label={labels.seek} min={0} max={Math.max(1, Math.floor(time.d))} value={Math.floor(time.t)} disabled={!time.d} onChange={(e) => { if (video.current) video.current.currentTime = Number(e.target.value); }} />
        {hasCaptions && <button type="button" aria-label={labels.captions} aria-pressed={captionsOn} onClick={() => setCaptionsOn(!captionsOn)}><CaptionsGlyph /></button>}
      </div>
      <span className="sr-only" aria-live="polite">{labels.nowPlaying}: {current?.title} ({index + 1}/{n})</span>
    </div>
    </>
  );
}
