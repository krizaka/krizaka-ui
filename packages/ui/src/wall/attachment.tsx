import type { CSSProperties } from "react";

import { cn } from "../cn";

export interface WallObjectProps {
  /** Tilt in degrees, deterministic; defaults to zero. */
  rotation?: number;
  /** A tape strip or a pin; defaults to tape. */
  attachment?: "tape" | "pin";
  /** The tape or pin's tilt in degrees; defaults to zero. */
  attachmentRotation?: number;
}

export const finite = (value: number) => Number.isFinite(value) ? value : 0;
export const rotationStyle = (rotation: number): CSSProperties =>
  ({ "--kz-wall-rotation": `${finite(rotation)}deg` }) as CSSProperties;

export function Attachment({ attachment = "tape", attachmentRotation = 0 }: WallObjectProps) {
  return <span aria-hidden="true" className={cn("kz-wall-attachment", attachment === "pin" ? "kz-wall-pin" : "kz-wall-tape")} style={{ transform: `rotate(${finite(attachmentRotation)}deg)` }} />;
}
