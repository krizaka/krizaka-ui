// Client (a radio group). The pictures of a person to choose from — the family's default avatars, a few photos — as a grid of
// round tiles: one named radiogroup, one tab stop, the arrows choose, a ring and a check on the chosen one.
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import * as React from "react";

import { type DefaultAvatar, defaultAvatarUrl } from "../avatar/default-avatar";
import { cn } from "../cn";
import { CheckGlyph } from "../glyphs";
import { GroupHead } from "./group-head";

export interface AvatarOption {
  /** The value of the choice. */
  id: string;
  /** Its name for assistive technology (“Teinte 3”) — passed translated. */
  label: string;
  /** A picture's address; otherwise `defaultAvatar` draws one of the family's pictures. */
  src?: string;
  /** One of Krizaka's default pictures (`{ brand, tone }`). */
  defaultAvatar?: DefaultAvatar;
}

export type AvatarPickerProps = Omit<React.ComponentProps<typeof RadioGroupPrimitive.Root>, "children" | "onChange" | "dir"> & {
  /** The group's accessible name (“Profile picture”) — passed translated. */
  label: string;
  /** Shows the label above the grid, with `description` under it. */
  showLabel?: boolean;
  /** One line under the visible label: what it changes. */
  description?: React.ReactNode;
  /** The pictures. */
  options: readonly AvatarOption[];
  /** The chosen id (controlled). */
  value?: string;
  /** The viewer chooses another picture. */
  onValueChange?: (id: string) => void;
  /** After the pictures, in the grid: the upload action (a `Button`, a file input's label). Not a radio. */
  upload?: React.ReactNode;
};

const pictureOf = (option: AvatarOption) => option.src ?? (option.defaultAvatar ? defaultAvatarUrl(option.defaultAvatar, { size: 256 }) : undefined);

/** A grid of pictures to choose from, with an upload beside them: a radio group, never a row of loose radios. */
export function AvatarPicker({ label, showLabel, description, options, upload, className, ...props }: AvatarPickerProps) {
  const id = React.useId();
  const group = (
    <RadioGroupPrimitive.Root aria-label={label} aria-labelledby={showLabel ? id : undefined} className={cn("grid grid-cols-[repeat(auto-fill,minmax(4.25rem,1fr))] gap-3", !showLabel && className)} {...props}>
      {options.map((option) => (
        <RadioGroupPrimitive.Item
          key={option.id}
          value={option.id}
          aria-label={option.label}
          className={cn(
            "group/avatar relative aspect-square w-full rounded-full outline-none transition-shadow duration-200 motion-reduce:transition-none",
            "ring-1 ring-border-default hover:ring-border-strong focus-visible:focus-ring data-[state=checked]:ring-2 data-[state=checked]:ring-accent",
          )}
        >
          <img src={pictureOf(option)} alt="" draggable={false} className="h-full w-full rounded-full bg-surface-3 object-cover" />
          <span
            aria-hidden
            className="absolute -bottom-0.5 -right-0.5 hidden h-5 w-5 items-center justify-center rounded-full border-2 border-surface-1 bg-accent text-on-accent group-data-[state=checked]/avatar:inline-flex"
          >
            <CheckGlyph className="h-3 w-3" />
          </span>
        </RadioGroupPrimitive.Item>
      ))}
      {upload ? <div className="flex aspect-square w-full items-center justify-center">{upload}</div> : null}
    </RadioGroupPrimitive.Root>
  );
  if (!showLabel) return group;
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <GroupHead id={id} label={label} description={description} />
      {group}
    </div>
  );
}
