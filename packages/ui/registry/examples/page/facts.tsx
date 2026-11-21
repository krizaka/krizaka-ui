import { Facts, Ticks } from "@krizaka/ui/page";

// `Facts`: a few mono words that say a state (published, in progress — said honestly). `Ticks`: a sentence from a
// message catalogue where words between backticks read as code.
export default function PageFacts() {
  return (
    <div className="grid max-w-xl gap-4">
      <Facts
        aria-label="Status"
        items={[
          { label: "Maven 0.1.0", tone: "ok", href: "https://java.krizaka.com" },
          { label: "Apache-2.0" },
          { label: "Gradle plugin — in progress", tone: "wip" },
        ]}
      />
      <p className="text-sm text-fg-secondary">
        <Ticks>{"Every request carries a `requestId`; a failed message lands in `.dlq`, never lost."}</Ticks>
      </p>
    </div>
  );
}
