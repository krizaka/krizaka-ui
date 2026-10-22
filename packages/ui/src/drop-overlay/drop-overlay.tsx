// Client (window listeners). The whole window is the drop target: while files are dragged over the page a full-window overlay
// says so, and the dropped files go to `onFiles` (accepted, rejected). No dashed box in the page; the product keeps a real
// file input behind its primary action for the keyboard and for phones. Motion: motion.css (« DROP OVERLAY »).
import * as React from "react";

import { cn } from "../cn";
import { type AcceptRule, dragHasFiles, splitDropped } from "./files";

export type DropOverlayProps = Omit<React.ComponentProps<"div">, "children" | "onDrop"> & {
  /** What the overlay says (“Drop to check”) — passed translated. */
  label: string;
  /** One line under it (“PDF or text”). */
  hint?: string;
  /** The files dropped: the accepted ones, then the ones `accept` refused. */
  onFiles: (accepted: File[], rejected: File[]) => void;
  /** What is accepted: MIME types, families (`image/*`) or extensions (`.pdf`). */
  accept?: readonly AcceptRule[];
  /** Turns the window back into a plain page (while a modal is open, signed out). */
  disabled?: boolean;
};

/** Drag a file anywhere on the page: a full-window overlay accepts it. */
export function DropOverlay({ label, hint, onFiles, accept, disabled, className, ...props }: DropOverlayProps) {
  const [active, setActive] = React.useState(false);
  const depth = React.useRef(0);
  const latest = React.useRef({ onFiles, accept });
  React.useEffect(() => {
    latest.current = { onFiles, accept };
  });

  React.useEffect(() => {
    if (disabled) return;
    const reset = () => {
      depth.current = 0;
      setActive(false);
    };
    const carrying = (event: Event) => dragHasFiles((event as DragEvent).dataTransfer);
    const enter = (event: Event) => {
      if (!carrying(event)) return;
      depth.current += 1;
      setActive(true);
    };
    const over = (event: Event) => {
      if (carrying(event)) event.preventDefault();
    };
    const leave = (event: Event) => {
      if (!carrying(event)) return;
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) setActive(false);
    };
    const drop = (event: Event) => {
      if (!carrying(event)) return;
      event.preventDefault();
      const files = Array.from((event as DragEvent).dataTransfer?.files ?? []);
      reset();
      const { accepted, rejected } = splitDropped(files, latest.current.accept);
      latest.current.onFiles(accepted, rejected);
    };
    window.addEventListener("dragenter", enter);
    window.addEventListener("dragover", over);
    window.addEventListener("dragleave", leave);
    window.addEventListener("drop", drop);
    return () => {
      window.removeEventListener("dragenter", enter);
      window.removeEventListener("dragover", over);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("drop", drop);
      reset();
    };
  }, [disabled]);

  if (!active) return null;
  return (
    <div role="status" data-state="open" className={cn("kz-drop-overlay", className)} {...props}>
      <div className="kz-drop-overlay-card">
        <span className="text-lg font-semibold text-fg">{label}</span>
        {hint ? <span className="text-sm text-fg-secondary">{hint}</span> : null}
      </div>
    </div>
  );
}
