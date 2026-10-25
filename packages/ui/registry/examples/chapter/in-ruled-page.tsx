import { ChapterIndex } from "@krizaka/ui/chapter";
import { Page } from "@krizaka/ui/page";

// Inside a page that already draws the margin, the chapters keep their number column and draw no second red line.
export default function ChapterInRuledPage() {
  return (
    <Page paper="lines" margin size="narrow">
      <ChapterIndex
        paper={false}
        label="Les chapitres"
        chapters={[
          { number: "01", title: "Pourquoi je construis Krizaka à Montréal", period: "16 oct.", href: "#chapitre-1" },
          { number: "02", title: "Un moteur d'IA sur un portable", period: "16 – 17 oct.", href: "#chapitre-2" },
          { number: "03", title: "Un résultat vide n'est pas un succès", period: "16 – 23 oct.", href: "#chapitre-3" },
        ]}
      />
    </Page>
  );
}
