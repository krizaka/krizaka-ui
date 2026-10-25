import { ChapterIndex } from "@krizaka/ui/chapter";

// The optional second line (`detail`): what was faced → what was built, on the next ruled line. Off by default — the
// chapter's page says it once, as its standfirst.
export default function ChapterIndexDetail() {
  return (
    <ChapterIndex
      label="Chapters"
      chapters={[
        { number: "06", title: "The first products: Yomizaka and Akinaza", period: "Oct 17 – 23", href: "#ch-6", detail: "A pay stub nobody can read → a rule that cites its article" },
        { number: "07", title: "An empty result is not a success", period: "Oct 16 – 23", href: "#ch-7", detail: "A green screen with an empty ranking → a run never delivers nothing as a success" },
        { number: "08", title: "Building almost alone, with agents", period: "Oct 12 – 23", href: "#ch-8", detail: "Thirty agents, one night → rules written after every mistake", isNew: true },
      ]}
    />
  );
}
