import { ChapterIndex } from "@krizaka/ui/chapter";

const chapters = [
  ["Pourquoi je construis Krizaka à Montréal", "16 oct."],
  ["Un moteur d'IA sur un portable", "16 – 17 oct."],
  ["Ce que coûtent une image et une vidéo : mes factures", "15 – 21 oct."],
  ["D'un clip à un film : ce que nous avons raté d'abord", "17 – 21 oct."],
  ["Une seule interface, du web au Mac", "17 – 21 oct."],
  ["Les premiers produits : Yomizaka et Akinaza", "17 – 23 oct."],
  ["Un résultat vide n'est pas un succès", "16 – 23 oct."],
  ["Construire presque seul, avec des agents", "12 – 23 oct."],
] as const;

// The chapters of a story in reading order, one ruled line each: the number in the margin, the serif title is the link,
// the period quiet on the right. The latest wears a small « Nouveau » in the hue.
export default function ChapterIndexStory() {
  return (
    <ChapterIndex
      label="Les chapitres"
      newLabel="Nouveau"
      chapters={chapters.map(([title, period], i) => ({
        number: String(i + 1).padStart(2, "0"),
        title,
        period,
        href: `#chapitre-${i + 1}`,
        isNew: i === chapters.length - 1,
      }))}
    />
  );
}
