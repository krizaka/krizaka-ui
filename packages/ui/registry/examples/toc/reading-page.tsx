import { Section } from "@krizaka/ui/page";
import { Toc, TocLayout } from "@krizaka/ui/toc";

const sections = [
  { id: "install", label: "Install" },
  { id: "decisions", label: "Decisions" },
  { id: "status", label: "Status" },
];

// A reading page: the contents in a sticky column, the section being read marked; a row of chips on a phone.
export default function TocReadingPage() {
  return (
    <TocLayout className="w-full max-w-4xl" toc={<Toc label="On this page" items={sections} />}>
      {sections.map((s, i) => (
        <Section key={s.id} id={s.id} title={s.label} headingSize="sm" spacing="sm" size="full" divider={i > 0}>
          <p className="text-sm text-fg-secondary">The {s.label.toLowerCase()} of the building block.</p>
        </Section>
      ))}
    </TocLayout>
  );
}
