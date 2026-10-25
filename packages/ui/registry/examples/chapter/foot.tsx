import { ChapterFoot } from "@krizaka/ui/chapter";

// The foot of a chapter's page: the previous and the next chapters as two quiet links on the lines, then one line back
// to the story. On the first chapter, leave `previous` out; on the latest, `next`.
export default function ChapterFootStory() {
  return (
    <ChapterFoot
      label="Chapitres"
      labels={{ previous: "précédent", next: "suivant" }}
      previous={{ number: "06", title: "Les premiers produits : Yomizaka et Akinaza", href: "#chapitre-6" }}
      next={{ number: "08", title: "Construire presque seul, avec des agents", href: "#chapitre-8" }}
      back={{ href: "#histoire", label: "Retour à l'histoire" }}
    />
  );
}
