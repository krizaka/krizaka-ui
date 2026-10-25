import { ChapterHead } from "@krizaka/ui/chapter";

// The head of a chapter's page: the number in the margin, the title, one quiet line (period · reading time), and the
// faced → built line once, as the standfirst. The arrow is drawn; a screen reader hears the two labels instead.
export default function ChapterHeadStory() {
  return (
    <ChapterHead
      number="07"
      title="Un résultat vide n'est pas un succès"
      period="16 – 23 octobre 2026"
      readingTime="9 min de lecture"
      faced="Un écran vert avec un classement vide"
      built="un run ne livre jamais un résultat vide comme un succès"
      versusLabels={["Ce que j'ai affronté", "Ce qu'on a construit"]}
    />
  );
}
