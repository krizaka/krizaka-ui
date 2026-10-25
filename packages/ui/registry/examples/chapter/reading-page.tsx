import { ChapterFoot, ChapterHead } from "@krizaka/ui/chapter";

// The latest chapter, top and bottom: its head, the reading column, and a foot with no next chapter yet.
export default function ChapterReadingPage() {
  return (
    <article className="grid gap-8">
      <ChapterHead
        number="08"
        title="Construire presque seul, avec des agents"
        period="12 – 23 octobre 2026"
        readingTime="11 min de lecture"
        faced="Une trentaine d'agents, une seule nuit"
        built="des règles écrites après chaque erreur"
        versusLabels={["Ce que j'ai affronté", "Ce qu'on a construit"]}
      />
      <p className="max-w-prose text-fg-secondary">Le texte du chapitre, dans sa colonne de lecture.</p>
      <ChapterFoot
        label="Chapitres"
        labels={{ previous: "précédent", next: "suivant" }}
        previous={{ number: "07", title: "Un résultat vide n'est pas un succès", href: "#chapitre-7" }}
        back={{ href: "#histoire", label: "Retour à l'histoire" }}
      />
    </article>
  );
}
