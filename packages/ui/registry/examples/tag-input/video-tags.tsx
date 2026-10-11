"use client";

import { TagInput } from "@krizaka/ui/tag-input";
import * as React from "react";

// Lower case, no “#”: “#Sunset” and “sunset” are one tag.
export default function TagInputVideoTags() {
  const [tags, setTags] = React.useState(["montreal", "sunset"]);
  return (
    <TagInput
      label="Tags"
      placeholder="Add a tag"
      value={tags}
      onValueChange={setTags}
      suggestions={["timelapse", "travel", "skyline", "golden hour", "drone"]}
      normalize={(tag) => tag.trim().toLowerCase().replace(/^#/, "")}
      max={10}
      hint="Up to 10 tags, separated by commas."
      labels={{ create: (tag) => `Add “${tag}”`, remove: (tag) => `Remove ${tag}` }}
    />
  );
}
