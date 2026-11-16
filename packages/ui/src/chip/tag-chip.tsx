// Client (`Chip`'s context). The tags of a workspace (krizaka-ts#89, `@krizaka/organize`): a name
// with a colour marker beside it. The marker is a NAME of the closed palette (`MARKERS`: blue · green · amber · red ·
// violet · gray), mapped to `--kz-tag-<name>` — a dot (≥ 3:1) or Verikora's bookmark ribbon. It sits beside the name and
// never fills the chip, and the name is always written: the colour is never the only signal.
import type { Marker } from "@krizaka/organize/contract";
import * as React from "react";

import { Chip, type ChipProps } from "./chip";
import { TAG_MARKERS } from "./markers";
import { type MarkerShape, TagMarker } from "./tag-marker";

/** The six names of the closed palette (`@krizaka/organize` `MARKERS`; a test keeps them equal). */
export const MARKERS: readonly Marker[] = TAG_MARKERS;


export type TagChipProps = ChipProps & {
  /** The tag's marker: a name of the closed palette (`blue · green · amber · red · violet · gray`). */
  marker: Marker;
  /**
   * dot · ribbon.
   * @default "dot"
   */
  shape?: MarkerShape;
};

/**
 * A tag: its marker and its name. Alone a toggle (a filter), inside `Chip.Group` an item, or `removable` (a tag worn by a
 * file) — the behaviour of `Chip`, with the marker before the name.
 */
export function TagChip({ marker, shape, children, ...props }: Readonly<TagChipProps>) {
  const content = (
    <>
      <TagMarker marker={marker} shape={shape} />
      {children}
    </>
  );
  return <Chip {...(props as ChipProps)}>{content}</Chip>;
}

export { type Marker } from "@krizaka/organize/contract";