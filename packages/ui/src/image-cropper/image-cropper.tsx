// Client. A fixed frame (a profile picture's square, a vertical 9:16, a banner) over a picture or a video the person
// drags and zooms to choose what stays in. The value is a focus point (0–1 on each axis) and a zoom — independent of
// the screen, the same on the server — and `cropRect` turns it into pixels of the source. Keyboard: the frame takes the
// focus, the arrows move (Shift: faster), + / − zoom; the zoom is also a slider. No motion but the person's own.
import * as React from "react";

import { clamp } from "../media";
import { Slider } from "../slider";
import { tv } from "../tv";

export const imageCropper = tv({
  slots: {
    root: "flex w-full flex-col gap-3",
    frame:
      "relative w-full cursor-grab touch-none overflow-hidden rounded-xl bg-media active:cursor-grabbing " +
      "focus-visible:focus-ring",
    media: "pointer-events-none absolute max-w-none select-none",
    grid:
      "pointer-events-none absolute inset-0 rounded-xl border-2 border-fg-on-media/80 " +
      "bg-[linear-gradient(to_right,transparent_33.2%,var(--kz-text-on-media)_33.3%,transparent_33.5%,transparent_66.5%,var(--kz-text-on-media)_66.6%,transparent_66.8%),linear-gradient(to_bottom,transparent_33.2%,var(--kz-text-on-media)_33.3%,transparent_33.5%,transparent_66.5%,var(--kz-text-on-media)_66.6%,transparent_66.8%)] opacity-40",
    round: "pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_9999px_var(--kz-scrim-strong)]",
  },
});

/** Where the frame looks: the focus point (0–1 from the left and the top of the source) and the zoom (1 = covers). */
export type CropValue = { x: number; y: number; zoom: number };

/** The crop in pixels of the source: what to cut from an image of `width` × `height` for a frame of `aspect`. */
export function cropRect(value: CropValue, source: { width: number; height: number }, aspect: number) {
  const mediaAspect = source.width / source.height;
  const width = (mediaAspect > aspect ? source.height * aspect : source.width) / value.zoom;
  const height = width / aspect;
  const x = clamp(value.x * source.width - width / 2, 0, source.width - width);
  const y = clamp(value.y * source.height - height / 2, 0, source.height - height);
  return { x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height) };
}

export type ImageCropperLabels = {
  /** The frame's accessible name ("Crop area"). */
  frame: string;
  /** How to use it with the keyboard, read with the frame ("Use the arrow keys to move the picture, + and − to zoom."). */
  instructions: string;
  /** The zoom slider ("Zoom"). */
  zoom: string;
};

export const imageCropperLabels: ImageCropperLabels = {
  frame: "Crop area",
  instructions: "Drag or use the arrow keys to move the picture, + and − to zoom.",
  zoom: "Zoom",
};

export type ImageCropperProps = {
  /** The picture to crop. Or `children`: a `<video>` (with the class it is given through `mediaClassName`). */
  src?: string;
  /** The picture's alternative text, passed translated (empty when the frame's name says enough). */
  alt?: string;
  /** A media element instead of `src` — a `<video>` to choose the frame of a clip. Its natural size is in `naturalSize`. */
  children?: React.ReactElement<{ className?: string; style?: React.CSSProperties }>;
  /** The source's size when `children` is a video: `{ width: video.videoWidth, height: video.videoHeight }`. */
  naturalSize?: { width: number; height: number };
  /** The frame's width / height: 1 (a square), 9 / 16 (vertical), 3 (a banner). */
  aspect: number;
  /** A round mask over the square frame (a profile picture). */
  round?: boolean;
  /** The crop (controlled). */
  value?: CropValue;
  /** The crop at first, uncontrolled. Default: centred, no zoom. */
  defaultValue?: CropValue;
  /** Called on every move. */
  onValueChange?: (value: CropValue) => void;
  /** The largest zoom. Default 4. */
  maxZoom?: number;
  /** Shows the zoom slider under the frame. Default `true`. */
  showZoom?: boolean;
  /** The words, passed translated; English by default. */
  labels?: Partial<ImageCropperLabels>;
  /** Classes merged on the root. */
  className?: string;
};

/** Chooses what a fixed frame keeps of a picture or a video: drag, zoom, keyboard; a focus point and a zoom out. */
export function ImageCropper({
  src,
  alt = "",
  children,
  naturalSize,
  aspect,
  round,
  value: valueProp,
  defaultValue = { x: 0.5, y: 0.5, zoom: 1 },
  onValueChange,
  maxZoom = 4,
  showZoom = true,
  labels: given,
  className,
}: ImageCropperProps) {
  const labels = { ...imageCropperLabels, ...given };
  const s = imageCropper();
  const frame = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<{ x: number; y: number; from: CropValue } | null>(null);
  const [inner, setInner] = React.useState(defaultValue);
  const [loaded, setLoaded] = React.useState<{ width: number; height: number } | null>(null);
  const value = valueProp ?? inner;
  const id = React.useId();
  const size = naturalSize ?? loaded;
  const mediaAspect = size ? size.width / size.height : aspect;

  // The media's box, in % of the frame: it covers the frame at zoom 1.
  const widthPct = (mediaAspect > aspect ? (mediaAspect / aspect) * 100 : 100) * value.zoom;
  const heightPct = (mediaAspect > aspect ? 100 : (aspect / mediaAspect) * 100) * value.zoom;
  // The focus point's limits: the media never leaves a gap in the frame.
  const halfX = 50 / widthPct;
  const halfY = 50 / heightPct;

  const set = (next: CropValue) => {
    const zoom = clamp(next.zoom, 1, maxZoom);
    const wPct = (mediaAspect > aspect ? (mediaAspect / aspect) * 100 : 100) * zoom;
    const hPct = (mediaAspect > aspect ? 100 : (aspect / mediaAspect) * 100) * zoom;
    const fixed = { x: clamp(next.x, 50 / wPct, 1 - 50 / wPct), y: clamp(next.y, 50 / hPct, 1 - 50 / hPct), zoom };
    if (!valueProp) setInner(fixed);
    onValueChange?.(fixed);
  };

  const x = clamp(value.x, halfX, 1 - halfX);
  const y = clamp(value.y, halfY, 1 - halfY);
  const style: React.CSSProperties = {
    width: `${widthPct}%`,
    height: `${heightPct}%`,
    left: `${50 - x * widthPct}%`,
    top: `${50 - y * heightPct}%`,
  };

  return (
    <div className={s.root({ className })}>
      <div
        ref={frame}
        role="group"
        tabIndex={0}
        aria-label={labels.frame}
        aria-describedby={`${id}-help`}
        className={s.frame()}
        style={{ aspectRatio: String(aspect) }}
        onPointerDown={(event) => {
          frame.current?.setPointerCapture?.(event.pointerId);
          drag.current = { x: event.clientX, y: event.clientY, from: { x, y, zoom: value.zoom } };
        }}
        onPointerMove={(event) => {
          const start = drag.current;
          const box = frame.current?.getBoundingClientRect();
          if (!start || !box?.width) return;
          set({
            x: start.from.x - (event.clientX - start.x) / ((box.width * widthPct) / 100),
            y: start.from.y - (event.clientY - start.y) / ((box.height * heightPct) / 100),
            zoom: value.zoom,
          });
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onWheel={(event) => {
          if (!event.ctrlKey && !event.metaKey) return;
          event.preventDefault();
          set({ x, y, zoom: value.zoom - event.deltaY * 0.01 });
        }}
        onKeyDown={(event) => {
          const nudge = event.shiftKey ? 0.1 : 0.02;
          const moves: Record<string, CropValue> = {
            ArrowLeft: { x: x - nudge, y, zoom: value.zoom },
            ArrowRight: { x: x + nudge, y, zoom: value.zoom },
            ArrowUp: { x, y: y - nudge, zoom: value.zoom },
            ArrowDown: { x, y: y + nudge, zoom: value.zoom },
            "+": { x, y, zoom: value.zoom + 0.1 },
            "=": { x, y, zoom: value.zoom + 0.1 },
            "-": { x, y, zoom: value.zoom - 0.1 },
          };
          const next = moves[event.key];
          if (!next) return;
          event.preventDefault();
          set(next);
        }}
      >
        {children ? (
          React.cloneElement(children, { className: s.media({ className: children.props.className }), style: { ...children.props.style, ...style } })
        ) : src ? (
          <img
            src={src}
            alt={alt}
            draggable={false}
            className={s.media()}
            style={style}
            onLoad={(event) => setLoaded({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })}
          />
        ) : null}
        <span className={round ? s.round() : s.grid()} aria-hidden />
        <span id={`${id}-help`} className="sr-only">
          {labels.instructions}
        </span>
      </div>
      {showZoom && (
        <Slider
          label={labels.zoom}
          min={1}
          max={maxZoom}
          step={0.05}
          value={value.zoom}
          onValueChange={(zoom) => set({ x, y, zoom })}
          formatValue={(v) => `${Math.round(v * 100)} %`}
        />
      )}
    </div>
  );
}
