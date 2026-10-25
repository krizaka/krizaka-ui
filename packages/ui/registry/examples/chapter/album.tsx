import { ChapterIndex } from "@krizaka/ui/chapter";

const CDN = "https://krizaka-assets.b-cdn.net/site/blog";
const chapters = [
  ["Pourquoi je construis Krizaka à Montréal", "Une ville, un portable, et l'envie de garder ses données chez soi.", "16 oct.", "shared/clip-old-port-480.69e43c77ff.webp", 832, 480],
  ["Un moteur d'IA sur un portable", "Des modèles locaux derrière une seule adresse lue en base.", "16 – 17 oct.", "shared/gallery-mini-picnic-480.851511db06.webp", 1360, 768],
  ["Ce que coûtent une image et une vidéo", "Les factures, ligne par ligne, et ce que nous avons coupé.", "15 – 21 oct.", "shared/compare-montreal-winter-sd35-480.b4ee6d3ee1.webp", 1024, 1024],
  ["D'un clip à un film", "Ce que nous avons raté d'abord, puis le relais.", "17 – 21 oct.", "cinematic-ai-videos/relay-medina-cover-480.4165085446.webp", 1351, 760],
] as const;

// The blog's chapters as an album: each cover a taped print, the prints facing each other from left to right, beside
// them the number in the margin, the serif title (the link), one short line and the period. The latest is « Nouveau ».
export default function ChapterAlbumStory() {
  return (
    <ChapterIndex
      variant="album"
      label="Les chapitres"
      newLabel="Nouveau"
      chapters={chapters.map(([title, detail, period, cover, width, height], i) => ({
        number: `§ ${i + 1}`,
        title,
        detail,
        period,
        cover: { src: `${CDN}/${cover}`, width, height },
        href: `#chapitre-${i + 1}`,
        isNew: i === chapters.length - 1,
      }))}
    />
  );
}
