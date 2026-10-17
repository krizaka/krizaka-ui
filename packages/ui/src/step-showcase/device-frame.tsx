// Server-safe. The frame a product's recording plays in: a phone, a browser window or a macOS window — drawn with the
// tokens (no image), so it follows dark and light. The content fills the screen area (`object-cover` media).
import * as React from "react";

import { cn } from "../cn";

export type DeviceKind = "phone" | "browser" | "desktop";

export interface DeviceFrameProps extends React.ComponentProps<"div"> {
  /** The device: a phone, a browser window or a macOS window. */
  kind: DeviceKind;
  /** The browser's address or the window's title (“dev.orazaka.com”, “Orazaka”). */
  title?: string;
}

const screen: Record<DeviceKind, string> = {
  phone: "aspect-[9/19.5]",
  browser: "aspect-[16/10]",
  desktop: "aspect-[16/10]",
};

/** A phone, a browser window or a macOS window around a screen of content. */
export function DeviceFrame({ kind, title, className, children, ...props }: DeviceFrameProps) {
  if (kind === "phone") {
    return (
      <div data-device="phone" className={cn("relative mx-auto w-full max-w-[18rem] rounded-[2.4rem] border border-border-strong bg-surface-3 p-2 shadow-2xl", className)} {...props}>
        <div className={cn("relative overflow-hidden rounded-[1.9rem] bg-surface-0", screen.phone)}>
          {children}
          <span aria-hidden className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-surface-3" />
        </div>
      </div>
    );
  }
  return (
    <div data-device={kind} className={cn("relative w-full overflow-hidden rounded-xl border border-border-default bg-surface-1 shadow-2xl", className)} {...props}>
      <div className="flex h-8 items-center gap-1.5 border-b border-border-subtle bg-surface-2 px-3">
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-danger/80" />
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-warning/80" />
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-success/80" />
        {title &&
          (kind === "browser" ? (
            <span className="mx-auto max-w-[60%] truncate rounded-md bg-surface-1 px-3 py-0.5 font-mono text-[11px] text-fg-secondary">{title}</span>
          ) : (
            <span className="mx-auto truncate text-xs font-semibold text-fg-secondary">{title}</span>
          ))}
      </div>
      <div className={cn("relative overflow-hidden bg-surface-0", screen[kind])}>{children}</div>
    </div>
  );
}
