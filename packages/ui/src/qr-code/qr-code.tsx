// Client (the copy action). A QR code drawn from a text, offline: an SVG of dark modules on a light tile, whatever the
// theme (a phone reads dark on light), with its quiet zone. No call to any service; the text never leaves the page.
import * as React from "react";

import { Button } from "../button/button";
import { cn } from "../cn";
import { CheckGlyph, CopyGlyph } from "../glyphs";
import { encodeQr, type QrLevel, qrPath } from "./encode";

// The tile and the modules are the same in dark and light on purpose: a scanner needs dark modules on a light ground.
export const QR_TILE = "#ffffff";
export const QR_MODULE = "#0b0f19";

export type QrCodeProps = {
  /** The text to encode — an address, a feed URL. Encoded here, in the browser (or on the server); never sent anywhere. */
  value: string;
  /** What the code is, for a screen reader (“Calendar feed — scan with your phone”), passed translated. The image is named by it. */
  label: string;
  /** The side of the tile, in px, quiet zone included. Default 176. */
  size?: number;
  /** The quiet zone, in modules, around the code (the standard asks for 4). Default 4, never less than 2. */
  quietZone?: number;
  /** The error-correction level: L · M (default) · Q · H (a logo or wear on the print). */
  level?: QrLevel;
  /** The words of the copy action, passed translated. Without them there is no « copy » button. */
  copyLabel?: string;
  /** Said once the text is on the clipboard. Default: the copy label. */
  copiedLabel?: string;
  /** Called after the text is copied. */
  onCopy?: () => void;
  /** Classes merged last, on the wrapper. */
  className?: string;
};

/** A QR code from a text: dark modules on a light tile in both themes, a quiet zone, an accessible name, an optional copy action. */
export function QrCode({ value, label, size = 176, quietZone = 4, level = "M", copyLabel, copiedLabel, onCopy, className }: QrCodeProps) {
  const quiet = Math.max(2, Math.round(quietZone));
  const { matrix, path } = React.useMemo(() => {
    const m = encodeQr(value, level);
    return { matrix: m, path: qrPath(m, quiet) };
  }, [value, level, quiet]);
  const modules = matrix.length + quiet * 2;
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);
  const copy = () =>
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      onCopy?.();
    });

  return (
    <div className={cn("inline-flex flex-col items-start gap-3", className)} data-qr-code>
      <svg
        role="img"
        aria-label={label}
        viewBox={`0 0 ${modules} ${modules}`}
        width={size}
        height={size}
        shapeRendering="crispEdges"
        className="block max-w-full rounded-lg border border-border-default"
        style={{ height: "auto", aspectRatio: "1 / 1" }}
      >
        <rect width={modules} height={modules} fill={QR_TILE} />
        <path d={path} fill={QR_MODULE} />
      </svg>
      {copyLabel ? (
        <Button type="button" variant="secondary" size="sm" onClick={copy} announce={copied ? (copiedLabel ?? copyLabel) : undefined}>
          {copied ? <CheckGlyph className="h-3.5 w-3.5" /> : <CopyGlyph className="h-3.5 w-3.5" />}
          {copied ? (copiedLabel ?? copyLabel) : copyLabel}
        </Button>
      ) : null}
    </div>
  );
}
