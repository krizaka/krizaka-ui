import { MediaCarousel } from "@krizaka/ui/media-carousel";

const POSTER = `data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'><rect width='800' height='500' fill='#23496f'/></svg>")}`;
const FILM = "https://krizaka-assets.b-cdn.net/org/v1/films/film/le-monde-de-krizaka-16x9.b1c7c4ee51.mp4";

// A French page: a silent loop previews the film (after the page's load, only on screen, with a visible pause), a press opens the
// film, and every word of the carousel and of the player is passed translated. A still under reduced motion.
export default function MediaCarouselLoopExample() {
  return (
    <div className="max-w-xl">
      <MediaCarousel
        label="Réalisations"
        slides={[
          { id: "a", src: POSTER, alt: "Le film de Krizaka", caption: "Fig. 1a", video: { mp4: FILM }, film: { src: FILM, title: "Film : le monde de Krizaka", playLabel: "Lire le film" } },
          { id: "b", src: POSTER, alt: "Un bail lu en une minute", caption: "Fig. 1b", video: { mp4: FILM } },
        ]}
        labels={{ previous: "Précédent", next: "Suivant", close: "Fermer", slide: "{n} sur {total}", pauseLoop: "Mettre l’animation en pause", playLoop: "Lancer l’animation" }}
        playerLabels={{ play: "Lire", pause: "Pause", mute: "Couper le son", unmute: "Remettre le son", volume: "Volume", seek: "Position", fullscreen: "Plein écran", exitFullscreen: "Quitter le plein écran", loading: "Chargement", error: "Cette vidéo ne peut pas être lue.", retry: "Réessayer" }}
      />
    </div>
  );
}
