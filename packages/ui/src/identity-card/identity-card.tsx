// Client (its QR code copies). The identity of a business, a person or an organisation at the top of a sheet: the mark, the name
// and what it is called, chips for its status and its registration number, and a QR code that hands the contact to a phone.
import type * as React from "react";

import { cn } from "../cn";
import { QrCode } from "../qr-code/qr-code";

export interface IdentityCardQr {
  /** The text to encode: a vCard (`vCard(fields)` of `@krizaka/ui/qr-code`), an address. */
  value: string;
  /** What the code is, for a screen reader (“Contact card: scan to add the business to your phone”), passed translated. */
  label: string;
  /** One line under the code (“Scan to add the contact”), passed translated. */
  lead?: React.ReactNode;
  /** The words of the copy action (“Copy the vCard”); without them the code has no copy button. */
  copyLabel?: string;
  copiedLabel?: string;
  /** The side of the tile, in px. @default 132 */
  size?: number;
}

export type IdentityCardProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The mark: a logo, an avatar. Decorative — the name carries the meaning. */
  mark: React.ReactNode;
  /** A small line above the name (“Business card”), passed translated. */
  eyebrow?: React.ReactNode;
  /** The name: the legal name of the business, the person's name. It is the card's heading. */
  name: React.ReactNode;
  /**
   * The level of the name.
   * @default "h2"
   */
  nameAs?: "h1" | "h2" | "h3" | "p";
  /** What it is called day to day, its legal form: “Salon Cèdre & Ciseaux · Incorporated”. */
  subtitle?: React.ReactNode;
  /** Under the subtitle, in a row that wraps: a status chip, the registration number as a mono chip, the city. */
  chips?: React.ReactNode;
  /** A QR code at the end (under the text on a phone): the contact as a phone can read it. */
  qr?: IdentityCardQr;
};

/** The identity of a business or a person: mark, name, subtitle, chips and a contact QR code. Wraps to one column on a phone. */
export function IdentityCard({ mark, eyebrow, name, nameAs: Name = "h2", subtitle, chips, qr, className, ...props }: IdentityCardProps) {
  return (
    <section data-slot="identity-card" className={cn("flex flex-wrap items-center justify-between gap-6 rounded-lg border border-border-default bg-surface-1 p-5 text-fg sm:p-6", className)} {...props}>
      <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">
        <div aria-hidden="true" className="shrink-0">{mark}</div>
        <div className="min-w-0">
          {eyebrow ? <p className="font-mono text-xs text-fg-secondary">{eyebrow}</p> : null}
          <Name className="font-display text-2xl font-bold text-fg sm:text-3xl [overflow-wrap:anywhere]">{name}</Name>
          {subtitle ? <p className="mt-1 text-sm text-fg-secondary">{subtitle}</p> : null}
          {chips ? <div className="mt-4 flex flex-wrap items-center gap-2">{chips}</div> : null}
        </div>
      </div>
      {qr ? (
        <div className="flex flex-col items-center gap-2">
          <QrCode value={qr.value} label={qr.label} size={qr.size ?? 132} copyLabel={qr.copyLabel} copiedLabel={qr.copiedLabel} />
          {qr.lead ? <p className="max-w-[11rem] text-center text-xs text-fg-secondary">{qr.lead}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
