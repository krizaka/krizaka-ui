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

/** The theme row: the same shape as the language's (a submenu that shows the current choice). */
export type AccountMenuTheme = AccountMenuLanguage;

export interface AccountMenuProps {
  /** The trigger's accessible name (`Account`). */
  label: string;
  /** Their name; falls back to the e-mail. */
  name?: string;
  /** Their e-mail, shown under the name. */
  email?: string;
  /** The picture: `src`, or `defaultAvatar` (`{ brand, seed }`) for the product's default person. */
  avatar?: Omit<AvatarProps, "size">;
  /**
   * Show the name beside the avatar in the trigger: `true` or `"sm"` from 640 px, `"lg"` from 1024 px (the family's top
   * bar, where search and the counts take the room below it), `false` never.
   * @default true
   */
  showName?: boolean | "sm" | "lg";
  /** Where to go: profile, settings… */
  links?: readonly AccountMenuLink[];
  /** The app's link component (Next's `Link`); an `<a>` otherwise. */
  linkAs?: React.ElementType;
  /** The language, as a submenu that shows the current one. */
  language?: AccountMenuLanguage;
  /** The theme (light, dark, system), as a submenu under the language: the family keeps preferences in the account menu. */
  theme?: AccountMenuTheme;
  /** Extra rows between the preferences and Sign out. */
  children?: React.ReactNode;
  /** The last row: its words, what it does, an optional icon. */
  signOut: { label: string; onSelect: () => void; icon?: React.ReactNode };
  /** Classes for the trigger. */
  className?: string;
}

/** The account menu: avatar trigger → identity header, links, language submenu, Sign out. */
export function AccountMenu({ label, name, email, avatar, showName = true, links = [], linkAs: Link = "a", language, theme, children, signOut, className }: AccountMenuProps) {
  const title = name || email || "";
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label={label}
        className={cn("flex items-center gap-2.5 rounded-lg p-1 transition-colors duration-150 hover:bg-surface-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring", className)}
      >
        <Avatar size="sm" fallback={title.charAt(0).toUpperCase() || "?"} {...avatar} />
        {/* Drawn by CSS: the name is not text of the button, so its accessible name stays `label` with no label-content-name-mismatch. */}
        {showName && title && (
          <span
            aria-hidden
            data-name={title}
            className={cn("hidden max-w-40 truncate text-sm font-medium text-fg-secondary after:content-[attr(data-name)]", showName === "lg" ? "lg:inline-block" : "sm:inline-block")}
          />
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-64">
        <DropdownMenu.Label className="flex items-center gap-3 py-2 normal-case tracking-normal">
          <Avatar size="md" fallback={title.charAt(0).toUpperCase() || "?"} {...avatar} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-fg">{title}</span>
            {name && email && name !== email && <span className="block truncate text-xs font-normal text-fg-secondary">{email}</span>}
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
        {(language || theme || children) && <DropdownMenu.Separator />}
        {language && <Choice {...language} />}
        {theme && <Choice {...theme} />}
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

/** A preference as a submenu that names the current choice. */
function Choice({ label, value, options, onChange }: AccountMenuLanguage) {
  const current = options.find((o) => o.value === value)?.label;
  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger>
        {label}
        {current && <span className="ml-auto mr-1 text-xs text-fg-secondary">{current}</span>}
      </DropdownMenu.SubTrigger>
      <DropdownMenu.SubContent>
        <DropdownMenu.RadioGroup value={value} onValueChange={onChange}>
          {options.map((o) => (
            <DropdownMenu.RadioItem key={o.value} value={o.value}>
              {o.label}
            </DropdownMenu.RadioItem>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.SubContent>
    </DropdownMenu.Sub>
  );
}
