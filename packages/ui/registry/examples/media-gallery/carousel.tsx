import { MediaCarousel } from "@krizaka/ui/media-carousel";

// Drawn pictures (data URIs, no network); a page passes its own realisations.
const PIC = (a: string, b: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='800' height='500' fill='url(#g)'/></svg>`)}`;

// Three realisations, one at a time; the first opens its film in a lightbox. Nothing advances by itself.
export default function MediaCarouselExample() {
  return (
    <div className="max-w-xl">
      <MediaCarousel
        label="Realisations"
        slides={[
          { id: "a", src: PIC("#1d3f6b", "#4d7fb8"), alt: "The brand film", caption: "Fig. 1a", film: { src: "https://krizaka-assets.b-cdn.net/org/v1/films/film/le-monde-de-krizaka-16x9.b1c7c4ee51.mp4", title: "Film: the world of Krizaka", playLabel: "Play the film" } },
          { id: "b", src: PIC("#23496f", "#6b9bc9"), alt: "A lease read in a minute", caption: "Fig. 1b" },
          { id: "c", src: PIC("#2a3f5c", "#7aa5d6"), alt: "A return prepared, never filed", caption: "Fig. 1c" },
        ]}
      />
    </div>
  );
}
