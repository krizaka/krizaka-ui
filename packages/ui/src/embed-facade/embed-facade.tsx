"use client";

// A click-to-load facade for a platform's short video (krizaka-ui#605, the lite-youtube-embed pattern). Until the visitor
// asks, nothing is requested from TikTok, YouTube or Instagram: no frame, no script, no platform picture. The poster is the
// host's own copy. After the click: one frame, a minimal sandbox and permissions. Loi 25: no third-party tracker without consent.
import * as React from "react";

import { cn } from "../cn";
import { EMBED_PLATFORMS, type EmbedPlatform, embedUrl, isOwnPoster } from "./embed-url";

export interface EmbedFacadeProps extends Omit<React.ComponentProps<"div">, "title" | "children" | "onLoad"> {
  /** Which platform's frame to load. */
  platform: EmbedPlatform;
  /** The public address of the post (`embedUrl` validates it; anything else renders nothing). */
  url: string;
  /** The accessible name of the video ("Latest reel"), passed translated: it names the frame once loaded. */
  title: string;
  /** The button: what it does and which platform it loads ("Load TikTok and play"), passed translated. */
  playLabel: string;
  /** The host's own copy of the picture (never an address on the platform: those are refused, they would be a request). */
  poster?: string;
  /** A line under the button, for what the platform will receive on the click (translated). */
  notice?: React.ReactNode;
  /** The ratio of the box when it stands alone; inside a television's screen it fills its parent. @default "9 / 16" */
  aspectRatio?: string;
  /** Called once, when the visitor has asked and the frame is added. */
  onLoad?: () => void;
}

const SANDBOX = "allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox";

/** A short video from a platform, behind a button: the frame exists only after the click. */
export function EmbedFacade({ platform, url, title, playLabel, poster, notice, aspectRatio = "9 / 16", onLoad, className, style, ...props }: EmbedFacadeProps) {
  const frame = embedUrl(platform, url);
  const [loaded, setLoaded] = React.useState(false);
  const ref = React.useRef<HTMLIFrameElement>(null);
  React.useEffect(() => {
    if (loaded) ref.current?.focus();
  }, [loaded]);
  if (!frame) return null;
  const load = () => {
    setLoaded(true);
    onLoad?.();
  };
  return (
    <div
      role="group"
      aria-label={title}
      className={cn("kz-embed", className)}
      data-platform={platform}
      data-loaded={loaded ? "" : undefined}
      style={{ ...style, ["--kz-embed-ratio" as string]: aspectRatio }}
      {...props}
    >
      {loaded ? (
        <iframe ref={ref} src={frame} title={title} sandbox={SANDBOX} allow="fullscreen; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" className="kz-embed-frame" />
      ) : (
        <>
          {poster && isOwnPoster(poster) && <img src={poster} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" className="kz-embed-poster" />}
          <div className="kz-embed-gate">
            <button type="button" onClick={load} className="kz-embed-play" data-platform-name={EMBED_PLATFORMS[platform]}>
              <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" width="16" height="16"><path d="M4 2.5v11l9-5.5Z" fill="currentColor" /></svg>
              <span>{playLabel}</span>
            </button>
            {notice && <p className="kz-embed-notice">{notice}</p>}
          </div>
        </>
      )}
    </div>
  );
}
