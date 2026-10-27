// What the web and the native EntityHeader share: plain data, the refusal vocabulary, the code of a thrown refusal.
// No component and no web import, so the native bundle never reaches the web files.
import type { Marker, OrganizeCode } from "@krizaka/organize/contract";
import * as React from "react";

import type { DefaultAvatar } from "../avatar/default-avatar";

/** The refusals a header knows how to say: the product passes the words (translated) for the codes it can get. */
export type EntityRefusals = Partial<Record<OrganizeCode, string>>;

/** The entity's picture: an address, or one of Krizaka's default pictures. */
export type EntityAvatar = { src?: string | null; defaultAvatar?: DefaultAvatar; fallback?: React.ReactNode };

export type EntityTag = { id: string; label: string; marker: Marker };

/** The refusal `code` carried by a thrown error (an `OrganizeError`, or any error with a string `code`). */
export function refusalCode(error: unknown): OrganizeCode | undefined {
  const code = typeof error === "object" && error !== null ? (error as { code?: unknown }).code : undefined;
  return typeof code === "string" ? (code as OrganizeCode) : undefined;
}

/** The props both platforms take: plain data, the editing callbacks, the refusals. */
export type EntityHeaderBase = {
  /** The entity's name. */
  name: string;
  /** Makes the name editable in place: called with the trimmed new name. Throw (or reject with) an error carrying a `code` to show its refusal. */
  onNameChange?: (name: string) => void | Promise<void>;
  /** What editing the name does (“Rename the collection”), passed translated: the field's name, and the button's after the visible name. */
  nameLabel?: string;
  /** One line under the name. */
  description?: string;
  /** Makes the description editable in place. Same contract as `onNameChange`. */
  onDescriptionChange?: (description: string) => void | Promise<void>;
  /** What editing the description does (“Edit the description”), passed translated: the field's name, and the button's after the visible text. */
  descriptionLabel?: string;
  /** Shown when there is no description and it is editable (“Add a description”), passed translated. */
  descriptionPlaceholder?: string;
  /** The picture. */
  avatar?: EntityAvatar;
  /** The entity's tags. */
  tags?: readonly EntityTag[];
  /** A refusal to say now (the last answer of the server), by its code. */
  refusal?: { code: OrganizeCode } | null;
  /** The messages by refusal code: `NAME_TAKEN`, `AVATAR_NOT_ALLOWED`, `DEFAULT_COLLECTION`, … A code with no message says nothing. */
  refusals?: EntityRefusals;
  /** After the text: the actions of the entity (a menu, a button). */
  actions?: React.ReactNode;
};

/** The text a button label reads: the visible text first, then what the button does (the accessible name contains the visible text). */
export const editName = (visible: string, placeholder: string | undefined, label: string) => `${visible || placeholder || ""} (${label})`.trim();

/**
 * The state of a field edited in place: Enter or blur saves (a trimmed text, never an empty one when `required`),
 * Escape gives the text back, a thrown refusal keeps the field open and is reported by its code.
 */
export function useEditable(value: string, onCommit: ((value: string) => void | Promise<void>) | undefined, onRefusal: (code: OrganizeCode | undefined) => void, required?: boolean) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const [pending, setPending] = React.useState(false);
  const open = () => {
    setDraft(value);
    setEditing(true);
  };
  const stop = () => {
    setEditing(false);
    setDraft(value);
  };
  const commit = async () => {
    if (pending) return;
    const next = draft.trim();
    if (!onCommit || next === value || (required && next === "")) return stop();
    setPending(true);
    try {
      await onCommit(next);
      onRefusal(undefined);
      setEditing(false);
    } catch (error) {
      onRefusal(refusalCode(error));
    } finally {
      setPending(false);
    }
  };
  return { editing, draft, setDraft, pending, open, stop, commit };
}

/** The refusal to say: the one a save just raised, else the one the page passes, in the product's words (none when it has none). */
export function useRefusal(refusal: EntityHeaderBase["refusal"], refusals: EntityRefusals | undefined) {
  const [local, setLocal] = React.useState<OrganizeCode | undefined>();
  const code = local ?? refusal?.code;
  return { message: code ? refusals?.[code] : undefined, setLocal };
}

/** The props of a field edited in place, on both platforms. */
export type EditableBase = {
  value: string;
  label: string;
  placeholder?: string;
  onCommit?: (value: string) => void | Promise<void>;
  onRefusal: (code: OrganizeCode | undefined) => void;
  required?: boolean;
};
