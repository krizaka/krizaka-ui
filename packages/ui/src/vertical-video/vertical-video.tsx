// Client (a video element, an observer, keys). A 9:16 clip filling its frame, with the action rail of a short-video feed on
// the right (avatar + follow, like, comment, share, a slot for tip / unlock, more) and the caption block bottom-left. Every
// word is a prop; counts are formatted with @krizaka/intl; everything over the picture reads on the invariant `scrim` /
// `fg-on-media` tokens, so it is legible in both themes. Under reduced motion nothing autoplays: the poster and a play button.
import { formatCompact } from "@krizaka/intl";
import * as React from "react";

import { Avatar } from "../avatar/avatar";
import { IconButton } from "../button/button";
import { cn } from "../cn";
import { VerifiedBadge } from "../verified-badge/verified-badge";

export interface VerticalVideoLabels {
  /** "Play" / "Pause" — the tap target over the picture. */
  play: string;
  pause: string;
  /** "Like" / "Unlike" (the button's name; the state is `aria-pressed`). */
  like: string;
  comment: string;
  share: string;
  more: string;
  /** "Follow Elena" — `{name}` is replaced by the creator's name. */
  follow: string;
  /** "Following Elena". */
  following: string;
  /** "More" / "Less" on a long caption. */
  expand: string;
  collapse: string;
  /** The progress bar's name ("Progress"). */
  progress: string;
  /** The rail's name ("Actions"). */
  actions: string;
}

export const verticalVideoLabels: VerticalVideoLabels = {
  play: "Play",
  pause: "Pause",
  like: "Like",
  comment: "Comments",
  share: "Share",
  more: "More",
  follow: "Follow {name}",
  following: "Following {name}",
  expand: "More",
  collapse: "Less",
  progress: "Progress",
  actions: "Actions",
};

export interface VerticalVideoCreator {
  name: string;
  /** Their portrait. */
  avatarSrc?: string;
  /** The seal's words ("Verified"): shows the seal beside the name. */
  verifiedLabel?: string;
}

export interface VerticalVideoProps extends Omit<React.ComponentProps<"article">, "title" | "children"> {
  /** The video's accessible name ("Video: Night shoot, part 2"), passed translated. */
  title: string;
  /** The clip — absent, the poster alone shows (MP4 or WebM; an HLS address only in Safari — use the player of `@krizaka/ui/video-player` for HLS). */
  src?: string;
  /** The picture until the first frame, and under reduced motion. */
  poster?: string;
  /** Plays while `true`; a `ShortFeed` passes it for the slide in view. Default `true`. */
  active?: boolean;
  /** The next slide's: `auto` loads it ahead, `none` waits. Default `metadata`. */
  preload?: "none" | "metadata" | "auto";
  /** Plays again at the end. Default `true`. */
  loop?: boolean;
  /** Starts muted (autoplay needs it). Default `true`. */
  muted?: boolean;
  /** Who made it: name, portrait, the seal's words. */
  creator: VerticalVideoCreator;
  /** A pill beside the name: "AI-GENERATED" — said on the picture, never only in a page's footnote. */
  disclosure?: string;
  /** The caption: collapsed to two lines, expandable when long. */
  caption?: string;
  /** Tags under the caption (without `#`). */
  tags?: readonly string[];
  /** The sound or credit line ("Original sound — Elena"). */
  credit?: string;
  /** The like count under its button, compact (`12.4K`) in `locale`. */
  likes?: number;
  /** The comment count under its button. */
  comments?: number;
  /** The share count under its button. */
  shares?: number;
  /** Whether the viewer likes it: `aria-pressed` on the like button. */
  liked?: boolean;
  /** Whether the viewer follows the creator: the "+" on the avatar becomes a check. */
  following?: boolean;
  /** The viewer likes or unlikes (the button, `L`, a double tap). */
  onLike?: (liked: boolean) => void;
  /** Opens the comments; without it the button still shows. */
  onComment?: () => void;
  /** Opens the share sheet. */
  onShare?: () => void;
  /** The viewer follows or unfollows; without it the avatar has no "+". */
  onFollow?: (following: boolean) => void;
  /** The "more" button's action (report, hide); without it the button is not drawn. */
  onMore?: () => void;
  /** The product's own action on the rail: a tip, an unlock — a button of yours (≥ 44 px, named). */
  tipSlot?: React.ReactNode;
  /** Top left: a chip over the picture (an auction's time left). */
  topStart?: React.ReactNode;
  /** Above the caption: a goal gauge, a challenge's progress. */
  aboveCaption?: React.ReactNode;
  /** The locale of the counts. Default `en`. */
  locale?: string;
  /** Every word, passed translated. */
  labels?: Partial<VerticalVideoLabels>;
}

const glyph = (d: string) => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);
const HEART = "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z";
const COMMENT = "M4 5h16v11H9l-5 4z";
const SHARE = "M4 12v7h16v-7M12 3v12M7 8l5-5 5 5";
const MORE = "M5 12h.01M12 12h.01M19 12h.01";

const useReducedMotion = () =>
  React.useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", notify);
      return () => query.removeEventListener("change", notify);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

/** One short video: 9:16, the rail of actions on the right, the creator's caption bottom-left, a progress hairline. */
export function VerticalVideo({
  title,
  src,
  poster,
  active = true,
  preload = "metadata",
  loop = true,
  muted = true,
  creator,
  disclosure,
  caption,
  tags = [],
  credit,
  likes,
  comments,
  shares,
  liked = false,
  following = false,
  onLike,
  onComment,
  onShare,
  onFollow,
  onMore,
  tipSlot,
  topStart,
  aboveCaption,
  locale = "en",
  labels: custom,
  className,
  onKeyDown,
  ...props
}: VerticalVideoProps) {
  const labels = { ...verticalVideoLabels, ...custom };
  const reduce = useReducedMotion();
  const video = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [paused, setPaused] = React.useState(false); // the viewer's pause: it holds until they play again
  const [progress, setProgress] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [heart, setHeart] = React.useState(0);

  const shouldPlay = active && !paused && !reduce;
  React.useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (shouldPlay) void el.play().catch(() => undefined);
    else el.pause();
  }, [shouldPlay, src]);

  const press = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      setPaused(false);
      void el.play().catch(() => undefined);
    } else {
      setPaused(true);
      el.pause();
    }
  };
  const like = () => onLike?.(!liked);
  const doubleTap = () => {
    if (!liked) like();
    setHeart((n) => n + 1); // a heart blooms over the picture (still under reduced motion: it shows and goes)
  };
  const count = (n?: number) => (n === undefined ? undefined : formatCompact(n, { locale }));
  const name = creator.name;

  return (
    <article
      aria-label={title}
      tabIndex={0}
      data-playing={playing ? "" : undefined}
      className={cn("relative isolate aspect-[9/16] w-full overflow-hidden bg-surface-0 text-fg-on-media focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring", className)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.target !== event.currentTarget) return;
        if (event.key === " " || event.key.toLowerCase() === "k") {
          event.preventDefault();
          press();
        } else if (event.key.toLowerCase() === "l") like();
      }}
      {...props}
    >
      <video
        ref={video}
        src={src}
        poster={poster}
        muted={muted}
        loop={loop}
        playsInline
        preload={preload}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => {
          const el = event.currentTarget;
          setProgress(el.duration ? el.currentTime / el.duration : 0);
        }}
      />
      {/* The tap target: a tap pauses or plays, a double tap likes. It is a button, so the keyboard has it too. */}
      <button type="button" aria-label={playing ? labels.pause : labels.play} onClick={press} onDoubleClick={doubleTap} className="absolute inset-0 cursor-pointer bg-transparent focus-visible:outline-hidden">
        {!playing && (
          <span aria-hidden className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-scrim backdrop-blur-md">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </span>
        )}
      </button>
      {heart > 0 && (
        <span key={heart} aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center text-accent motion-safe:animate-ping">
          <svg viewBox="0 0 24 24" className="h-20 w-20" fill="currentColor"><path d={HEART} /></svg>
        </span>
      )}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-scrim to-transparent" />
      {topStart && <div className="absolute left-3 top-3">{topStart}</div>}

      <div role="group" aria-label={labels.actions} className="absolute bottom-16 right-2 flex flex-col items-center gap-3">
        <div className="relative">
          <Avatar src={creator.avatarSrc} alt={name} fallback={name.slice(0, 1)} size="md" className="ring-2 ring-white" />
          {onFollow && (
            <IconButton
              label={format(following ? labels.following : labels.follow, name)}
              aria-pressed={following}
              size="icon"
              variant={following ? "secondary" : "primary"}
              shape="pill"
              onClick={() => onFollow(!following)}
              className="absolute -bottom-3 left-1/2 h-6 min-h-6 w-6 min-w-6 -translate-x-1/2 p-0"
            >
              {glyph(following ? "M5 12l5 5 9-10" : "M12 5v14M5 12h14")}
            </IconButton>
          )}
        </div>
        <Rail label={labels.like} count={count(likes)} pressed={liked} onClick={like} tone={liked ? "text-accent" : undefined}>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={HEART} /></svg>
        </Rail>
        <Rail label={labels.comment} count={count(comments)} onClick={onComment}>{glyph(COMMENT)}</Rail>
        <Rail label={labels.share} count={count(shares)} onClick={onShare}>{glyph(SHARE)}</Rail>
        {tipSlot}
        {onMore && <Rail label={labels.more} onClick={onMore}>{glyph(MORE)}</Rail>}
      </div>

      <div className="absolute bottom-4 left-3 right-20 flex flex-col gap-1.5">
        {aboveCaption}
        <p className="flex items-center gap-1.5 text-sm font-bold">
          {name}
          {creator.verifiedLabel && <VerifiedBadge label={creator.verifiedLabel} onMedia size="sm" />}
          {disclosure && <span className="whitespace-nowrap rounded-full bg-scrim px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-fg-on-media backdrop-blur-md">{disclosure}</span>}
        </p>
        {caption && (
          <p className={cn("text-sm leading-snug", !open && "line-clamp-2")}>
            {caption}
            {tags.length > 0 && <span className="font-semibold"> {tags.map((tag) => `#${tag}`).join(" ")}</span>}
          </p>
        )}
        {caption && caption.length > 90 && (
          <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="w-fit rounded text-xs font-semibold underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring">
            {open ? labels.collapse : labels.expand}
          </button>
        )}
        {credit && <p className="text-xs opacity-90">{credit}</p>}
      </div>

      <div role="progressbar" aria-label={labels.progress} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} className="absolute inset-x-0 bottom-0 h-1 bg-scrim">
        <div className="h-full bg-white" style={{ width: `${progress * 100}%` }} />
      </div>
    </article>
  );
}

/** "Follow {name}" → "Follow Elena". */
const format = (message: string, name: string) => message.replace("{name}", name);

function Rail({ label, count, pressed, onClick, tone, children }: { label: string; count?: string | undefined; pressed?: boolean; onClick?: (() => void) | undefined; tone?: string | undefined; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <IconButton label={label} aria-pressed={pressed} variant="ghost" shape="pill" onClick={onClick} className={cn("h-11 min-h-11 w-11 min-w-11 bg-scrim text-fg-on-media backdrop-blur-md hover:bg-scrim", tone)}>
        {children}
      </IconButton>
      {count !== undefined && <span className="text-xs font-semibold tabular-nums">{count}</span>}
    </div>
  );
}
