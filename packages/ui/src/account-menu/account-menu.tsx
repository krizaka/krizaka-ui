// Client (a portal). The signed-in person's menu under their avatar — who you are first (picture, name, e-mail), then
// the places (profile, settings), the language as a compact submenu, the extras, and Sign out (a quiet item, not a
// red alert). Built on DropdownMenu, so the keyboard, the focus return and the collisions are Radix's.
import * as React from "react";

import { Avatar, type AvatarProps } from "../avatar/avatar";
import { cn } from "../cn";
import { DropdownMenu } from "../dropdown-menu/dropdown-menu";

export interface AccountMenuLink {
  id: string;
  label: string;
  href: string;
  /** A signature icon. */
  icon?: React.ReactNode;
}

export interface AccountMenuLanguage {
  /** The row's words (`Language`). */
  label: string;
  /** The current value (`en`). */
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}

export interface AccountMenuProps {
  /** The trigger's accessible name (`Account`). */
  label: string;
  /** Their name; falls back to the e-mail. */
  name?: string;
  /** Their e-mail, shown under the name. */
  email?: string;
  /** The picture: `src`, or `defaultAvatar` (`{ brand, seed }`) for the product's default person. */
  avatar?: Omit<AvatarProps, "size">;
  /** Show the name beside the avatar in the trigger from the `sm` breakpoint. */
  showName?: boolean;
  /** Where to go: profile, settings… */
  links?: readonly AccountMenuLink[];
  /** The app's link component (Next's `Link`); an `<a>` otherwise. */
  linkAs?: React.ElementType;
  /** The language, as a submenu that shows the current one. */
  language?: AccountMenuLanguage;
  /** Extra rows between the language and Sign out (a theme switch…). */
  children?: React.ReactNode;
  /** The last row: its words, what it does, an optional icon. */
  signOut: { label: string; onSelect: () => void; icon?: React.ReactNode };
  /** Classes for the trigger. */
  className?: string;
}

/** The account menu: avatar trigger → identity header, links, language submenu, Sign out. */
export function AccountMenu({ label, name, email, avatar, showName = true, links = [], linkAs: Link = "a", language, children, signOut, className }: AccountMenuProps) {
  const title = name || email || "";
  const current = language?.options.find((o) => o.value === language.value)?.label;
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label={label}
        className={cn("flex items-center gap-2.5 rounded-lg p-1 transition-colors duration-150 hover:bg-surface-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring", className)}
      >
        <Avatar size="sm" fallback={title.charAt(0).toUpperCase() || "?"} {...avatar} />
        {showName && title && <span className="hidden max-w-40 truncate text-sm font-medium text-fg-secondary sm:inline-block">{title}</span>}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-64">
        <DropdownMenu.Label className="flex items-center gap-3 py-2 normal-case tracking-normal">
          <Avatar size="md" fallback={title.charAt(0).toUpperCase() || "?"} {...avatar} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-fg">{title}</span>
            {name && email && <span className="block truncate text-xs font-normal text-fg-secondary">{email}</span>}
          </span>
        </DropdownMenu.Label>
        {links.length > 0 && <DropdownMenu.Separator />}
        {links.map((link) => (
          <DropdownMenu.Item key={link.id} asChild>
            <Link href={link.href}>
              {link.icon}
              {link.label}
            </Link>
          </DropdownMenu.Item>
        ))}
        {(language || children) && <DropdownMenu.Separator />}
        {language && (
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              {language.label}
              {current && <span className="ml-auto mr-1 text-xs text-fg-secondary">{current}</span>}
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.RadioGroup value={language.value} onValueChange={language.onChange}>
                {language.options.map((o) => (
                  <DropdownMenu.RadioItem key={o.value} value={o.value}>
                    {o.label}
                  </DropdownMenu.RadioItem>
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        )}
        {children}
        <DropdownMenu.Separator />
        <DropdownMenu.Item onSelect={() => signOut.onSelect()}>
          {signOut.icon}
          {signOut.label}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
