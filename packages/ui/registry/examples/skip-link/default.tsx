import { SkipLink } from "@krizaka/ui/skip-link";

// Press Tab: the link appears, Enter lands on the content. Put it first in the shell, label already translated.
export default function SkipLinkDefault() {
  return (
    <div className="flex flex-col gap-3">
      <SkipLink href="#skip-link-content">Skip to content</SkipLink>
      <nav aria-label="Main" className="flex gap-4 text-sm"><a href="#home">Home</a><a href="#docs">Docs</a><a href="#contact">Contact</a></nav>
      <main id="skip-link-content" className="rounded-lg border border-border-default p-4 text-sm text-fg-secondary">The content starts here.</main>
    </div>
  );
}
