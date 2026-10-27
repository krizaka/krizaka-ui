// Client (a radio group). The pictures of a person to choose from — the family's default avatars, a few photos — as a grid of
// round tiles: one named radiogroup, one tab stop, the arrows choose, a ring and a check on the chosen one.
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import * as React from "react";

import { DEFAULT_AVATAR_TONES,type DefaultAvatar, type DefaultAvatarBrand, type DefaultAvatarEntityKind, defaultAvatarUrl } from "../avatar/default-avatar";
import { cn } from "../cn";
import { Dropzone, type DropzoneProps } from "../file-upload";
import { CheckGlyph } from "../glyphs";
import { GroupHead } from "./group-head";

/** The value of the « no picture » tile (`noneLabel`). */
export const AVATAR_NONE = "none";

export interface AvatarOption {
  /** The value of the choice. */
  id: string;
  /** Its name for assistive technology (“Teinte 3”) — passed translated. */
  label: string;
  /** A picture's address; otherwise `defaultAvatar` draws one of the family's pictures. */
  src?: string;
  /** One of Krizaka's default pictures (`{ brand, tone }`). */
  defaultAvatar?: DefaultAvatar;
  /** What this picture is of; a picker of another `kind` never lists it. Read from `defaultAvatar.kind` when not given (`plain` is a person's). */
  kind?: DefaultAvatarEntityKind;
}

/** What an option is of, when it says: its own `kind`, else its default picture's. */
export function avatarOptionKind(option: AvatarOption): DefaultAvatarEntityKind | undefined {
  const kind = option.kind ?? option.defaultAvatar?.kind;
  return kind === "plain" ? "person" : kind;
}

/** The pictures that fit `kind`: an option of another kind is dropped, so a folder is never offered a person. Options that do not say what they are stay. */
export function optionsOfKind(options: readonly AvatarOption[], kind: DefaultAvatarEntityKind): AvatarOption[] {
  return options.filter((option) => {
    const own = avatarOptionKind(option);
    return own === undefined || own === kind;
  });
}

/** The pictures drawn here for a kind: the brand's six tones, no request. Used when the app passes no `options`. */
export function builtInAvatarOptions(kind: DefaultAvatarEntityKind, brand: DefaultAvatarBrand, label: (tone: number) => string): AvatarOption[] {
  return Array.from({ length: DEFAULT_AVATAR_TONES }, (_, i) => ({ id: `${kind}-${i + 1}`, label: label(i + 1), kind, defaultAvatar: { brand, kind, tone: i + 1 } }));
}

export type AvatarPickerProps = Omit<React.ComponentProps<typeof RadioGroupPrimitive.Root>, "children" | "onChange" | "dir"> & {
  /** The group's accessible name (“Profile picture”) — passed translated. */
  label: string;
  /**
   * Smaller tiles, for a settings row.
   * @default false
   */
  dense?: boolean;
  /** Shows the label above the grid, with `description` under it. */
  showLabel?: boolean;
  /** One line under the visible label: what it changes. */
  description?: React.ReactNode;
  /**
   * What the pictures are of: `person` (default), `folder`, `organisation` or `shop`. Only the options of this kind are listed.
   * @default "person"
   */
  kind?: DefaultAvatarEntityKind;
  /** The pictures — the central set of the kind (`listDefaults(kind)` of `@krizaka/org`) turned into options, with `src`. */
  options: readonly AvatarOption[];
  /** Adds a « no picture » tile first, chosen with the value `AVATAR_NONE`; the words of the tile, passed translated. */
  noneLabel?: string;
  /** The library's upload control under the grid: a `Dropzone` (a real file input), for a picture of one's own. */
  uploadFile?: Pick<DropzoneProps, "title" | "browseLabel" | "hint" | "accept" | "maxSize" | "disabled" | "refusalLabel" | "onReject"> & { onFile: (file: File) => void };
  /** The chosen id (controlled). */
  value?: string;
  /** The viewer chooses another picture. */
  onValueChange?: (id: string) => void;
  /** After the pictures, in the grid: the upload action (a `Button`, a file input's label). Not a radio. */
  upload?: React.ReactNode;
};

const pictureOf = (option: AvatarOption) => option.src ?? (option.defaultAvatar ? defaultAvatarUrl(option.defaultAvatar, { size: 256 }) : undefined);

/** A grid of pictures to choose from, with an upload beside them: a radio group, never a row of loose radios. */
export function AvatarPicker({ label, showLabel, description, dense, kind = "person", options, noneLabel, uploadFile, upload, className, ...props }: AvatarPickerProps) {
  const id = React.useId();
  const listed = optionsOfKind(options, kind);
  const tile = cn(
    "group/avatar relative shrink-0 rounded-full",
    dense ? "h-12 w-12" : "aspect-square w-full",
    "outline-none transition-shadow duration-200 motion-reduce:transition-none",
    "ring-1 ring-border-default hover:ring-border-strong focus-visible:focus-ring data-[state=checked]:ring-2 data-[state=checked]:ring-accent",
  );
  const check = (
    <span
      aria-hidden
      className="absolute -bottom-0.5 -right-0.5 hidden h-5 w-5 items-center justify-center rounded-full border-2 border-surface-1 bg-accent text-on-accent group-data-[state=checked]/avatar:inline-flex"
    >
      <CheckGlyph className="h-3 w-3" />
    </span>
  );
  const group = (
    <RadioGroupPrimitive.Root aria-label={label} aria-labelledby={showLabel ? id : undefined} className={cn(dense ? "flex flex-wrap gap-2.5" : "grid grid-cols-[repeat(auto-fill,minmax(4.25rem,1fr))] gap-3", !showLabel && !uploadFile && className)} {...props}>
      {noneLabel ? (
        <RadioGroupPrimitive.Item value={AVATAR_NONE} aria-label={noneLabel} className={tile}>
          <span aria-hidden className="flex h-full w-full items-center justify-center rounded-full bg-surface-3 text-fg-secondary">
            <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <circle cx="12" cy="12" r="8" />
              <path d="M6.5 17.5l11-11" />
            </svg>
          </span>
          {check}
        </RadioGroupPrimitive.Item>
      ) : null}
      {listed.map((option) => (
        <RadioGroupPrimitive.Item key={option.id} value={option.id} aria-label={option.label} className={tile}>
          <img src={pictureOf(option)} alt="" draggable={false} className="h-full w-full rounded-full bg-surface-3 object-cover" />
          {check}
        </RadioGroupPrimitive.Item>
      ))}
      {upload ? <div className="flex aspect-square w-full items-center justify-center">{upload}</div> : null}
    </RadioGroupPrimitive.Root>
  );
  const withUpload = uploadFile ? (
    <div className={cn("flex flex-col gap-3", !showLabel && className)}>
      {group}
      <Dropzone {...uploadFile} onFiles={(files) => files[0] && uploadFile.onFile(files[0])} />
    </div>
  ) : (
    group
  );
  if (!showLabel) return withUpload;
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <GroupHead id={id} label={label} description={description} />
      {withUpload}
    </div>
  );
}
