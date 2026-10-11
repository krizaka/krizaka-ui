// Client. The camera in the page: asks for it only when the person presses the button (never on load), shows the
// preview (mirrored for the front camera), takes a photo (a canvas → JPEG `Blob`) or records a clip (MediaRecorder,
// a timer, a maximum length), switches cameras. Every dead end has a way out: permission refused, no camera, no
// `getUserMedia` (an old browser, an insecure page) → the file picker with `capture`, which opens the phone's own
// camera. The tracks stop when it unmounts or the page is hidden.
import * as React from "react";

import { CameraGlyph, FlipGlyph } from "../glyphs";
import { formatClock, playSafely, usePrefersReducedMotion } from "../media";
import { tv } from "../tv";

export const mediaCapture = tv({
  slots: {
    root: "theme-dark relative isolate flex w-full flex-col overflow-hidden rounded-xl bg-media text-fg-on-media",
    stage: "relative w-full",
    video: "absolute inset-0 h-full w-full object-cover data-[mirrored]:-scale-x-100",
    panel: "absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-sm",
    panelIcon: "flex h-12 w-12 items-center justify-center rounded-full bg-fg-on-media/15",
    primary:
      "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent hover:bg-accent-hover " +
      "focus-visible:focus-ring",
    secondary:
      "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-fg-on-media/40 px-4 text-sm font-semibold text-fg-on-media hover:bg-fg-on-media/10 " +
      "focus-visible:focus-ring",
    bar: "absolute inset-x-0 bottom-0 flex items-center justify-center gap-6 bg-linear-to-t from-scrim-strong to-transparent px-4 pb-4 pt-10",
    shutter:
      "relative inline-flex h-16 w-16 items-center justify-center rounded-full border-4 border-fg-on-media bg-transparent " +
      "focus-visible:focus-ring " +
      "after:h-12 after:w-12 after:rounded-full after:bg-fg-on-media after:transition-all motion-reduce:after:transition-none " +
      "data-[mode=video]:after:bg-danger data-[recording]:after:h-6 data-[recording]:after:w-6 data-[recording]:after:rounded-md",
    round:
      "inline-flex h-11 w-11 items-center justify-center rounded-full bg-scrim-strong text-fg-on-media hover:bg-scrim " +
      "focus-visible:focus-ring disabled:invisible",
    modes: "absolute inset-x-0 top-3 flex justify-center",
    mode:
      "rounded-full px-3 py-1 text-xs font-semibold text-fg-on-media/80 aria-pressed:bg-fg-on-media aria-pressed:text-media " +
      "focus-visible:focus-ring",
    timer:
      "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-scrim-strong px-2.5 py-1 font-mono text-xs tabular-nums " +
      "before:h-2 before:w-2 before:rounded-full before:bg-danger before:animate-pulse motion-reduce:before:animate-none",
  },
});

export type CaptureResult = {
  /** The photo (JPEG) or the clip (WebM / MP4, as the browser records). */
  blob: Blob;
  /** `photo` or `video`. */
  kind: "photo" | "video";
  /** An object URL of the blob, to preview it (revoke it when done). */
  url: string;
};

export type MediaCaptureLabels = {
  /** The accessible name of the camera ("Camera"). */
  region: string;
  /** Why the camera is asked for, before the request ("Use your camera to take a photo"). */
  prompt: string;
  /** The button that asks ("Turn on the camera"). */
  start: string;
  /** Permission refused ("Camera access is blocked. Allow it in your browser settings, or choose a file."). */
  denied: string;
  /** No camera, or no access possible here ("No camera is available."). */
  unavailable: string;
  /** The way out: the file picker ("Choose a file"). */
  fallback: string;
  takePhoto: string;
  startRecording: string;
  stopRecording: string;
  switchCamera: string;
  photoMode: string;
  videoMode: string;
};

export const mediaCaptureLabels: MediaCaptureLabels = {
  region: "Camera",
  prompt: "Use your camera to take a photo or record a clip.",
  start: "Turn on the camera",
  denied: "Camera access is blocked. Allow it in your browser settings, or choose a file.",
  unavailable: "No camera is available here.",
  fallback: "Choose a file",
  takePhoto: "Take photo",
  startRecording: "Start recording",
  stopRecording: "Stop recording",
  switchCamera: "Switch camera",
  photoMode: "Photo",
  videoMode: "Video",
};

export type MediaCaptureProps = {
  /** What it captures: `photo` (default), `video`, or `both` (a switch above the preview). */
  mode?: "photo" | "video" | "both";
  /** The camera at first: `user` (front, mirrored, default) or `environment` (back). */
  facing?: "user" | "environment";
  /** Records the microphone with a clip. Default `true`. */
  audio?: boolean;
  /** The longest clip, in seconds: recording stops by itself. */
  maxDuration?: number;
  /** Starts the camera at mount (only when the permission is already granted — never a prompt on load). */
  autoStart?: boolean;
  /** Called with a photo taken or a clip recorded (or a file picked in the fallback). */
  onCapture: (result: CaptureResult) => void;
  /** Called when the camera cannot start (`NotAllowedError`, `NotFoundError`…). */
  onError?: (error: unknown) => void;
  /** The width / height ratio of the preview. Default `"3 / 4"`. */
  aspectRatio?: string;
  /** The words, passed translated; English by default. */
  labels?: Partial<MediaCaptureLabels>;
  /** Classes merged on the root. */
  className?: string;
};

type State = "idle" | "starting" | "live" | "denied" | "unavailable";

const supported = () => typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);
const recorderType = () =>
  typeof MediaRecorder === "undefined" ? undefined : ["video/webm;codecs=vp9,opus", "video/webm", "video/mp4"].find((t) => MediaRecorder.isTypeSupported?.(t));

/** The camera in the page: photo or clip, front or back, with a file-picker way out when the camera cannot start. */
export function MediaCapture({
  mode = "photo",
  facing: initialFacing = "user",
  audio = true,
  maxDuration,
  autoStart,
  onCapture,
  onError,
  aspectRatio = "3 / 4",
  labels: given,
  className,
}: MediaCaptureProps) {
  const labels = { ...mediaCaptureLabels, ...given };
  const s = mediaCapture();
  const reduce = usePrefersReducedMotion();
  const video = React.useRef<HTMLVideoElement>(null);
  const stream = React.useRef<MediaStream | null>(null);
  const recorder = React.useRef<MediaRecorder | null>(null);
  const file = React.useRef<HTMLInputElement>(null);
  const [state, setState] = React.useState<State>("idle");
  const [facing, setFacing] = React.useState(initialFacing);
  const [kind, setKind] = React.useState<"photo" | "video">(mode === "video" ? "video" : "photo");
  const [recording, setRecording] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [cameras, setCameras] = React.useState(0);

  const stop = React.useCallback(() => {
    if (recorder.current?.state === "recording") recorder.current.stop();
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
  }, []);

  const start = React.useCallback(
    async (side: "user" | "environment") => {
      if (!supported()) {
        setState("unavailable");
        return;
      }
      setState("starting");
      stop();
      try {
        const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: side }, audio: mode !== "photo" && audio });
        stream.current = media;
        if (video.current) {
          video.current.srcObject = media;
          playSafely(video.current);
        }
        const devices = await navigator.mediaDevices.enumerateDevices?.().catch(() => []);
        setCameras((devices ?? []).filter((d) => d.kind === "videoinput").length);
        setState("live");
      } catch (error) {
        const name = (error as { name?: string })?.name;
        setState(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "unavailable");
        onError?.(error);
      }
    },
    [audio, mode, onError, stop],
  );

  React.useEffect(() => {
    if (!autoStart || !supported() || !navigator.permissions?.query) return;
    let live = true;
    navigator.permissions
      .query({ name: "camera" as PermissionName })
      .then((status) => {
        if (live && status.state === "granted") void start(initialFacing);
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [autoStart, initialFacing, start]);

  React.useEffect(() => {
    const hide = () => {
      if (!document.hidden) return;
      stop();
      setState((current) => (current === "live" ? "idle" : current));
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      document.removeEventListener("visibilitychange", hide);
      stop();
    };
  }, [stop]);

  React.useEffect(() => {
    if (!recording) return;
    const began = Date.now();
    const timer = setInterval(() => {
      const seconds = (Date.now() - began) / 1000;
      setElapsed(seconds);
      if (maxDuration && seconds >= maxDuration) recorder.current?.stop();
    }, 250);
    return () => clearInterval(timer);
  }, [recording, maxDuration]);

  const deliver = (blob: Blob, captured: "photo" | "video") => onCapture({ blob, kind: captured, url: URL.createObjectURL(blob) });

  const takePhoto = () => {
    const element = video.current;
    if (!element?.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = element.videoWidth;
    canvas.height = element.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return;
    if (facing === "user") {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }
    context.drawImage(element, 0, 0);
    canvas.toBlob((blob) => blob && deliver(blob, "photo"), "image/jpeg", 0.92);
  };

  const toggleRecording = () => {
    if (recording) {
      recorder.current?.stop();
      return;
    }
    if (!stream.current) return;
    const chunks: Blob[] = [];
    const type = recorderType();
    const next = new MediaRecorder(stream.current, type ? { mimeType: type } : undefined);
    next.ondataavailable = (event) => event.data.size && chunks.push(event.data);
    next.onstop = () => {
      setRecording(false);
      setElapsed(0);
      deliver(new Blob(chunks, { type: next.mimeType || type || "video/webm" }), "video");
    };
    recorder.current = next;
    next.start(1000);
    setRecording(true);
  };

  const flip = () => {
    const side = facing === "user" ? "environment" : "user";
    setFacing(side);
    void start(side);
  };

  const accept = mode === "video" ? "video/*" : mode === "photo" ? "image/*" : "image/*,video/*";
  const fallback = (
    <>
      <button type="button" className={s.secondary()} onClick={() => file.current?.click()}>
        {labels.fallback}
      </button>
      <input
        ref={file}
        type="file"
        accept={accept}
        capture={facing}
        tabIndex={-1}
        aria-hidden
        className="sr-only"
        onChange={(event) => {
          const picked = event.target.files?.[0];
          if (picked) deliver(picked, picked.type.startsWith("video/") ? "video" : "photo");
          event.target.value = "";
        }}
      />
    </>
  );

  return (
    <section aria-label={labels.region} className={s.root({ className })}>
      <div className={s.stage()} style={{ aspectRatio }}>
        <video ref={video} muted playsInline aria-hidden data-mirrored={facing === "user" ? "" : undefined} className={s.video()} hidden={state !== "live"} />
        {state !== "live" && (
          <div className={s.panel()} role={state === "denied" || state === "unavailable" ? "alert" : undefined}>
            <span className={s.panelIcon()} aria-hidden>
              <CameraGlyph className="h-6 w-6" />
            </span>
            <p className="max-w-xs">{state === "denied" ? labels.denied : state === "unavailable" ? labels.unavailable : labels.prompt}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {(state === "idle" || state === "starting") && (
                <button type="button" className={s.primary()} disabled={state === "starting"} onClick={() => void start(facing)}>
                  <CameraGlyph className="h-4 w-4" />
                  {labels.start}
                </button>
              )}
              {fallback}
            </div>
          </div>
        )}
        {state === "live" && mode === "both" && !recording && (
          <div className={s.modes()}>
            <div className="flex gap-1 rounded-full bg-scrim-strong p-1">
              <button type="button" aria-pressed={kind === "photo"} className={s.mode()} onClick={() => setKind("photo")}>
                {labels.photoMode}
              </button>
              <button type="button" aria-pressed={kind === "video"} className={s.mode()} onClick={() => setKind("video")}>
                {labels.videoMode}
              </button>
            </div>
          </div>
        )}
        {recording && (
          <span className={s.timer()} role="timer" aria-live="off">
            {formatClock(elapsed)}
            {maxDuration ? ` / ${formatClock(maxDuration)}` : ""}
          </span>
        )}
        {state === "live" && (
          <div className={s.bar()}>
            <span className="h-11 w-11" />
            <button
              type="button"
              className={s.shutter()}
              data-mode={kind}
              data-recording={recording ? "" : undefined}
              data-reduce={reduce ? "" : undefined}
              aria-label={kind === "photo" ? labels.takePhoto : recording ? labels.stopRecording : labels.startRecording}
              onClick={kind === "photo" ? takePhoto : toggleRecording}
            />
            <button type="button" className={s.round()} aria-label={labels.switchCamera} disabled={cameras < 2 || recording} onClick={flip}>
              <FlipGlyph className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
