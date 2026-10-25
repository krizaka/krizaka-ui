"use client";

import { TagSetEditor, type TagSetValue } from "@krizaka/ui/kind-config-editor";
import * as React from "react";

const ROLES = [{ key: "owner", label: "Owner" }, { key: "manager", label: "Manager" }, { key: "staff", label: "Staff" }];

// The client tags of a fictitious hair studio, per trade: the presets, who writes, whether people add their own. The editor hands
// the value back; the product posts it. The problems are shown in place.
export default function TagSetEditorExample() {
  const [tags, setTags] = React.useState<TagSetValue>({
    writers: ["owner", "manager"], userTags: true, max: 30,
    presets: { default: [{ name: "Regular", marker: "blue" }, { name: "To follow up", marker: "amber" }, { name: "Gift cards", marker: "violet" }] },
  });
  // In a product: `kindConfigProblems(config)` of @krizaka/organize/contract, the server's own rules.
  const problems = tags.max < 1 || tags.max > 200 ? ["tags.max: 1 to 200"] : [];
  return <TagSetEditor value={tags} onChange={setTags} variant="default" roles={ROLES} problems={problems} />;
}
