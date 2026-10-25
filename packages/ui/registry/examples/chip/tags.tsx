"use client";

import { Chip, TagChip } from "@krizaka/ui/chip";
import * as React from "react";

// A client's tags (a fictitious bike workshop): the marker sits beside the name, in a dot or in a ribbon; the name says it all.
export default function ChipTags() {
  const [filter, setFilter] = React.useState(["regular"]);
  return (
    <div className="flex flex-col gap-4">
      <Chip.Group type="multiple" label="Filter clients by tag" value={filter} onValueChange={setFilter}>
        <TagChip value="regular" marker="blue">Regular</TagChip>
        <TagChip value="to-follow" marker="amber">To follow up</TagChip>
        <TagChip value="vip" marker="violet">Gift cards</TagChip>
        <TagChip value="late" marker="red">Late payer</TagChip>
      </Chip.Group>
      <div className="flex flex-wrap gap-2">
        <TagChip marker="green" shape="ribbon" removable removeLabel="Remove the tag Pick-up" onRemove={() => {}}>Pick-up</TagChip>
        <TagChip marker="gray" shape="ribbon" removable removeLabel="Remove the tag Winter storage" onRemove={() => {}}>Winter storage</TagChip>
      </div>
    </div>
  );
}
