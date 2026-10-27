// Client (inline editing, the avatar popover). The head of an entity — a collection, a shop, a studio: its picture, its
// name and description edited where they are read, its tags. Plain data in (the shapes of `@krizaka/organize/contract`),
// a refusal `code` out, mapped to the message the product passes.
import { AvatarPicker } from "@krizaka/ui/account-settings";
import { Avatar } from "@krizaka/ui/avatar";
import { TagChip, TagMarker } from "@krizaka/ui/chip";
import { cn } from "@krizaka/ui/cn";
import { Popover } from "@krizaka/ui/popover";
import * as React from "react";

import { PencilGlyph } from "../glyphs";
import { type EditableBase, editName, type EntityAvatarOption, type EntityHeaderBase, type EntityRefusals, type EntityTag, useEditable, useRefusal } from "./shared";

export type { EntityRefusals, EntityTag };

export type EntityHeaderProps = EntityHeaderBase & {
  /** Makes the picture changeable: a button over it opens the library's `AvatarPicker`. */
  avatarPicker?: {
    /** The picker's accessible name (“Profile picture”), passed translated. */
    label: string;
    /** What the pictures are of: `folder`, `organisation`, `shop`, `person`. */
    kind?: EntityAvatarOption["kind"];
    /** The pictures to choose from. */
    options: readonly EntityAvatarOption[];
    /** Adds a « no picture » tile first, with these words, passed translated. */
    noneLabel?: string;
    /** The chosen id. */
    value?: string;
    /** The viewer chooses another picture. */
    onValueChange?: (id: string) => void;
    /** The accessible name of the picture's button (“Change the picture”), passed translated. */
    triggerLabel: string;
  };
  /** The accessible name of the tags' list (“Tags”), passed translated. */
  tagsLabel?: string;
  /** Lets the viewer remove a tag: each `TagChip` gets a remove button. Without it the tags are read-only labels. */
  onTagRemove?: (id: string) => void;
  /** The remove button's accessible name for a tag (“Remove Seasonal”), passed translated. */
  tagRemoveLabel?: (label: string) => string;
  /** Classes merged last, on the header. */
  className?: string;
};

type EditableProps = EditableBase & { className: string; inputClassName: string; multiline?: boolean };

/** Text that reads as text and edits in place: Enter saves, Escape gives it back, leaving the field saves. */
function Editable({ value, label, placeholder, onCommit, onRefusal, className, inputClassName, required, multiline }: EditableProps) {
  const { editing, draft, setDraft, pending, open, stop, commit } = useEditable(value, onCommit, onRefusal, required);
  const input = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  React.useEffect(() => {
    if (editing) input.current?.focus();
  }, [editing, pending]);
  if (!onCommit) return value ? <p className={className}>{value}</p> : null;

  if (!editing) {
    return (
      <button
        type="button"
        aria-label={editName(value, placeholder, label)}
        onClick={open}
        className={cn(className, "group/edit -mx-1 inline-flex max-w-full items-center gap-2 rounded-md px-1 text-start hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring")}
      >
        <span className={cn("min-w-0 truncate", !value && "text-fg-muted")}>{value || placeholder}</span>
        <PencilGlyph aria-hidden className="h-3.5 w-3.5 shrink-0 text-fg-muted opacity-0 group-hover/edit:opacity-100 group-focus-visible/edit:opacity-100 [@media(hover:none)]:opacity-100" />
      </button>
    );
  }
  const shared = {
    ref: input as never,
    value: draft,
    "aria-label": label,
    disabled: pending,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(event.target.value),
    onBlur: () => void commit(),
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        stop();
      } else if (event.key === "Enter" && !(multiline && event.shiftKey)) {
        event.preventDefault();
        void commit();
      }
    },
    className: cn(inputClassName, "w-full rounded-md border border-border-control bg-surface-1 px-2 py-1 outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"),
  };
  return multiline ? <textarea rows={2} {...shared} /> : <input type="text" {...shared} />;
}

/** The head of an entity: picture, name and description editable in place, tags, a refusal said in words, actions. */
export function EntityHeader({
  name,
  onNameChange,
  nameLabel = name,
  description,
  onDescriptionChange,
  descriptionLabel = "Description",
  descriptionPlaceholder,
  avatar,
  avatarPicker,
  tags,
  tagsLabel,
  onTagRemove,
  tagRemoveLabel,
  refusal,
  refusals,
  actions,
  className,
}: EntityHeaderProps) {
  const { message, setLocal } = useRefusal(refusal, refusals);
  const picture = <Avatar size="xl" alt="" {...avatar} />;
  const errorId = React.useId();

  return (
    <header className={cn("flex flex-wrap items-start gap-4", className)} data-entity-header>
      {avatarPicker ? (
        <Popover.Root>
          <Popover.Trigger asChild>
            <button type="button" aria-label={avatarPicker.triggerLabel} className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              {picture}
            </button>
          </Popover.Trigger>
          <Popover.Content className="w-80" align="start">
            <AvatarPicker {...avatarPicker} dense />
          </Popover.Content>
        </Popover.Root>
      ) : avatar ? (
        <span className="shrink-0">{picture}</span>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h1 className="m-0 min-w-0 text-xl font-semibold text-fg-title">
          <Editable
            value={name}
            label={nameLabel}
            onCommit={onNameChange}
            onRefusal={setLocal}
            className="text-xl font-semibold text-fg-title"
            inputClassName="text-xl font-semibold text-fg-title"
            required
          />
        </h1>
        {description || onDescriptionChange ? (
          <Editable
            value={description ?? ""}
            label={descriptionLabel}
            placeholder={descriptionPlaceholder}
            onCommit={onDescriptionChange}
            onRefusal={setLocal}
            className="text-sm text-fg-secondary"
            inputClassName="text-sm text-fg-secondary"
            multiline
          />
        ) : null}
        {tags?.length ? (
          <ul aria-label={tagsLabel} className="m-0 mt-1 flex list-none flex-wrap gap-1.5 p-0">
            {tags.map((tag) => (
              <li key={tag.id}>
                {onTagRemove ? (
                  <TagChip marker={tag.marker} removable removeLabel={tagRemoveLabel?.(tag.label) ?? tag.label} onRemove={() => onTagRemove(tag.id)}>
                    {tag.label}
                  </TagChip>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border-default px-2.5 py-0.5 text-xs text-fg">
                    <TagMarker marker={tag.marker} />
                    {tag.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : null}
        {message ? (
          <p id={errorId} role="alert" className="m-0 text-sm text-danger-text">
            {message}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}
