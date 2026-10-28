// Client (a menu in a portal). The views of a list, in the bar above it (krizaka-ts#89: `system` — the admin's —, `workspace`
// — shared —, `mine`, in that order): a row of chips with their counts, a « modified » mark on the one that no longer
// matches its filters, « Save view », and rename / delete for the views the person may change. On a phone the same views are
// ONE menu (« View: To decide ▾ »). It holds no filters: the host keeps them in the address (`parseView` / `viewSearch` of
// `@krizaka/organize/contract`, `sameFilters` for `modified`), so a view is a link when `href` is given.
import { DropdownMenu as MenuPrimitive } from "radix-ui";
import * as React from "react";

import type { LinkComponent } from "../block-link";
import { Chip } from "../chip";
import { ChipLink } from "../chip-link";
import { cn } from "../cn";
import { DropdownMenu } from "../dropdown-menu";
import { ChevronGlyph } from "../glyphs";

/** Who the view belongs to: the admin's (`system`), the workspace's (`workspace`, shared) or the person's (`mine`). */
export type ViewGroup = "system" | "workspace" | "mine";
const GROUPS: readonly ViewGroup[] = ["system", "workspace", "mine"];

export type SavedViewItem = {
  /** A saved view's id, or a system view's key. */
  id: string;
  /** Its name, passed translated. */
  label: string;
  group: ViewGroup;
  /** How many results it gives: shown after the name. */
  count?: number;
  /** Where it leads (`/clients?view=to-follow`): the view is then a link, the address being the state. */
  href?: string;
  /** Whether the person may rename and delete it (default: only `mine`). */
  editable?: boolean;
};

export type SavedViewsLabels = {
  /** The bar's accessible name ("Views"). */
  views: string;
  /** The name of each group of views. */
  groups: Record<ViewGroup, string>;
  /** The phone's menu button: `(current) => "View: " + current` (`current` is "All" when none). */
  menu: (current: string) => string;
  /** What the phone's menu button says when no view is chosen ("All"). */
  none: string;
  /** The mark on a view whose filters changed ("modified"). */
  modified: string;
  /** "Save view". */
  save: string;
  /** The name field of a view being saved ("Name of the view"). */
  name: string;
  /** The button that keeps it ("Save"). */
  confirm: string;
  /** "Cancel". */
  cancel: string;
  /** "Rename". */
  rename: string;
  /** "Delete". */
  remove: string;
  /** The button of a view's actions: `(label) => "Actions for the view " + label`. */
  actions: (label: string) => string;
};

export const savedViewsLabels: SavedViewsLabels = {
  views: "Views",
  groups: { system: "Standard views", workspace: "Shared views", mine: "My views" },
  menu: (current) => `View: ${current}`,
  none: "All",
  modified: "modified",
  save: "Save view",
  name: "Name of the view",
  confirm: "Save",
  cancel: "Cancel",
  rename: "Rename",
  remove: "Delete",
  actions: (label) => `Actions for the view ${label}`,
};

export type SavedViewsProps = {
  /** The views, in the order to show them inside each group. */
  views: readonly SavedViewItem[];
  /** The id of the view in force, or null. */
  current: string | null;
  /** The filters in force differ from the view's (`!sameFilters(...)`), or none matches a view: shows the mark and « Save view ». */
  modified?: boolean;
  /** A view was chosen (a button). Not called for a view that has an `href`: the link navigates. */
  onSelect?: (id: string) => void;
  /** « Save view » was confirmed with this name. Without it the button is not shown. */
  onSave?: (name: string) => void;
  /** A view was renamed. Without it the action is not offered. */
  onRename?: (id: string, name: string) => void;
  /** A view was deleted (the host confirms, or offers an undo). Without it the action is not offered. */
  onDelete?: (id: string) => void;
  /** Your router's link for the views that have an `href`. */
  linkAs?: LinkComponent;
  /** The most characters of a name (default 80, the contract's `NAME_MAX`). */
  maxLength?: number;
  /** The words, passed translated (English by default). */
  labels?: Partial<SavedViewsLabels>;
  /** Classes merged on the root. */
  className?: string;
};

const field =
  "h-9 min-w-40 flex-1 rounded-md border border-border-control bg-surface-1 px-3 text-sm text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring";
const quiet =
  "inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-fg-accent hover:bg-surface-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40";

/** A name being typed — a new view, or a rename: Enter keeps it, Esc leaves, the field is focused on mount. */
function NameForm({
  label,
  initial = "",
  confirm,
  cancel,
  maxLength,
  onSubmit,
  onCancel,
}: {
  label: string;
  initial?: string;
  confirm: string;
  cancel: string;
  maxLength: number;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = React.useState(initial);
  const clean = name.replace(/\s+/g, " ").trim();
  const submit = () => {
    if (clean) onSubmit(clean);
  };
  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <input
        autoFocus
        type="text"
        aria-label={label}
        value={name}
        maxLength={maxLength}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            onCancel();
          }
        }}
        className={field}
      />
      <button type="submit" disabled={!clean} className="inline-flex h-9 items-center rounded-md border border-accent bg-accent-soft px-3 text-xs font-semibold text-fg disabled:opacity-40 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring">
        {confirm}
      </button>
      <button type="button" onClick={onCancel} className={quiet}>
        {cancel}
      </button>
    </form>
  );
}

const Count = ({ n }: { n?: number }) =>
  n === undefined ? null : (
    <>
      {" "}
      <span aria-hidden>·</span> <span className="tabular-nums text-fg-secondary">{n}</span>
    </>
  );

/** The current id when it is one of these items, otherwise nothing selected. */
const selectedIn = (items: readonly SavedViewItem[], current: string | null | undefined) => (items.some((v) => v.id === current) ? (current ?? "") : "");

/** The name form of a save (new view) or of a rename, whichever is open; nothing when neither is. */
function ActiveForm({
  saving,
  renamed,
  labels,
  maxLength,
  onSave,
  onRename,
  setSaving,
  setRenaming,
}: {
  saving: boolean;
  renamed: SavedViewItem | undefined;
  labels: SavedViewsLabels;
  maxLength: number;
  onSave: ((name: string) => void) | undefined;
  onRename: ((id: string, name: string) => void) | undefined;
  setSaving: (on: boolean) => void;
  setRenaming: (id: string | null) => void;
}) {
  if (saving) {
    return (
      <NameForm
        label={labels.name}
        confirm={labels.confirm}
        cancel={labels.cancel}
        maxLength={maxLength}
        onCancel={() => setSaving(false)}
        onSubmit={(name) => {
          setSaving(false);
          onSave?.(name);
        }}
      />
    );
  }
  if (!renamed) return null;
  return (
    <NameForm
      label={labels.name}
      initial={renamed.label}
      confirm={labels.confirm}
      cancel={labels.cancel}
      maxLength={maxLength}
      onCancel={() => setRenaming(null)}
      onSubmit={(name) => {
        setRenaming(null);
        onRename?.(renamed.id, name);
      }}
    />
  );
}

/** The "⋯" menu of the current view: rename and delete, only the ones the host wired. */
function ViewActions({ active, labels, onRename, onDelete }: { active: SavedViewItem; labels: SavedViewsLabels; onRename?: () => void; onDelete?: () => void }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger aria-label={labels.actions(active.label)} className={cn(quiet, "px-2 text-fg-secondary")}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <circle cx="5" cy="12" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="19" cy="12" r="1.8" />
        </svg>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start" aria-label={labels.actions(active.label)}>
        {onRename ? <DropdownMenu.Item onSelect={onRename}>{labels.rename}</DropdownMenu.Item> : null}
        {onDelete ? (
          <DropdownMenu.Item tone="danger" onSelect={onDelete}>
            {labels.remove}
          </DropdownMenu.Item>
        ) : null}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

/** The views of a list: chips with counts on a wide screen, one menu on a phone; save, rename and delete; the mark of a modified view. */
export function SavedViews({ views, current, modified, onSelect, onSave, onRename, onDelete, linkAs, maxLength = 80, labels: given, className }: SavedViewsProps) {
  const labels: SavedViewsLabels = { ...savedViewsLabels, ...given, groups: { ...savedViewsLabels.groups, ...given?.groups } };
  const [saving, setSaving] = React.useState(false);
  const [renaming, setRenaming] = React.useState<string | null>(null);
  const Link = (linkAs ?? "a") as React.ElementType;
  const active = views.find((v) => v.id === current);
  const editable = (view: SavedViewItem | undefined) => Boolean(view && (view.editable ?? view.group === "mine"));
  const canChange = editable(active);
  const showSave = Boolean(onSave && modified);
  const grouped = GROUPS.map((group) => ({ group, items: views.filter((v) => v.group === group) })).filter((g) => g.items.length > 0);
  const renamed = views.find((v) => v.id === renaming);

  const form = (
    <ActiveForm saving={saving} renamed={renamed} labels={labels} maxLength={maxLength} onSave={onSave} onRename={onRename} setSaving={setSaving} setRenaming={setRenaming} />
  );

  const actions =
    canChange && active && (onRename || onDelete) ? (
      <ViewActions active={active} labels={labels} onRename={onRename ? () => setRenaming(active.id) : undefined} onDelete={onDelete ? () => onDelete(active.id) : undefined} />
    ) : null;

  const mark = modified && active ? <span className="text-xs font-semibold text-fg-secondary">({labels.modified})</span> : null;
  const saveButton = showSave && !saving ? (
    <button type="button" onClick={() => setSaving(true)} className={quiet}>
      {labels.save}
    </button>
  ) : null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* A wide screen: the bar. */}
      <div role="group" aria-label={labels.views} className="flex flex-wrap items-center gap-x-3 gap-y-2 max-md:hidden">
        {grouped.map(({ group, items }, index) => (
          <React.Fragment key={group}>
            {index > 0 ? <span aria-hidden className="h-5 w-px bg-border-default" /> : null}
            {items.some((v) => v.href) ? (
              <nav aria-label={labels.groups[group]} className="flex flex-wrap items-center gap-2">
                {items.map((view) => (
                  <ChipLink key={view.id} asChild size="sm" selected={view.id === current}>
                    <Link href={view.href ?? "#"} onClick={() => onSelect?.(view.id)}>
                      {view.label}
                      <Count n={view.count} />
                    </Link>
                  </ChipLink>
                ))}
              </nav>
            ) : (
              <Chip.Group
                type="single"
                size="sm"
                label={labels.groups[group]}
                value={selectedIn(items, current)}
                onValueChange={(id) => id && onSelect?.(id)}
              >
                {items.map((view) => (
                  <Chip key={view.id} value={view.id}>
                    {view.label}
                    <Count n={view.count} />
                  </Chip>
                ))}
              </Chip.Group>
            )}
          </React.Fragment>
        ))}
        {mark}
        {actions}
        {saveButton}
      </div>

      {/* A phone: one menu. */}
      <div className="flex flex-wrap items-center gap-2 md:hidden">
        <MenuPrimitive.Root modal={false}>
          <MenuPrimitive.Trigger className="inline-flex h-11 min-w-0 items-center gap-2 rounded-lg border border-border-control bg-surface-1 px-3.5 text-sm font-semibold text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring">
            <span className="truncate">{labels.menu(active?.label ?? labels.none)}</span>
            {mark}
            <ChevronGlyph className="h-4 w-4 shrink-0" />
          </MenuPrimitive.Trigger>
          <DropdownMenu.Content align="start">
            {grouped.map(({ group, items }, index) => (
              <React.Fragment key={group}>
                {index > 0 ? <DropdownMenu.Separator /> : null}
                <DropdownMenu.Label>{labels.groups[group]}</DropdownMenu.Label>
                <MenuPrimitive.RadioGroup value={selectedIn(items, current)}>
                  {items.map((view) =>
                    view.href ? (
                      <DropdownMenu.Item key={view.id} asChild>
                        <Link href={view.href} aria-current={view.id === current ? "page" : undefined} onClick={() => onSelect?.(view.id)}>
                          {view.label}
                          <Count n={view.count} />
                        </Link>
                      </DropdownMenu.Item>
                    ) : (
                      <DropdownMenu.RadioItem key={view.id} value={view.id} onSelect={() => onSelect?.(view.id)}>
                        {view.label}
                        <Count n={view.count} />
                      </DropdownMenu.RadioItem>
                    ),
                  )}
                </MenuPrimitive.RadioGroup>
              </React.Fragment>
            ))}
            {(showSave || (canChange && (onRename || onDelete))) && <DropdownMenu.Separator />}
            {showSave ? <DropdownMenu.Item onSelect={() => setSaving(true)}>{labels.save}</DropdownMenu.Item> : null}
            {canChange && active && onRename ? <DropdownMenu.Item onSelect={() => setRenaming(active.id)}>{labels.rename}</DropdownMenu.Item> : null}
            {canChange && active && onDelete ? (
              <DropdownMenu.Item tone="danger" onSelect={() => onDelete(active.id)}>
                {labels.remove}
              </DropdownMenu.Item>
            ) : null}
          </DropdownMenu.Content>
        </MenuPrimitive.Root>
      </div>
      {form}
    </div>
  );
}
