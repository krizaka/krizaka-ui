// Server-safe. Who the account is, at a glance: the picture with its change action, the name, the e-mail and whether it is
// verified, since when. The head of a profile section.
import type * as React from "react";

import { Avatar, type AvatarProps } from "../avatar/avatar";
import { Badge } from "../badge/badge";
import { cn } from "../cn";

export type AccountProfileCardProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** The name (the card's heading). */
  name: string;
  /** The e-mail address. */
  email: string;
  /** Whether the address is verified. */
  verified: boolean;
  /** “Verified” — passed translated. */
  verifiedLabel: string;
  /** “Not verified” — passed translated. */
  unverifiedLabel: string;
  /** “Member since October 2026” — formatted by the app, in the viewer's language. */
  memberSince?: string;
  /** The picture: the person's photo, or the default avatar of the brand. */
  avatar?: Pick<AvatarProps, "src" | "defaultAvatar" | "fallback">;
  /** Beside the picture: the change action (a `Button`). */
  action?: React.ReactNode;
  /**
   * One calm line for a settings row: a medium picture beside the name and the e-mail, no wrapping.
   * @default false
   */
  compact?: boolean;
};

/** The account's identity card: picture, name, verified e-mail, member since. */
export function AccountProfileCard({ name, email, verified, verifiedLabel, unverifiedLabel, memberSince, avatar, action, compact, className, ...props }: AccountProfileCardProps) {
  return (
    <section aria-label={name} className={cn("flex items-center gap-3", !compact && "flex-col items-start gap-4 sm:flex-row sm:gap-5", className)} {...props}>
      <div className="flex shrink-0 flex-col items-center gap-2">
        <Avatar size={compact ? "md" : "xl"} alt="" fallback={name.slice(0, 1)} {...avatar} />
        {action}
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <h2 className={cn("m-0 truncate font-bold text-fg", compact ? "text-sm font-medium" : "text-lg")}>{name}</h2>
        <p className="m-0 flex flex-wrap items-center gap-2 text-sm text-fg-secondary">
          <span className="min-w-0 truncate">{email}</span>
          <Badge tone={verified ? "success" : "warning"} dot>
            {verified ? verifiedLabel : unverifiedLabel}
          </Badge>
        </p>
        {memberSince ? <p className="text-sm text-fg-secondary">{memberSince}</p> : null}
      </div>
    </section>
  );
}
