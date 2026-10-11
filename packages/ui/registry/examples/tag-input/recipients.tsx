"use client";

import { TagInput } from "@krizaka/ui/tag-input";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Paste “a@x.com, b@y.org” and both are added; what is not an address is refused, with the reason.
export default function TagInputRecipients() {
  return (
    <TagInput
      label="Invite by e-mail"
      placeholder="name@example.com"
      defaultValue={["ines@krizaka.com"]}
      separators={[",", " "]}
      normalize={(value) => value.trim().toLowerCase()}
      validate={(value) => (EMAIL.test(value) ? null : `“${value}” is not an e-mail address.`)}
      labels={{ create: (value) => `Invite ${value}` }}
    />
  );
}
